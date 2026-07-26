// src/config/profileFields.js
// Matches UserProfiles table schema (15+ citizen datapoints)
export const profileFields = {
  personal: [
    { name: "fullName", type: "text", label: "Full Name", required: true, validation: "string" },
    { name: "dateOfBirth", type: "date", label: "Date of Birth", required: true, validation: "date" },
    { name: "gender", type: "radio", label: "Gender", required: true, options: ["Male", "Female", "Other"] },
    { name: "maritalStatus", type: "select", label: "Marital Status", options: ["Single", "Married", "Divorced", "Widowed"] },
    { name: "nationality", type: "text", label: "Nationality", default: "Indian" },
    { name: "aadharNumber", type: "text", label: "Aadhaar Number", required: true, mask: "xxxx-xxxx-xxxx" },
    { name: "panCard", type: "text", label: "PAN Card (Optional)", mask: "xxxxx-xxxx" }
  ],
  contact: [
    { name: "email", type: "email", label: "Email Address", required: true, disabled: true },
    { name: "phoneNumber", type: "tel", label: "Phone Number", required: true },
    { name: "state", type: "select", label: "State", required: true, options: ["Maharashtra", "Tamil Nadu", "Delhi", "Gujarat", "Karnataka", "Uttar Pradesh", "West Bengal", "Bihar", "Rajasthan", "Madhya Pradesh", "Other"] },
    { name: "district", type: "select", label: "District", required: true, options: ["Mumbai", "Chennai", "New Delhi", "Ahmedabad", "Bengaluru", "Pune", "Jaipur", "Lucknow", "Kolkata", "Other"] },
    { name: "pincode", type: "text", label: "Pincode", required: true },
    { name: "address", type: "textarea", label: "Address", required: true }
  ],
  economic: [
    { name: "annualIncome", type: "range", label: "Annual Income (₹)", min: 0, max: 5000000, step: 10000 },
    { name: "employmentType", type: "select", label: "Employment Type", options: ["Salaried", "Self-Employed", "Unemployed", "Student", "Retired", "Business"] },
    { name: "occupation", type: "text", label: "Occupation" },
    { name: "familyMembers", type: "number", label: "Family Members Count", min: 1, max: 20 },
    { name: "bplCardStatus", type: "boolean", label: "BPL Card Status" },
    { name: "casteCategory", type: "select", label: "Caste Category", options: ["General", "OBC", "SC", "ST", "EWS"] },
    { name: "educationLevel", type: "select", label: "Education Level", options: ["Below 10th", "10th Pass", "12th Pass", "Graduate", "Post Graduate", "Doctorate"] }
  ]
};
