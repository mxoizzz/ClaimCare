# ClaimClear: Intelligent Medical Insurance Assistant
Track: FIN01 - Policy-to-Patient | Stage: HackMatrix 5.0

<video src="./assets/demo.mp4" controls="controls" width="100%" autoplay loop muted></video>

[**▶ Watch Full Technical Demonstration Video (Google Drive)**](https://drive.google.com/file/d/1D87ps1g6djjsU2ivHdNpwujoKK5t6nnH/view?usp=drive_link)

## Overview
ClaimClear is an advanced AI-powered assistant designed to democratize and simplify complex medical insurance policies. By leveraging a local RAG (Retrieval-Augmented Generation) pipeline, users can upload unstructured insurance PDF documents and instantly extract structured coverage data, calculate treatment cost estimations based on their extracted policy limits, and ask natural language questions with verified citations.

## System Architecture

### Frontend Application
- Framework: Next.js (React)
- Styling: Tailwind CSS v4
- Features: Real-time dynamic CSS variable theme injection, animated landing page layout, interactive document uploader, and segmented control panels.

### Backend Pipeline
- Framework: FastAPI (Python)
- Document Parsing: PyMuPDF
- Vector Database: ChromaDB (SQLite-backed persistent physical storage)
- LLM Engine: Llama-3 via OpenRouter API

## Core Features
1. PDF Extraction Engine: Parses documents using Llama-3 to aggressively extract complex constraints such as Sum Insured, Deductibles, Network Tiers (In-Network/PPO), Cashless configurations, and Pre/Post Coverage periods.
2. Cost Estimator: Uses the extracted structural limits to run fallback algorithms against benchmarked medical procedures (like Cataract Surgery or Bypass Surgery), mathematically calculating exact Out-Of-Pocket values for the patient.
3. RAG Chat Assistant: Cross-references the user's natural language queries exclusively against their uploaded policy, ensuring zero hallucination.

## Local Setup Instructions

### 1. Client Setup (Next.js)
Open a terminal and navigate to the client directory:
```bash
cd client
npm install
npm run dev
```
The frontend will launch natively on http://localhost:3000 (or 3001).

### 2. Server Setup (FastAPI)
Open a new terminal and navigate to the server directory:
```bash
cd server
python -m venv venv
```

Activate the virtual environment:
Windows: `.\venv\Scripts\activate`
macOS/Linux: `source venv/bin/activate`

Install dependencies and start the backend:
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```
The FastAPI backend will bind to http://localhost:8000.

## Environment Variables
Create a `.env` file inside the `server/` directory and configure the primary LLM provider key:
```env
OPENROUTER_API_KEY=your_api_key_here
```

## Deployment Considerations
Because ChromaDB persists vector embeddings directly to the disk via an embedded SQLite instance, deploying the backend to serverless environments (like Vercel or AWS Lambda) will result in wiped memory states after each request. 
To deploy this architecture for production usage:
1. Frontend: Deploy the `/client` directory to Vercel via standard GitHub integration.
2. Backend: Deploy the `/server` directory to a managed service with Persistent Disk support (such as Render.com Web Services) mapping the deployment volume back to `/chroma_db`.
