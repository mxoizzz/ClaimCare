import os
import uuid
from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load Env Vars
load_dotenv()

from api.models import UploadResponse, PolicyProfile
from services.document_parser import parse_pdf
from services.ai_extractor import extract_policy_profile
from services.vector_store import index_document

app = FastAPI(
    title="ClaimClear API",
    description="API for parsing insurance policies and estimating costs",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "Welcome to ClaimClear API"}

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Uploads a PDF, parses it, extracts the structured profile, and triggers background indexing.
    """
    try:
        doc_id = str(uuid.uuid4())
        file_path = os.path.join("uploads", f"{doc_id}.pdf")
        
        with open(file_path, "wb") as f:
            f.write(await file.read())
            
        # 1. Parse Document -> get dicts of page text
        parsed_pages = parse_pdf(file_path)
        
        # 2. Extract Profile via LLM
        profile_dict = extract_policy_profile(parsed_pages)
        
        # 3. Index Vector Store
        index_document(doc_id, parsed_pages)

        return UploadResponse(
            message="Document processed successfully",
            document_id=doc_id,
            policy_profile=profile_dict
        )
    except Exception as e:
        import traceback
        return {"error": str(e), "traceback": traceback.format_exc()}
