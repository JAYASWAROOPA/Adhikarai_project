const db = require('../config/db');

exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      `SELECT ua.id, ua.status, ua.applied_date, gs.name as scheme_name, gs.scheme_type 
       FROM UserApplications ua 
       JOIN GovernmentSchemes gs ON ua.scheme_id = gs.id 
       WHERE ua.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user applications', error: error.message });
  }
};

exports.applyOrSaveScheme = async (req, res) => {
  try {
    const userId = req.user.id;
    const { scheme_id, status } = req.body;

    const [existing] = await db.query(
      'SELECT * FROM UserApplications WHERE user_id = ? AND scheme_id = ?',
      [userId, scheme_id]
    );

    if (existing.length === 0) {
      await db.query(
        'INSERT INTO UserApplications (user_id, scheme_id, status, applied_date) VALUES (?, ?, ?, CURDATE())',
        [userId, scheme_id, status || 'Saved']
      );
    } else {
      await db.query(
        'UPDATE UserApplications SET status = ? WHERE user_id = ? AND scheme_id = ?',
        [status || 'Saved', userId, scheme_id]
      );
    }

    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving application status', error: error.message });
  }
};
