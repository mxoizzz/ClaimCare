import os
import re
import json
from typing import List, Dict, Any
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from api.models import PolicyProfile

def extract_policy_profile(pages: List[Dict[str, str]]) -> Dict[str, Any]:
    """
    Takes the parsed document pages and extracts the structured PolicyProfile using OpenRouter.
    """
    full_text = "\n\n".join([f"--- Page {p['page']} ---\n{p['content']}" for p in pages])
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("OPENROUTER_API_KEY missing!")
        return PolicyProfile(waiting_periods={}, exclusions=[]).model_dump()
        
    try:
        # Connect to OpenRouter using ChatOpenAI wrapper
        llm = ChatOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
            model="openai/gpt-4o-mini",
            max_tokens=2000,
            temperature=0,
            model_kwargs={
                "extra_headers": {
                    "HTTP-Referer": "http://localhost:3000", # Optional but requested by OpenRouter
                    "X-Title": "ClaimClear Prototype",
                }
            }
        )
        
        # Some OpenRouter models don't support function calling well, so we use explicit JSON prompts
        prompt = PromptTemplate.from_template(
            """You are an expert insurance policy analyzer. Review the policy document text.
Extract the key terms into the following JSON schema. DO NOT output anything except raw JSON. DO NOT wrap it in Markdown blocks or backticks.
schema:
{{
  "sum_insured": 500000,
  "deductible": 0,
  "waiting_periods": {{"pre_existing": "24 months"}},
  "room_rent_cap": "Single Private Room",
  "copayment_terms": "20% copay",
  "exclusions": ["Dental", "Maternity"]
}}
If a value is not found, use null or empty appropriately.

Document Text:
{text}
"""
        )
        
        chain = prompt | llm
        result_message = chain.invoke({"text": full_text[:15000]})
        result_text = result_message.content
        
        with open("llm_debug_output.txt", "w", encoding="utf-8") as f:
            f.write(result_text)
            
        cleaned_result = result_text.strip()
        
        # Use regex to find a JSON object in the text
        match = re.search(r'\{.*\}', cleaned_result, re.DOTALL)
        if match:
            cleaned_result = match.group(0)
            
        data = json.loads(cleaned_result.strip())
        
        # Validate against schema via Pydantic
        profile = PolicyProfile(**data)
        return profile.model_dump()
        
    except Exception as e:
        print(f"Extraction error: {e}")
        with open("error_log.txt", "w") as f:
            f.write(str(e))
        return PolicyProfile(waiting_periods={}, exclusions=[]).model_dump()
