# Simple Document Retrieval Augmented Generation (RAG) Module

MOCK_KNOWLEDGE_BASE = [
    {
        "scheme": "Pradhan Mantri Awas Yojana (PMAY)",
        "content": "PMAY offers an interest subsidy of up to 6.5% on housing loans for EWS and LIG categories. Mandatory documents include Aadhaar Card, Income Certificate, and Land/House ownership documents."
    },
    {
        "scheme": "PM-KISAN Samman Nidhi",
        "content": "PM-KISAN provides Rs 6,000 per year in three equal installments directly into bank accounts of small and marginal farmers across all states."
    }
]

def query_knowledge_base(query_text: str) -> dict:
    query = query_text.lower()
    matches = []

    for item in MOCK_KNOWLEDGE_BASE:
        if any(word in item["content"].lower() or word in item["scheme"].lower() for word in query.split()):
            matches.append(item)

    if not matches:
        matches = [MOCK_KNOWLEDGE_BASE[0]]

    return {
        "query": query_text,
        "retrieved_context": matches[0]["content"],
        "scheme_name": matches[0]["scheme"]
    }
