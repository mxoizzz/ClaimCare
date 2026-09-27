import os
import json
from typing import List, Dict, Any
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from api.models import PolicyProfile

def extract_policy_profile(pages: List[Dict[str, str]]) -> Dict[str, Any]:
    """
    Takes the parsed document pages and extracts the structured PolicyProfile using an LLM.
    """
    # Combine first few pages or strategically sample pages to avoid token limit if needed
    # For prototype, we'll combine all content (assuming docs fit in context window like GPT-4o)
    full_text = "\n\n".join([f"--- Page {p['page']} ---\n{p['content']}" for p in pages])
    
    # We use function calling/structured output to guarantee JSON schema
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    structured_llm = llm.with_structured_output(PolicyProfile)
    
    prompt = f"""
    You are an expert insurance policy analyzer. Review the following policy document text 
    and extract the key terms into the requested structured format. 
    If a value is not found or ambiguous, leave it null or empty. DO NOT GUESS.
    
    Document Text:
    {full_text[:50000]}  # limit text length just in case for the prototype
    """
    
    try:
        response: PolicyProfile = structured_llm.invoke(prompt)
        return response.model_dump()
    except Exception as e:
        print(f"Extraction error: {e}")
        # Return empty structured profile on failure
        return PolicyProfile(waiting_periods={}, exclusions=[]).model_dump()
