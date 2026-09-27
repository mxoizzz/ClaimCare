import os
from typing import List, Dict
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.schema import Document

# Initialize embedding model (Make sure OPENAI_API_KEY is tested/set)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vector_db_dir = "./chroma_db"

def index_document(document_id: str, pages: List[Dict[str, str]]):
    """
    Chunks the document text and indexes it in Chroma DB using the document_id as a collection identifier.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    
    docs = []
    for page in pages:
        chunks = text_splitter.split_text(page["content"])
        for chunk in chunks:
            # We bundle the page number into metadata for later citation
            doc = Document(page_content=chunk, metadata={"page": page["page"], "doc_id": document_id})
            docs.append(doc)
            
    # Depending on version this might be slightly different - using Chroma.from_documents
    db = Chroma.from_documents(docs, embeddings, persist_directory=os.path.join(vector_db_dir, document_id))
    db.persist()
    return True

def retrieve_context(document_id: str, query: str, top_k: int = 3) -> str:
    """
    Retrieves the top k most relevant chunks from the vector store for a given query.
    Returns a unified context string.
    """
    db_path = os.path.join(vector_db_dir, document_id)
    if not os.path.exists(db_path):
        return ""
        
    db = Chroma(persist_directory=db_path, embedding_function=embeddings)
    results = db.similarity_search(query, k=top_k)
    
    context = ""
    for r in results:
        context += f"\n[Page {r.metadata.get('page')}] {r.page_content}\n"
    
    return context
