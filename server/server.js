const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// Firebase setup
const serviceAccount = require('./firebase-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const bookingsRef = db.collection('bookings');

// ✅ Import and use auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// POST /api/bookings
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = req.body;
    console.log('New booking:', booking);
    await bookingsRef.add(booking);
    res.json({ message: 'Booking successful and saved to Firebase!' });
  } catch (err) {
    console.error('Error saving booking:', err);
    res.status(500).json({ message: 'Failed to save booking.' });
  }
});

// GET /api/bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const snapshot = await bookingsRef.get();
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Failed to fetch bookings.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
