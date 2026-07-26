# ADHIKARAI - System Architecture

The ADHIKARAI platform is arranged around decoupled modules that coordinate via REST APIs.

## 1. Client Layer
- **Web App**: Developed in React.js (Vite), offering a responsive dashboard for multi-lingual access.

## 2. API Gateway & Business Logic (Backend)
- **Node.js (Express)**: Manages standard operations:
  - Authentication (JWT), User Profiles
  - Scheme Management CRUD
  - Communication with the Python AI module

## 3. Intelligent Engine (Python_AI)
- **FastAPI**: Provides high-performance endpoints for the LLM requests.
- **RAG Pipeline**: Encodes documents using Sentence Transformers and fetches relevant context via Vector databases, feeding it into LangChain.
- **Rule Engine**: Evaluates JSON profiles against eligibility criteria models.

## 4. Data Layer
- **MySQL Cloud (Railway)**: Normalized database hosting user accounts, scheme rules, and application status.
- **Vector Database**: Used by Python_AI (Chroma/FAISS) to run semantic similarity checks.

## Cloud & Security
Containerized using Docker and secured via Helmet, parameterized SQL, and robust local execution practices.
