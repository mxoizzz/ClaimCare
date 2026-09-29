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
    sum_insured: Optional[int] = Field(default=None, description="The total sum insured amount for the policy")
    deductible: Optional[int] = Field(default=None, description="The mandatory deductible amount, if found")
    waiting_periods: Dict[str, str] = Field(default_factory=dict, description="Mapping of condition to the waiting period")
    room_rent_cap: Optional[str] = Field(default=None, description="Room rent capping limits or conditions")
    copayment_terms: Optional[str] = Field(default=None, description="Co-payment rules")
    exclusions: List[str] = Field(default_factory=list, description="List of specific condition exclusions mentioned")
    
    # New informative fields
    policy_type: Optional[str] = Field(default="Standard", description="Type of healthcare policy (e.g., HDHP, PPO, EPO)")
    cashless_facility: bool = Field(default=True, description="Indicates if a cashless network facility is included")
    pre_and_post_coverage: Optional[str] = Field(default=None, description="Pre and post hospitalization coverage constraints (e.g. 30 days / 60 days)")
    network_tier: Optional[str] = Field(default="In-Network Only", description="Strictness of the hospital network")
    no_claim_bonus: Optional[str] = Field(default=None, description="Details on cumulative no claim bonuses")
