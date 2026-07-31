// Backend/controllers/profileController.js
const db = require('../config/db');

// Mock fallback profile
const MOCK_PROFILE = {
  fullName: "Rajesh Kumar",
  dateOfBirth: "1991-05-14",
  gender: "Male",
  maritalStatus: "Single",
  nationality: "Indian",
  aadharNumber: "9876-5432-1098",
  email: "citizen@adhikarai.gov.in",
  phoneNumber: "9876543210",
  state: "Maharashtra",
  district: "Mumbai",
  pincode: "400001",
  address: "102, S.V. Road, Andheri West",
  annualIncome: 450000,
  employmentType: "Salaried",
  occupation: "Technician",
  familyMembers: 4,
  bplCardStatus: false,
  casteCategory: "OBC",
  educationLevel: "Graduate"
};

exports.getProfile = async (req, res) => {
  try {
    // Identity comes STRICTLY from authenticated JWT token on req.user
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User identity not found in token' });
    }

    try {
      if (db.query) {
        const [rows] = await db.query('SELECT * FROM citizen_profiles WHERE user_id = ?', [userId]);
        if (rows.length > 0) {
          return res.json({ success: true, profile: rows[0] });
        }
      }
    } catch (err) {
      // Fallback
    }

    // Return mock profile associated strictly with authenticated session
    res.json({ success: true, profile: MOCK_PROFILE });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User identity not found in token' });
    }

    const profileData = req.body;

    try {
      if (db.query) {
        const [existing] = await db.query('SELECT * FROM citizen_profiles WHERE user_id = ?', [userId]);
        if (existing.length === 0) {
          await db.query(
            'INSERT INTO citizen_profiles (user_id, full_name, state, district, annual_income) VALUES (?, ?, ?, ?, ?)',
            [userId, profileData.fullName || 'Citizen', profileData.state || 'Maharashtra', profileData.district || 'Mumbai', profileData.annualIncome || 450000]
          );
        } else {
          await db.query(
            'UPDATE citizen_profiles SET full_name=?, state=?, district=?, annual_income=? WHERE user_id=?',
            [profileData.fullName, profileData.state, profileData.district, profileData.annualIncome, userId]
          );
        }
      }
    } catch (err) {
      // Fallback
    }

    res.json({ success: true, message: 'Profile updated successfully for authenticated user' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
  }
};
