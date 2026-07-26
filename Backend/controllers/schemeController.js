const db = require('../config/db');

exports.getAllSchemes = async (req, res) => {
  try {
    const { search, state, category } = req.query;
    let query = 'SELECT * FROM GovernmentSchemes WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (state && state !== 'All') {
      query += ' AND (state_specific = ? OR state_specific IS NULL)';
      params.push(state);
    }

    const [schemes] = await db.query(query, params);
    res.json(schemes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching schemes', error: error.message });
  }
};

exports.getSchemeById = async (req, res) => {
  try {
    const { id } = req.params;
    const [schemes] = await db.query('SELECT * FROM GovernmentSchemes WHERE id = ?', [id]);

    if (schemes.length === 0) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    const [rules] = await db.query('SELECT * FROM EligibilityRules WHERE scheme_id = ?', [id]);
    const [documents] = await db.query('SELECT * FROM DocumentsRequired WHERE scheme_id = ?', [id]);

    res.json({
      ...schemes[0],
      eligibilityRules: rules[0] || null,
      documents
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching scheme details', error: error.message });
  }
};
