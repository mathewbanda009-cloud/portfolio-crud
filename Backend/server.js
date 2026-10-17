require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API is running' });
});

// GET /api/portfolio -> list all records
app.get('/api/portfolio', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM portfolio ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/portfolio/:id -> get one record
app.get('/api/portfolio/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM portfolio WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Record not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/portfolio -> create a record
app.post('/api/portfolio', async (req, res) => {
  const { owner_name, title, bio, skills, email, website_url, location } = req.body;
  if (!owner_name || !owner_name.trim()) {
    return res.status(400).json({ error: 'owner_name is required' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO portfolio (owner_name, title, bio, skills, email, website_url, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [owner_name.trim(), title, bio, skills, email, website_url, location]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/portfolio/:id -> update a record
app.put('/api/portfolio/:id', async (req, res) => {
  const { owner_name, title, bio, skills, email, website_url, location } = req.body;
  if (!owner_name || !owner_name.trim()) {
    return res.status(400).json({ error: 'owner_name is required' });
  }
  try {
    const { rows } = await pool.query(
      `UPDATE portfolio
       SET owner_name = $1, title = $2, bio = $3, skills = $4,
           email = $5, website_url = $6, location = $7
       WHERE id = $8 RETURNING *`,
      [owner_name.trim(), title, bio, skills, email, website_url, location, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Record not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/portfolio/:id -> delete a record
app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM portfolio WHERE id = $1 RETURNING *', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Record deleted', deleted: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
