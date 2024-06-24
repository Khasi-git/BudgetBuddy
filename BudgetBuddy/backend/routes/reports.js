const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");

/**********************Task 5: Report routes*********************/
const fetchBudget = async (userId) => {
    const firestore = admin.firestore();
    const budgetCollectionRef = firestore.collection("budget");
  
    try {
      const budgetSnapshot = await budgetCollectionRef.where("userId", "==", userId).limit(1).get(); 
      if (!budgetSnapshot.empty) {
        return budgetSnapshot.docs[0].data();
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
        return budgetData;
      }
    } catch (error) {
      console.error('Error fetching budget data:', error);
      return null;
    }
  };
  
  // Fetch income/expense transaction data
  const fetchTransactions = async (userId, type, startDate, endDate) => {
    const firestore = admin.firestore();
    const collectionName = type === 'income' ? 'income' : 'expense';
    const transactionsCollectionRef = firestore.collection(collectionName);
  
    try {
      // Construct the query to filter transactions based on userId and date range
      const transactionsQuery = transactionsCollectionRef.where('userId', '==', userId).where('date', '>=', startDate).where('date', '<=', endDate);
      
      // Fetch the transactions that match the query
      const transactionsSnapshot = await transactionsQuery.get();
      const transactions = transactionsSnapshot.docs.map((doc) => doc.data());
  
      // Prepare an object to store the transactions grouped by category
      const transactionsByCategory = {};
  
      // Calculate the total of all transactions
      let totalAmount = 0;
  
      // Iterate through the documents and group transactions by category while summing the amounts
      transactions.forEach((transaction) => {
        const { category, amount } = transaction;
  
        // Add the transaction amount to the corresponding category sum
        transactionsByCategory[category] = transactionsByCategory[category] || {
          sum: 0,
          transactions: [],
        };
        transactionsByCategory[category].sum += parseFloat(amount);
        transactionsByCategory[category].transactions.push(transaction);
  
        // Add the transaction amount to the total
        totalAmount += parseFloat(amount);
      });
  
      // Return the transactions, transactions grouped by category, and the total amount
      return { transactions, transactionsByCategory, totalAmount };
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  };
  
  // Function to get the budget summary
  const getBudgetSummary = (budget, transactionsByCategory) => {
    const combinedArray = [];
  
    for (let key of Object.keys(budget)) {
      if (key !== "userId") {
        const amountAllocated = budget[key];
        const amountSpent = transactionsByCategory[key] ? transactionsByCategory[key].sum : 0;
        const amountRemaining = amountAllocated - amountSpent;
        combinedArray.push({ key, amountAllocated, amountSpent, amountRemaining });
      }
    }
    return combinedArray;
  };
  
  // Route to get all budget, income, and expense data for a user
  router.post('/getReportsData', async (req, res) => {
    try {
      const { userId, startDate, endDate } = req.body;
  
      const budget = await fetchBudget(userId);
      const income = await fetchTransactions(userId, "income", startDate, endDate);
      const expenses = await fetchTransactions(userId, "expense", startDate, endDate);
      
      // Call the getBudgetSummary() function to get the budget summary
      const budgetSummary = getBudgetSummary(budget, expenses.transactionsByCategory);
  
      // Combine the income and expense data into a single response object
      const responseData = {
        success: true,
        budget: budget,
        income: income,
        expenses: expenses,
        budgetSummary: budgetSummary
      };
  
      res.json(responseData);
    } catch (error) {
      console.error("Error fetching budget data:", error);
      // Send an error response to the frontend
      res.status(500).json({ success: false });
    }
  });

/**********************Task 5: Report routes*********************/

module.exports = router;