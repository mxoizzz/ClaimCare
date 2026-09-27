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

@app.post("/api/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    Uploads a PDF, parses it, extracts the structured profile, and triggers background indexing.
    """
    doc_id = str(uuid.uuid4())
    file_path = os.path.join("uploads", f"{doc_id}.pdf")
    
    with open(file_path, "wb") as f:
        f.write(await file.read())
        
    # 1. Parse Document -> get dicts of page text
    parsed_pages = parse_pdf(file_path)
    
    # 2. Extract Profile via LLM
    profile_dict = extract_policy_profile(parsed_pages)
    
    # 3. Index Vector Store
    # In a real app this would be a background task to prevent request timeout,
    # but for prototype simplicity we'll do it synchronously or we can use background task.
    # index_document(doc_id, parsed_pages)
    
    # Alternatively using BackgroundTasks if we pass it to the parameter list:
    # background_tasks.add_task(index_document, doc_id, parsed_pages)
    # Let's just do it directly so data is ready instantly for the demo
    index_document(doc_id, parsed_pages)

    return UploadResponse(
        message="Document processed successfully",
        document_id=doc_id,
        policy_profile=profile_dict
    )
