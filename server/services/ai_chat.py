import os
import json
import re
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from api.models import ChatResponse

def generate_chat_response(question: str, context: str) -> dict:
    """
    Takes a user question and retrieved vector DB context, and generates a cited answer
    by constraining the LLM to output a JSON payload via OpenRouter.
    """
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("OPENROUTER_API_KEY missing!")
        return {"answer": "API Key Missing", "citation": None, "confidence": "Low"}
        
    try:
        # Same reliable setup with gpt-4o-mini
        llm = ChatOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
            model="openai/gpt-4o-mini",
            max_tokens=1000,
            temperature=0,
            model_kwargs={
                "extra_headers": {
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "ClaimClear Prototype",
                }
            }
        )
        
        prompt = PromptTemplate.from_template(
            """You are a strict insurance advisor. Answer the user's question ONLY using the provided source context.
Do not invent information. If the context does not contain the answer, explicitly state that the information is missing.

Extract your response into the following JSON schema. DO NOT output anything except raw JSON. DO NOT wrap it in Markdown blocks or backticks.
schema:
{{
  "answer": "Yes, maternity is covered with a 9 month waiting period.",
  "citation": "Page 4", 
  "confidence": "High"  // Must be "High", "Medium", or "Low"
}}

Rules for Citations:
- You will see [Page X] markers in the context. Use them to populate the "citation" field.
- If no context provides the answer, set confidence to "Low" and explicitly state "I don't have enough information".

=== Source Context ===
{context}

=== User Question ===
{question}
"""
        )
        
        chain = prompt | llm
        result_message = chain.invoke({"context": context, "question": question})
        result_text = result_message.content
        
        cleaned_result = result_text.strip()
        
        # Use regex to find a JSON object in the text
        match = re.search(r'\{.*\}', cleaned_result, re.DOTALL)
        if match:
            cleaned_result = match.group(0)
            
        data = json.loads(cleaned_result.strip())
        
        # Ensure it conforms to ChatResponse schema
        return ChatResponse(**data).model_dump()
        
    except Exception as e:
        print(f"Chat error: {e}")
        return {"answer": f"Error generating answer. {str(e)}", "citation": None, "confidence": "Low"}
