const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Create and connect to the SQLite database
const db = new sqlite3.Database('database.db');

// Create a table to store posts
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)');
});

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Serve static files (CSS, JavaScript, etc.)
app.use(express.static('public'));

// Endpoint to fetch posts from the database
app.get('/api/posts', (req, res) => {
    db.all('SELECT * FROM posts', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Endpoint to add a new post to the database
app.post('/api/posts', (req, res) => {
    const { content } = req.body;

    if (!content) {
        res.status(400).json({ error: 'Content is required.' });
        return;
    }

    db.run('INSERT INTO posts (content) VALUES (?)', [content], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



// JavaScript code to fetch posts and handle form submissions
// Use Fetch API or any other library of your choice

// Example fetch to retrieve posts from the backend
fetch('/api/posts')
    .then(response => response.json())
    .then(posts => {
        // Populate posts in your HTML
    })
    .catch(error => console.error('Error fetching posts:', error));

// Example code to handle form submission
document.getElementById('reply-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const replyText = document.getElementById('reply-text').value;

    // Send a POST request to the backend to add a new post
    fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: replyText })
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response (e.g., display the new post)
        })
        .catch(error => console.error('Error submitting reply:', error));
});
