# Rule Engine for Scheme Eligibility Reasoning

def evaluate_eligibility(profile: dict, rule: dict) -> dict:
    reasons_eligible = []
    reasons_ineligible = []
    total_checks = 0
    passed_checks = 0

    # 1. Age Check
    if rule.get("min_age") is not None or rule.get("max_age") is not None:
        total_checks += 1
        age = profile.get("age", 0)
        min_age = rule.get("min_age", 0)
        max_age = rule.get("max_age", 120)

        if min_age <= age <= max_age:
            passed_checks += 1
            reasons_eligible.append(f"Age ({age}) is within valid range [{min_age}-{max_age}].")
        else:
            reasons_ineligible.append(f"Age ({age}) must be between {min_age} and {max_age}.")

    # 2. Income Check
    if rule.get("max_income") is not None:
        total_checks += 1
        income = profile.get("annual_income", 0)
        max_income = rule.get("max_income")

        if income <= max_income:
            passed_checks += 1
            reasons_eligible.append(f"Annual income (₹{income:,.2f}) is below maximum limit (₹{max_income:,.2f}).")
        else:
            reasons_ineligible.append(f"Annual income (₹{income:,.2f}) exceeds limit of ₹{max_income:,.2f}.")

    # 3. Caste / Category Check
    if rule.get("required_category"):
        total_checks += 1
        req_cat = rule.get("required_category")
        user_cat = profile.get("category", "")

        if req_cat.lower() == user_cat.lower() or req_cat.lower() == "all":
            passed_checks += 1
            reasons_eligible.append(f"Category ({user_cat}) matches required category ({req_cat}).")
        else:
            reasons_ineligible.append(f"Requires category '{req_cat}', but profile is '{user_cat}'.")

    # 4. Farmer Classification Check
    if rule.get("must_be_farmer"):
        total_checks += 1
        if profile.get("is_farmer"):
            passed_checks += 1
            reasons_eligible.append("Verified as a landholding farmer.")
        else:
            reasons_ineligible.append("Requires applicant to be a landholding farmer.")

    # Calculate match score
    match_score = int((passed_checks / total_checks * 100)) if total_checks > 0 else 100
    is_eligible = len(reasons_ineligible) == 0

    return {
        "is_eligible": is_eligible,
        "match_score": match_score,
        "why_eligible": " ".join(reasons_eligible) if reasons_eligible else "No strict criteria restricted.",
        "why_not_eligible": " ".join(reasons_ineligible) if reasons_ineligible else "None. All criteria satisfied!"
    }
