from rule_engine import evaluate_eligibility
from rag_pipeline import query_knowledge_base

class AgenticNavigator:
    def __init__(self):
        pass

    def process_chat(self, user_message: str, user_profile: dict = None) -> dict:
        profile = user_profile or {}
        missing_fields = []

        # Check for missing critical reasoning attributes
        if not profile.get("annual_income"):
            missing_fields.append("annual_income")
        if not profile.get("state"):
            missing_fields.append("state")

        # RAG context lookup
        rag_res = query_knowledge_base(user_message)

        if missing_fields:
            prompt_question = f"To give you an exact match, I need a few more details: What is your approximate annual family income and state?"
            return {
                "response": prompt_question,
                "missing_information": missing_fields,
                "retrieved_context": rag_res["retrieved_context"]
            }

        # Rule engine evaluation
        sample_rule = {"min_age": 18, "max_age": 65, "max_income": 600000}
        eligibility = evaluate_eligibility(profile, sample_rule)

        ai_answer = (
            f"Based on your profile ({profile.get('age', 30)} years old, income ₹{profile.get('annual_income', 0):,}), "
            f"you have a {eligibility['match_score']}% eligibility match for {rag_res['scheme_name']}.\n"
            f"WHY: {eligibility['why_eligible']}"
        )

        return {
            "response": ai_answer,
            "eligibility_analysis": eligibility,
            "retrieved_context": rag_res["retrieved_context"]
        }
