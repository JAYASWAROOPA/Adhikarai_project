const bcrypt = require('bcryptjs');
const db = require('../config/db');

const audit = async (req, action, details, entityType = null, entityId = null) => {
  await db.query(
    'INSERT INTO audit_logs (user_id, username, role, action, status, ip_address, user_agent, details, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.userId || null, req.user.username || req.user.email, 'admin', action, 'SUCCESS', req.ip, req.headers['user-agent'] || null, JSON.stringify(details || {}), entityType, entityId ? String(entityId) : null]
  );
};
const bounded = (n, fallback = 25) => Math.max(1, Math.min(100, Number(n) || fallback));
const like = (s) => `%${String(s || '').trim()}%`;
const fail = (res, error, message = 'Unable to complete admin request') => {
  console.error(message, error);
  res.status(500).json({ success: false, message });
};

exports.getDashboard = async (req, res) => {
  try {
    const [[users]] = await db.query('SELECT COUNT(*) totalUsers, SUM(role = \'citizen\') totalCitizens, SUM(role = \'officer\') totalOfficers, SUM(role = \'admin\') totalAdmins FROM users');
    const [[schemes]] = await db.query('SELECT COUNT(*) totalSchemes FROM GovernmentSchemes');
    const [[apps]] = await db.query("SELECT COUNT(*) totalApplications, SUM(LOWER(status) IN ('submitted','pending','under_verification')) pendingApplications, SUM(LOWER(status) = 'approved') approvedApplications, SUM(LOWER(status) = 'rejected') rejectedApplications FROM applications");
    const [recentUsers] = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5');
    const [recentActivities] = await db.query('SELECT id, user_id, username, role, action, status, details, created_at AS timestamp FROM audit_logs ORDER BY created_at DESC LIMIT 8');
    res.json({ success: true, stats: { ...users, ...schemes, ...apps }, recentUsers, recentActivities });
  } catch (e) { fail(res, e, 'Unable to load dashboard. Check database schema and connection.'); }
};

exports.getUsers = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1), limit = bounded(req.query.limit), offset = (page - 1) * limit;
    const term = like(req.query.search);
    const params = [];
    let where = 'WHERE (u.name LIKE ? OR u.email LIKE ? OR u.mobile LIKE CAST(? AS CHAR) OR CAST(u.id AS CHAR) LIKE ?)';
    params.push(term, term, term, term);
    if (['citizen','officer','admin'].includes(req.query.role)) { where += ' AND u.role = ?'; params.push(req.query.role); }
    if (req.query.status === 'active' || req.query.status === 'inactive') { where += ' AND u.is_active = ?'; params.push(req.query.status === 'active' ? 1 : 0); }
    const [[{ total }]] = await db.query(`SELECT COUNT(*) total FROM users u ${where}`, params);
    const [users] = await db.query(`SELECT u.id, u.name, u.email, u.mobile, u.role, u.is_active, u.is_verified, u.created_at, u.last_login, p.department, p.designation, p.assigned_office, p.district FROM users u LEFT JOIN officer_profiles p ON p.user_id = u.id ${where} ORDER BY u.created_at DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
    res.json({ success: true, users: users.map(u => ({ ...u, status: u.is_active ? 'active' : 'inactive' })), total, page, limit });
  } catch (e) { fail(res, e, 'Unable to load users. Apply the admin database migration if needed.'); }
};

exports.updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [[old]] = await db.query('SELECT id, name, role, is_active, is_verified FROM users WHERE id = ?', [id]);
    if (!old) return res.status(404).json({ success: false, message: 'User not found' });
    const { name, role, status, is_active, is_verified } = req.body;
    if (role && !['citizen','officer','admin'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });
    if (id === Number(req.user.userId) && role && role !== 'admin') return res.status(400).json({ success: false, message: 'You cannot remove your own admin access' });
    const active = typeof is_active === 'boolean' ? is_active : status ? status === 'active' : old.is_active;
    const verified = typeof is_verified === 'boolean' ? is_verified : old.is_verified;
    await db.query('UPDATE users SET name = ?, role = ?, is_active = ?, is_verified = ? WHERE id = ?', [String(name || old.name).trim(), role || old.role, active, verified, id]);
    if ((role || old.role) === 'officer' && ['department','designation','assignedOffice','assigned_office','district'].some(k => req.body[k] !== undefined)) {
      await db.query('INSERT INTO officer_profiles (user_id, department, designation, assigned_office, district) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE department = VALUES(department), designation = VALUES(designation), assigned_office = VALUES(assigned_office), district = VALUES(district)', [id, req.body.department || null, req.body.designation || null, req.body.assignedOffice || req.body.assigned_office || null, req.body.district || null]);
    }
    await audit(req, 'USER_UPDATED', { before: old, after: { name: name || old.name, role: role || old.role, is_active: active, is_verified: verified } }, 'user', id);
    res.json({ success: true, message: 'User updated', user: { ...old, name: name || old.name, role: role || old.role, is_active: active, is_verified: verified } });
  } catch (e) { fail(res, e, 'Unable to update user'); }
};

exports.getOfficers = async (req, res) => {
  try {
    const [officers] = await db.query("SELECT u.id, u.name, u.email, u.mobile, u.role, u.is_active, u.is_verified, u.created_at, u.last_login, p.department, p.designation, p.assigned_office, p.district FROM users u LEFT JOIN officer_profiles p ON p.user_id = u.id WHERE u.role = 'officer' AND (u.name LIKE ? OR u.email LIKE ? OR CAST(u.id AS CHAR) LIKE ? OR COALESCE(p.department, '') LIKE ?) ORDER BY u.created_at DESC", [like(req.query.search), like(req.query.search), like(req.query.search), like(req.query.search)]);
    res.json({ success: true, officers: officers.map(o => ({ ...o, status: o.is_active ? 'active' : 'inactive', employeeId: `OFF-${o.id}` })) });
  } catch (e) { fail(res, e, 'Unable to load officers'); }
};

exports.createOfficer = async (req, res) => {
  try {
    const { name, email, tempPassword, department, district } = req.body;
    if (!String(name || '').trim() || !/^\S+@\S+\.\S+$/.test(email || '') || String(tempPassword || '').length < 10) return res.status(400).json({ success: false, message: 'Name, valid email, and a temporary password of at least 10 characters are required.' });
    const [result] = await db.query('INSERT INTO users (name, email, mobile, password_hash, role, is_active, is_verified) VALUES (?, ?, ?, ?, \'officer\', 1, 0)', [name.trim(), email.trim().toLowerCase(), req.body.mobile || null, await bcrypt.hash(tempPassword, 10)]);
    await db.query('INSERT INTO officer_profiles (user_id, department, designation, assigned_office, district) VALUES (?, ?, ?, ?, ?)', [result.insertId, department || null, req.body.designation || null, req.body.assignedOffice || null, district || null]);
    await audit(req, 'OFFICER_CREATED', { email, department: department || null, district: district || null }, 'user', result.insertId);
    res.status(201).json({ success: true, officer: { id: result.insertId, name, email: email.toLowerCase(), department, district, status: 'active' } });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'An account with this email or phone already exists.' });
    fail(res, e, 'Unable to create officer');
  }
};

exports.getSchemes = async (req, res) => {
  try {
    const term = like(req.query.search);
    const [rows] = await db.query(`SELECT g.*, d.name department, er.min_age eligibilityAgeMin, er.max_age eligibilityAgeMax, er.max_income incomeLimit, er.required_category requiredCategory, er.required_occupation requiredOccupation, er.required_gender requiredGender, er.must_be_farmer mustBeFarmer, er.must_be_student mustBeStudent, er.must_be_senior_citizen mustBeSeniorCitizen FROM GovernmentSchemes g LEFT JOIN Departments d ON d.id = g.department_id LEFT JOIN EligibilityRules er ON er.scheme_id = g.id WHERE g.name LIKE ? OR g.description LIKE ? OR d.name LIKE ? ORDER BY g.created_at DESC`, [term, term, term]);
    for (const s of rows) {
      const [docs] = await db.query('SELECT document_name name, is_mandatory required FROM DocumentsRequired WHERE scheme_id = ?', [s.id]);
      s.documents = docs;
      s.category = s.category || s.scheme_type;
      s.status = s.status || 'active';
    }
    res.json({ success: true, schemes: rows });
  } catch (e) { fail(res, e, 'Unable to load schemes'); }
};

exports.saveScheme = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    const { name, description, department_id, scheme_type, state_specific, category, benefits, application_process, eligibility, documents } = req.body;
    if (!String(name || '').trim() || !String(description || '').trim() || !['Central','State'].includes(scheme_type) || !Array.isArray(documents)) return res.status(400).json({ success: false, message: 'Scheme name, description, type, and document list are required.' });
    await conn.beginTransaction();
    let id = Number(req.params.id);
    if (id) {
      const [exists] = await conn.query('SELECT id FROM GovernmentSchemes WHERE id = ?', [id]);
      if (!exists.length) { await conn.rollback(); return res.status(404).json({ success: false, message: 'Scheme not found' }); }
      await conn.query('UPDATE GovernmentSchemes SET department_id = ?, name = ?, description = ?, scheme_type = ?, state_specific = ?, application_process = ?, category = ?, benefits = ? WHERE id = ?', [department_id || null, name.trim(), description.trim(), scheme_type, state_specific || null, application_process || null, category || null, benefits || null, id]);
      await conn.query('DELETE FROM EligibilityRules WHERE scheme_id = ?', [id]);
      await conn.query('DELETE FROM DocumentsRequired WHERE scheme_id = ?', [id]);
    } else {
      const [result] = await conn.query('INSERT INTO GovernmentSchemes (department_id, name, description, scheme_type, state_specific, application_process, category, benefits, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, \'active\')', [department_id || null, name.trim(), description.trim(), scheme_type, state_specific || null, application_process || null, category || null, benefits || null]);
      id = result.insertId;
    }
    if (eligibility && typeof eligibility === 'object') {
      await conn.query('INSERT INTO EligibilityRules (scheme_id, min_age, max_age, max_income, required_category, required_occupation, required_gender, must_be_farmer, must_be_student, must_be_senior_citizen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, eligibility.minAge || null, eligibility.maxAge || null, eligibility.maxIncome || null, eligibility.category || null, eligibility.occupation || null, eligibility.gender || null, !!eligibility.farmer, !!eligibility.student, !!eligibility.seniorCitizen]);
    }
    for (const doc of documents) if (String(doc.name || '').trim()) await conn.query('INSERT INTO DocumentsRequired (scheme_id, document_name, is_mandatory) VALUES (?, ?, ?)', [id, doc.name.trim(), doc.required !== false]);
    await conn.commit();
    await audit(req, req.params.id ? 'SCHEME_UPDATED' : 'SCHEME_CREATED', { name, category }, 'scheme', id);
    res.status(req.params.id ? 200 : 201).json({ success: true, id, message: 'Scheme saved' });
  } catch (e) { await conn.rollback(); fail(res, e, 'Unable to save scheme. Apply the admin database migration if needed.'); }
  finally { if (conn) conn.release(); }
};

exports.updateSchemeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active','inactive'].includes(status)) return res.status(400).json({ success: false, message: 'Status must be active or inactive.' });
    const [result] = await db.query('UPDATE GovernmentSchemes SET status = ? WHERE id = ?', [status, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Scheme not found' });
    await audit(req, status === 'active' ? 'SCHEME_ACTIVATED' : 'SCHEME_DEACTIVATED', { status }, 'scheme', req.params.id);
    res.json({ success: true, status });
  } catch (e) { fail(res, e, 'Unable to update scheme status'); }
};

exports.getAnalytics = async (req, res) => {
  try {
    const [[users]] = await db.query('SELECT COUNT(*) totalUsers, SUM(role = \'officer\') totalOfficers, SUM(is_active = 1) activeUsers, SUM(is_verified = 1) verifiedUsers FROM users');
    const [[schemes]] = await db.query('SELECT COUNT(*) totalSchemes, SUM(LOWER(status) = \'active\') activeSchemes FROM GovernmentSchemes');
    const [[applications]] = await db.query("SELECT COUNT(*) total, SUM(LOWER(status) IN ('submitted','pending','under_verification')) pending, SUM(LOWER(status) = 'approved') approved, SUM(LOWER(status) = 'rejected') rejected FROM applications");
    const [schemePerformance] = await db.query('SELECT g.id, g.name schemeName, COUNT(a.id) applications, SUM(LOWER(a.status) = \'approved\') approved, SUM(LOWER(a.status) = \'rejected\') rejected, SUM(LOWER(a.status) IN (\'submitted\',\'pending\',\'under_verification\')) pending FROM GovernmentSchemes g LEFT JOIN applications a ON a.scheme_id = g.id GROUP BY g.id, g.name ORDER BY applications DESC LIMIT 20');
    const [daily] = await db.query("SELECT DATE(submitted_at) date, COUNT(*) applications, SUM(LOWER(status) = 'approved') approved, SUM(LOWER(status) = 'rejected') rejected FROM applications WHERE submitted_at >= DATE_SUB(CURDATE(), INTERVAL 90 DAY) GROUP BY DATE(submitted_at) ORDER BY date");
    const [officerPerformance] = await db.query("SELECT u.id, u.name officerName, COUNT(a.id) assigned, SUM(LOWER(a.status) IN ('approved','rejected')) processed, SUM(LOWER(a.status) = 'approved') approved FROM users u LEFT JOIN applications a ON a.officer_id = u.id WHERE u.role = 'officer' GROUP BY u.id, u.name ORDER BY processed DESC LIMIT 50");
    res.json({ success: true, userMetrics: users, schemeMetrics: schemes, applicationMetrics: { ...applications, approvalRate: applications.total ? Math.round(applications.approved * 100 / applications.total) : 0 }, schemePerformance: schemePerformance.map(s => ({ ...s, approvalRate: s.applications ? Math.round(s.approved * 100 / s.applications) : 0 })), trends: daily, officerPerformance });
  } catch (e) { fail(res, e, 'Unable to load analytics. Some metrics require the latest database migration.'); }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1), limit = bounded(req.query.limit), offset = (page - 1) * limit;
    const term = like(req.query.search);
    const filters = ['(COALESCE(username, \'\') LIKE ? OR action LIKE ? OR COALESCE(details, \'\') LIKE ? OR COALESCE(ip_address, \'\') LIKE ?)'];
    const params = [term, term, term, term];
    if (req.query.entityType) { filters.push('entity_type = ?'); params.push(req.query.entityType); }
    if (req.query.status) { filters.push('status = ?'); params.push(req.query.status); }
    if (req.query.startDate) { filters.push('created_at >= ?'); params.push(req.query.startDate); }
    if (req.query.endDate) { filters.push('created_at < DATE_ADD(?, INTERVAL 1 DAY)'); params.push(req.query.endDate); }
    const where = `WHERE ${filters.join(' AND ')}`;
    const [[{ total }]] = await db.query(`SELECT COUNT(*) total FROM audit_logs ${where}`, params);
    const [auditLogs] = await db.query(`SELECT id, user_id userId, username userName, role, action, status, details, entity_type entityType, entity_id entityId, ip_address ipAddress, created_at timestamp FROM audit_logs ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
    res.json({ success: true, auditLogs, total, page, limit });
  } catch (e) { fail(res, e, 'Unable to load audit logs. Apply the admin database migration if needed.'); }
};
