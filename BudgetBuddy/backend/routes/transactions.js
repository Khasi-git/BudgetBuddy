const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");

/*******************Task 4: Transaction routes*******************/
router.post("/addTransaction", async (req, res) => {
    const { type, transactionData, userId } = req.body;
    
    try {
      const firestore = admin.firestore();
      const collectionName = type === 'income' ? 'income' : 'expense';
      
      await firestore.collection(collectionName).add({
        ...transactionData,
        userId: userId,
      });
  
      // Send a success response to the frontend
      res.json({ success: true });
    } catch (error) {
      console.error("Error adding transaction data:", error);
      // Send an error response to the frontend
      res.status(500).json({ success: false });
    }
  });
  
  // Route to fetch a transaction by ID
  router.get('/getTransaction', async (req, res) => {
    const type = req.query.type;
    const id = req.query.id;
  
    try {
      // Fetch the transaction data from Firestore
      const firestore = admin.firestore();
      const collectionName = type === 'income' ? 'income' : 'expense';
      const transactionDoc = await firestore.collection(collectionName).doc(id).get();
  
      if (transactionDoc.exists) {
        // If the transaction document exists, return the transaction data to the frontend
        const transactionData = transactionDoc.data();
        res.json({ success: true, transaction: transactionData });
      } else {
        console.error('Transaction not found.');
        // If the transaction document doesn’t exist, return an error response
        res.status(404).json({ success: false });
      }
    } catch (error) {
      console.error('Error fetching transaction data:', error);
      // Send an error response to the frontend
      res.status(500).json({ success: false });
    }
  });
  
  // Route to fetch all transactions for the current user
  router.post('/getAllTransactions', async (req, res) => {
    try {
      const { type, userId } = req.body;
  
      // Fetch all transactions from Firestore for the current user
      const firestore = admin.firestore();
      const collectionName = type === 'income' ? 'income' : 'expense';
      const transactionsRef = firestore.collection(collectionName);
      const querySnapshot = await transactionsRef.where("userId", "==", userId).get();
      const userTransactions = querySnapshot.docs.map((doc) => ({ formId: doc.id, ...doc.data() }));
  
      // Send the user’s transactions as a response
      res.json({ success: true, userTransactions });
    } catch (error) {
      console.error("Error fetching transactions:", error)
      // Send an error response to the frontend
      res.status(500).json({ success: false });
    }
  });
  
  // Route to update a transaction by ID
  router.put('/editTransaction', async (req, res) => {
    const { type, id, transactionData } = req.body;
  
    try {
      // Update the transaction data in Firestore
      const firestore = admin.firestore();
      const collectionName = type === 'income' ? 'income' : 'expense';
  
      await firestore.collection(collectionName).doc(id).update(transactionData);
  
      // Send a success response to the frontend
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating transaction data:', error);
      // Send an error response to the frontend
      res.status(500).json({ success: false });
    }
  });
  
  // Route to delete a transaction by ID
  router.delete('/deleteTransaction', async (req, res) => {
    const type = req.query.type;
    const id = req.query.id;
  
    try {
      // Delete the transaction document from Firestore
      const firestore = admin.firestore();
      const collectionName = type === 'income' ? 'income' : 'expense';
      await firestore.collection(collectionName).doc(id).delete();
  
      // Send a success response to the frontend
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      // Send an error response to the frontend
      res.status(500).json({ success: false });
    }
  });

/*******************Task 4: Transaction routes*******************/

module.exports = router;