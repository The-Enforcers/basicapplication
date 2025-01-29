
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const app = express();
const upload = multer();
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

// Create file table if not exists
db.query(`CREATE TABLE IF NOT EXISTS files (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      data LONGBLOB NOT NULL
)`, (err) => {
  if (err) throw err;
});

// Create message table if not exists
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

// Upload file
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  db.query('INSERT INTO files (name, data) VALUES (?, ?)', [req.file.originalname, req.file.buffer], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, name: req.file.originalname, data: req.file.buffer });
  });
});

// Download file
app.get('/download/:id', (req, res) => {
  const { id } = req.params;
  console.log("1");
  db.query('SELECT * FROM files WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    console.log("2");
    if (result.length > 0) {
      console.log("3");
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=${result[0].name}`);
      res.send(result[0].data);
    } else {
      res.status(404).send('File not found');
    }
  });
});

// List all files
app.get('/files', (req, res) => {
  db.query('SELECT id, name FROM files', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
