import os
import uuid
from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load Env Vars
load_dotenv()

from api.models import UploadResponse, PolicyProfile, ChatRequest, ChatResponse, CostEstimateRequest, CostEstimateResponse
from services.document_parser import parse_pdf
from services.ai_extractor import extract_policy_profile
from services.vector_store import index_document, retrieve_context
from services.ai_chat import generate_chat_response
from services.cost_estimator import estimate_treatment_cost
import json

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
        
        # Save profile for cost estimation
        with open(f"uploads/{doc_id}_profile.json", "w") as pf:
            json.dump(profile_dict, pf)
        
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

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_document(request: ChatRequest):
    """
    Takes a document ID and question, queries the Vector DB for context, 
    and returns a cited answer.
    """
    try:
        # 1. Retrieve the top relevant chunks using ChromaDB
        context = retrieve_context(request.document_id, request.question, top_k=4)
        
        # 2. If no context found (document ID bad or vector store missing)
        if not context:
            return ChatResponse(
                answer="I could not find that document in my database. Did you upload it first?", 
                citation=None, 
                confidence="Low"
            )
            
        # 3. Generate answer via LLM
        response_data = generate_chat_response(request.question, context)
        return ChatResponse(**response_data)
        
    except Exception as e:
        return ChatResponse(
            answer=f"An error occurred while answering: {str(e)}", 
            citation=None, 
            confidence="Low"
        )

@app.post("/api/estimate", response_model=CostEstimateResponse)
async def get_cost_estimate(request: CostEstimateRequest):
    try:
        profile_path = f"uploads/{request.document_id}_profile.json"
        if not os.path.exists(profile_path):
            return CostEstimateResponse(
                total_estimate_range=[0,0], covered_amount=0, out_of_pocket=0, 
                reasoning=["Document profile not found. Please re-upload."], missing_info="Profile DB Missing"
            )
            
        with open(profile_path, "r") as pf:
            profile_dict = json.load(pf)
            
        profile = PolicyProfile(**profile_dict)
        estimate_data = estimate_treatment_cost(request, profile)
        return CostEstimateResponse(**estimate_data)
        
    except Exception as e:
        return CostEstimateResponse(
            total_estimate_range=[0,0], covered_amount=0, out_of_pocket=0, reasoning=[str(e)]
        )
