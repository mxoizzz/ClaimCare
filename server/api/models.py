from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class UploadResponse(BaseModel):
    message: str
    document_id: str
    policy_profile: Dict[str, Any]

class ChatRequest(BaseModel):
    document_id: str
    question: str

class ChatResponse(BaseModel):
    answer: str
    citation: Optional[str] = None
    confidence: str = Field(description="High, Medium, or Low")

class CostEstimateRequest(BaseModel):
    document_id: str
    procedure: str
    city_tier: int = Field(description="1 or 2 for city tier pricing")
    pre_existing: bool = False
    months_on_policy: int = 0

class CostEstimateResponse(BaseModel):
    total_estimate_range: List[int]
    covered_amount: int
    out_of_pocket: int
    reasoning: List[str]
    missing_info: Optional[str] = None

class PolicyProfile(BaseModel):
    sum_insured: Optional[int] = Field(description="The total sum insured amount for the policy")
    deductible: Optional[int] = Field(description="The mandatory deductible amount, if found")
    waiting_periods: Dict[str, str] = Field(description="Mapping of condition to the waiting period")
    room_rent_cap: Optional[str] = Field(description="Room rent capping limits or conditions")
    copayment_terms: Optional[str] = Field(description="Co-payment rules")
    exclusions: List[str] = Field(description="List of specific condition exclusions mentioned")
