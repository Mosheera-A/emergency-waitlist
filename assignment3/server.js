// server.js
const express = require('express');
const path = require('path');
const pool = require('./db/db');

const app = express();
const PORT = 3000;

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve files from /public (we'll build the HTML later)
app.use(express.static(path.join(__dirname, 'public')));

// --- Helper functions ---

// Map pain level (0–10) to priority_id from your priority table:
// 1 = non-urgent, 2 = urgent, 3 = critical
function mapPainToPriority(painLevel) {
  const pain = Number(painLevel) || 0;

  if (pain >= 8) return 3;        // critical
  if (pain >= 4) return 2;        // urgent
  return 1;                       // non-urgent
}

// Get all waiting patients, sorted by triage rules
async function getOrderedWaitingPatients() {
  const [rows] = await pool.query(`
    SELECT
      p.id,
      p.name,
      p.injury_type,
      p.pain_level,
      p.date_of_birth,
      p.arrival_time,
      p.gender,
      p.card_nb,
      p.priority_id,
      p.room_id,
      pr.description AS priority_description,
      pr.approxWaitTime
    FROM patient p
    JOIN priority pr ON p.priority_id = pr.id
    WHERE p.status = 'waiting'
    ORDER BY
      CASE pr.description
        WHEN 'critical' THEN 1
        WHEN 'urgent' THEN 2
        WHEN 'non-urgent' THEN 3
        ELSE 4
      END,
      p.arrival_time ASC
  `);

  return rows;
}

// Add position + estimatedWait (minutes) to each waiting patient
async function getWaitingPatientsWithEstimates() {
  const patients = await getOrderedWaitingPatients();

  let accumulated = 0;
  return patients.map((p, index) => {
    const estimatedWait = accumulated;          // minutes before THIS patient
    accumulated += p.approxWaitTime || 0;       // add their own service time

    return {
      ...p,
      position: index + 1,
      estimatedWait, // in minutes
    };
  });
}

// --- Routes ---

// Simple home route (optional – front-end will live in /public)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// PATIENT CHECK-IN
// Called from patient-register form (POST)
app.post('/api/patients/checkin', async (req, res) => {
  try {
    const {
      name,
      injury_type,
      pain_level,
      date_of_birth,
      gender,
      code, // optional: if you want to let staff enter it
    } = req.body;

    if (!name || !injury_type || !pain_level) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const priorityId = mapPainToPriority(pain_level);

    // Simple numeric code if none provided
    const generatedCode = code || Math.floor(1000 + Math.random() * 9000);

    const [result] = await pool.query(
      `INSERT INTO patient
        (name, injury_type, pain_level, date_of_birth, gender, card_nb, priority_id, room_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, NULL, 'waiting')`,
      [name, injury_type, pain_level, date_of_birth || null, gender || null, generatedCode, priorityId]
    );

    res.json({
      success: true,
      message: 'Check-in successful.',
      patientId: result.insertId,
      name,
      code: generatedCode,
    });
  } catch (err) {
    console.error('Error in /api/patients/checkin:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PATIENT STATUS (Check My Wait Time)
// GET /api/patients/status?name=...&code=...
app.get('/api/patients/status', async (req, res) => {
  try {
    const { name, code } = req.query;

    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name and code are required.' });
    }

    const [rows] = await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.status,
        p.card_nb,
        pr.description AS priority_description
      FROM patient p
      JOIN priority pr ON p.priority_id = pr.id
      WHERE p.name = ? AND p.card_nb = ?
      ORDER BY p.id DESC
      LIMIT 1
      `,
      [name, code]
    );

    if (rows.length === 0) {
      return res.json({
        success: false,
        message: 'No patient found with that name and code.',
      });
    }

    const patient = rows[0];

    if (patient.status === 'treated') {
      return res.json({
        success: true,
        treated: true,
        message: 'You have already been treated.',
        name: patient.name,
      });
    }

    // Still waiting → compute position and estimate
    const waitingWithEstimates = await getWaitingPatientsWithEstimates();
    const match = waitingWithEstimates.find((p) => p.id === patient.id);

    if (!match) {
      return res.json({
        success: false,
        message: 'You are not currently in the waiting queue.',
      });
    }

    res.json({
      success: true,
      treated: false,
      name: match.name,
      priority: match.priority_description,
      position: match.position,
      estimatedWait: match.estimatedWait, // minutes
    });
  } catch (err) {
    console.error('Error in /api/patients/status:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ADMIN: GET all waiting patients with estimates
app.get('/api/admin/patients', async (req, res) => {
  try {
    const patients = await getWaitingPatientsWithEstimates();
    res.json({ success: true, patients });
  } catch (err) {
    console.error('Error in /api/admin/patients (GET):', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ADMIN: Add patient manually
app.post('/api/admin/patients', async (req, res) => {
  try {
    const {
      name,
      injury_type,
      pain_level,
      date_of_birth,
      gender,
      code,
      priority_id, // optional override
    } = req.body;

    if (!name || !code || !pain_level) {
      return res.status(400).json({ success: false, message: 'Name, code, and pain level are required.' });
    }

    const priorityId = priority_id || mapPainToPriority(pain_level);

    await pool.query(
      `INSERT INTO patient
        (name, injury_type, pain_level, date_of_birth, gender, card_nb, priority_id, room_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, NULL, 'waiting')`,
      [name, injury_type || null, pain_level, date_of_birth || null, gender || null, code, priorityId]
    );

    res.json({ success: true, message: 'Patient added successfully.' });
  } catch (err) {
    console.error('Error in /api/admin/patients (POST):', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ADMIN: Mark patient as treated
app.patch('/api/admin/patients/:id/treated', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE patient
       SET status = 'treated'
       WHERE id = ?`,
      [id]
    );

    res.json({ success: true, message: 'Patient marked as treated.' });
  } catch (err) {
    console.error('Error in /api/admin/patients/:id/treated:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
