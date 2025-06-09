// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
// Create Express app instance
const app = express();

// Define the port to listen on
const PORT = 8080;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use (cors());

// MySQL Database Connection Configuration
const pool = mysql.createPool({
  host: '34.58.150.75',     // Your MySQL host (usually 'localhost' or IP)
  user: 'admin',          // MySQL username (default 'root' for local setups)
 password: 'project123',          // MySQL password (replace with your password)
  database: 'bookmyshow' // The database you are using
});

// Promisify MySQL pool for async/await use
const db = pool.promise();

// Event Routes
app.get('/events', async (req, res) => {
  try {
    const [events] = await db.query('SELECT * FROM events');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.post('/events', async (req, res) => {
  const { title, date, venue } = req.body;
  try {
    await db.query('INSERT INTO events (title, date, venue) VALUES (?, ?, ?)', [title, date, venue]);
    res.status(201).json({ message: 'Event created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Booking Routes
app.get('/bookings', async (req, res) => {
  try {
    const [bookings] = await db.query('SELECT * FROM bookings');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.post('/bookings', async (req, res) => {
  const { eventId, userName, seats } = req.body;
  try {
    await db.query('INSERT INTO bookings (event_id, user_name, seats) VALUES (?, ?, ?)', [eventId, userName, seats]);
    res.status(201).json({ message: 'Booking successful' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
