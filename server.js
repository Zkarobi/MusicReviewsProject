const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Replace with your MySQL password
    database: 'music_reviews'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/newreview', (req, res) => {
    res.sendFile(path.join(__dirname, 'newreview.html'));
});

app.get('/reviews', (req, res) => {
    res.sendFile(path.join(__dirname, 'reviews.html'));
});

app.post('/newreview', (req, res) => {
    console.log('Received POST request to /newreview');
    console.log('Request body:', req.body);

    const { title, artist, review, rating } = req.body;

    // Validation
    if (!title || !artist || !review || !rating) {
        console.log('Validation failed: Missing fields');
        return res.status(400).send('All fields are required.');
    }

    const sql = 'INSERT INTO reviews (title, artist, review, rating) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, artist, review, rating], (err, result) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).send('Database error.');
        }
        console.log('Review added successfully:', result.insertId);
        res.status(201).send({ message: 'Review added successfully', reviewId: result.insertId });
    });
});

app.get('/api/reviews', (req, res) => {
    const sql = 'SELECT * FROM reviews';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).send('Database error.');
        }
        res.status(200).json(results);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
