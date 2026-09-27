import fitz  # PyMuPDF
from typing import List, Dict

def parse_pdf(file_path: str) -> List[Dict[str, str]]:
    """
    Parses a PDF file and returns a list of dictionaries containing text and page metadata.
    This preserves the page numbers for accurate citations later in the RAG pipeline.
    """
    document = fitz.open(file_path)
    extracted_pages = []
    
    for page_num in range(len(document)):
        page = document.load_page(page_num)
        text = page.get_text("text").strip()
        
        if text:
            extracted_pages.append({
                "page": page_num + 1,  # 1-indexed for user readability
                "content": text
            })
            
    return extracted_pages
