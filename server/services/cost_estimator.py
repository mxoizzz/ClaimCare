import json
import os
from typing import Dict, Any
from api.models import CostEstimateRequest, CostEstimateResponse, PolicyProfile

def load_cost_data() -> list:
    cost_file = os.path.join(os.path.dirname(__file__), "..", "..", "data", "treatment_costs.json")
    if not os.path.exists(cost_file):
        return []
    with open(cost_file, "r") as f:
        return json.load(f)

def estimate_treatment_cost(request: CostEstimateRequest, profile: PolicyProfile) -> Dict[str, Any]:
    costs = load_cost_data()
    
    # 1. Find procedure
    procedure_data = None
    for c in costs:
        if c["procedure"].lower() == request.procedure.lower():
            procedure_data = c
            break
            
    if not procedure_data:
        return {
            "total_estimate_range": [0, 0],
            "covered_amount": 0,
            "out_of_pocket": 0,
            "reasoning": ["Procedure not found in current cost database. Cannot estimate."],
            "missing_info": "Treatment cost data is missing."
        }
        
    # 2. Get cost range based on tier
    tier_key = f"tier_{request.city_tier}_city_cost_range"
    cost_range = procedure_data.get(tier_key, procedure_data.get("tier_1_city_cost_range"))
    avg_cost = sum(cost_range) // 2
    
    reasoning = [f"Average cost for {request.procedure} in Tier {request.city_tier} city is roughly ${avg_cost}."]
    
    # 3. Check Waiting Periods
    if request.pre_existing:
        we_str = profile.waiting_periods.get("pre_existing", "").lower()
        if "24" in we_str and request.months_on_policy < 24:
            reasoning.append("Coverage Denied: 24-month pre-existing condition waiting period not met.")
            return {
                "total_estimate_range": cost_range,
                "covered_amount": 0,
                "out_of_pocket": avg_cost,
                "reasoning": reasoning
            }

    # 4. Check Exclusions
    for ex in profile.exclusions:
        if ex.lower() in procedure_data["category"].lower() or ex.lower() in request.procedure.lower():
            reasoning.append(f"Coverage Denied: Matches explicit policy exclusion ({ex}).")
            return {
                "total_estimate_range": cost_range,
                "covered_amount": 0,
                "out_of_pocket": avg_cost,
                "reasoning": reasoning
            }

    # 5. Calculate Copay & Deductibles
    deductible = profile.deductible if profile.deductible is not None else 100  # Fallback realistic deductible for the demo
    reasoning.append(f"Applied deductible: ${deductible}" + (" (Baseline Fallback)" if profile.deductible is None else ""))
    
    remaining_after_deductible = max(0, avg_cost - deductible)
    
    # parse copay (e.g. "20% copay")
    copay_pct = 10  # Hackathon baseline fallback
    if profile.copayment_terms and "%" in profile.copayment_terms:
        try:
            copay_pct = int(profile.copayment_terms.split("%")[0].split()[-1])
        except:
            pass
    reasoning.append(f"Applied Co-pay: {copay_pct}%" + (" (Baseline Fallback)" if not profile.copayment_terms else ""))
            
    copay_amount = int(remaining_after_deductible * (copay_pct / 100.0))
    covered_amount = remaining_after_deductible - copay_amount
    out_of_pocket = deductible + copay_amount
    
    # 6. Apply Sum Insured Cap
    effective_sum_insured = profile.sum_insured if profile.sum_insured is not None else 50000 # Realistic cap
    if covered_amount > effective_sum_insured:
        reasoning.append(f"Cap hit: Coverage exceeds maximum sum insured of ${effective_sum_insured}" + (" (Simulated Baseline)" if profile.sum_insured is None else ""))
        out_of_pocket += (covered_amount - effective_sum_insured)
        covered_amount = effective_sum_insured
    else:
        if profile.sum_insured is None:
             reasoning.append("Warning: Could not parse Maximum Sum Insured from PDF. Applied structural $50,000 baseline cap for calculation.")
        
    reasoning.append(f"Estimated Patient Out-of-Pocket: ${out_of_pocket}")
    
    return {
        "total_estimate_range": cost_range,
        "covered_amount": covered_amount,
        "out_of_pocket": out_of_pocket,
        "reasoning": reasoning
    }
