// server.js
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;


const pool = mysql.createPool({
  host: 'localhost',      
  user: 'root',           
  password: 'shooshsql',
  database: 'hospTri',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET 
app.get('/patients', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM patient ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
  }
});

// start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
