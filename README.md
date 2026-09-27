# ClaimClear
**Track:** FIN01 — Policy-to-Patient · **Stage:** Hackathon Round 1

ClaimClear is an AI-powered assistant that lets a user upload an insurance policy document and interact with it conversationally. It extracts structured coverage information (limits, exclusions, waiting periods, deductibles, sub-limits), answers eligibility and coverage questions with verified page/section-level citations, and—when a treatment scenario is provided—estimates likely treatment cost, potentially covered amount, and out-of-pocket expense.

## Tech Stack
-   **Frontend:** Next.js (React) + Tailwind CSS
-   **Backend:** FastAPI (Python)
-   **AI & Logic:** LangChain / LlamaIndex (OpenAI) + PyMuPDF for parser

## Repository Structure
-   `/client`: User Interface and Web Application (Next.js)
-   `/server`: API Backend and AI Processing (FastAPI)
-   `/data`: Mock datasets for treatment costs and sample policies.

## How to run locally

### Client
```bash
cd client
npm install
npm run dev
```

### Server
```bash
cd server
python -m venv venv
# Activate venv:
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
