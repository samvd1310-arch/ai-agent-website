const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Parses JSON data from requests
app.use(express.static('public')); // Serves your HTML/CSS files

// Database Configuration
// We will set these up in Render later. 
// For now, we use environment variables.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Create Table if it doesn't exist (for automation)
async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        card_details VARCHAR(100)
      );
    `);
    console.log("Table 'leads' is ready.");
  } catch (err) {
    console.error("Error creating table:", err);
  }
}

// API Route to handle form submission
app.post('/api/submit', async (req, res) => {
  const { name, email, phone, cardDetails } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and Email are required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO leads (name, email, phone, card_details) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, cardDetails]
    );
    res.status(200).json({ message: 'Data saved successfully!', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});
// This creates a secret page to view your data
app.get('/api/leads', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads');
    res.json(result.rows); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  createTable();
});