const db = require('../config/db');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query('SELECT * FROM UserProfiles WHERE user_id = ?', [userId]);

    if (rows.length === 0) {
      return res.json({ message: 'Profile not found', profile: null });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      first_name, last_name, age, gender, occupation, annual_income,
      state, district, village, category, education_level,
      is_disabled, is_farmer, is_student, is_senior_citizen,
      has_aadhaar, has_ration_card
    } = req.body;

    const [existing] = await db.query('SELECT * FROM UserProfiles WHERE user_id = ?', [userId]);

    if (existing.length === 0) {
      await db.query(
        `INSERT INTO UserProfiles 
        (user_id, first_name, last_name, age, gender, occupation, annual_income, state, district, village, category, education_level, is_disabled, is_farmer, is_student, is_senior_citizen, has_aadhaar, has_ration_card) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, first_name, last_name, age, gender, occupation, annual_income, state, district, village, category, education_level, is_disabled, is_farmer, is_student, is_senior_citizen, has_aadhaar, has_ration_card]
      );
    } else {
      await db.query(
        `UPDATE UserProfiles SET 
        first_name=?, last_name=?, age=?, gender=?, occupation=?, annual_income=?, state=?, district=?, village=?, category=?, education_level=?, is_disabled=?, is_farmer=?, is_student=?, is_senior_citizen=?, has_aadhaar=?, has_ration_card=?
        WHERE user_id=?`,
        [first_name, last_name, age, gender, occupation, annual_income, state, district, village, category, education_level, is_disabled, is_farmer, is_student, is_senior_citizen, has_aadhaar, has_ration_card, userId]
      );
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};
