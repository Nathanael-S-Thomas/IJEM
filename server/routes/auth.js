// routes/auth.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();
const usersRef = db.collection('users');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const snapshot = await usersRef.where('username', '==', username).where('password', '==', password).get();

    if (snapshot.empty) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    res.json({ message: 'Login successful', name: user.name || user.username });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
