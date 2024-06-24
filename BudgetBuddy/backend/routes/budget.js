const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");

/**********************Task 3: Budget routes*********************/
router.post("/saveBudget", async (req, res) => {
    const { budgetData, userId } = req.body;
  
    try {
      // Add the userId field to the formData object
      budgetData.userId = userId;
  
      const firestore = admin.firestore();
      const budgetCollectionRef = firestore.collection("budget");
  
      // Query the documents based on userId and get the first matching document
      const querySnapshot = await budgetCollectionRef.where("userId", "==", userId).limit(1).get();
  
      let budgetDataRef;
  
      if (querySnapshot.empty) {
        // If no document matches userId, create a new document with a random document ID
        budgetDataRef = budgetCollectionRef.doc();
      } else {
        // If a document matches userId, use the first matching document
        budgetDataRef = querySnapshot.docs[0].ref;
      }
  
      // Save or update the form data in Firestore
      await budgetDataRef.set(budgetData, { merge: true });
  
      // Send a success response to the frontend
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving budget data:", error);
      // Send an error response to the frontend
      res.status(500).json({ success: false });
    }
  });
  
  // Route to get the budget
router.post("/getBudget", async (req, res) => {
    const { userId } = req.body;
    
    try {
      const firestore = admin.firestore();
      const budgetCollectionRef = firestore.collection("budget");
      
      // Query the documents based on userId and get the first matching document
      const budgetDataSnapshot = await budgetCollectionRef.where("userId", "==", userId).limit(1).get(); 
  
      // Check if the document exists in the database
      if (!budgetDataSnapshot.empty) {
        const budgetData = budgetDataSnapshot.docs[0].data();
        // Send the form data as the response
        res.json({ success: true, budgetData });
        
      } else {
        // If the document doesn’t exist, return all fields as 0
        const budgetData = {
          groceries: 0,
          health: 0,
          transport: 0,
          accommodation: 0,
          gift: 0,
          other: 0
        };
        // Send the default form data as the response
        res.json({ success: true, budgetData });
      }
    } catch (error) {
      console.error("Error fetching budget data:", error);
      // Send an error response to the frontend
      res.status(500).json({ success: false });
    }
  });

/**********************Task 3: Budget routes*********************/

module.exports = router;