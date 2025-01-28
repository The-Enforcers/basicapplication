
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'location-passw',
  database: 'location_search_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Create messages table if not exists
db.query(`CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) throw err;
});

// Routes
// Fetch messages
app.get('/messages', (req, res) => {
  db.query('SELECT * FROM messages ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add a message
app.post('/messages', (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).send('Message content is required');

  db.query('INSERT INTO messages (content) VALUES (?)', [content], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, content, created_at: new Date() });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
