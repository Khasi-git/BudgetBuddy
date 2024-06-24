const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");

/******************Task 2: Authentication route******************/
router.post('/google-signin', async (req, res) => {
    try {
      const { idToken } = req.body;
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      res.json({ success: true });
    } catch (error) {
      console.error('Error verifying Google Sign-In token:', error);
      res.status(401).json({ success: false });
    }
  });

/******************Task 2: Authentication route******************/

module.exports = router;