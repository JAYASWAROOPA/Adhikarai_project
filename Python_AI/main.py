from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from rule_engine import evaluate_eligibility
from agent import AgenticNavigator

app = FastAPI(
    title="ADHIKARAI AI Engine API",
    description="Agentic AI Reasoning, Rule Engine & RAG Service for Government Schemes",
    version="1.0.0"
)

agent = AgenticNavigator()

class ReasoningRequest(BaseModel):
    profile: Dict[str, Any]
    rule: Dict[str, Any]

class ChatRequest(BaseModel):
    user_message: str
    profile: Optional[Dict[str, Any]] = None

@app.get("/")
def read_root():
    return {"status": "ACTIVE", "service": "ADHIKARAI Python AI Engine"}

@app.post("/api/reason")
def reason_eligibility(req: ReasoningRequest):
    return evaluate_eligibility(req.profile, req.rule)

@app.post("/api/chat")
def chat_agent(req: ChatRequest):
    return agent.process_chat(req.user_message, req.profile)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
