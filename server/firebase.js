const admin = require('firebase-admin');
const serviceAccount = require('./firebaseKey.json'); // Update this if your filename is different

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
