import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useUserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import RemoveTransaction from "./RemoveTransaction";

const Transactions = ({ transactionType }) => {
  /********************Task 9: Authentication and state variables********************/
  useAuth("/login");
  const { user } = useUserContext();
  const navigate = useNavigate();

  /********************Task 9: Authentication and state variables********************/

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Add a loading state

  // State variables to manage the alert
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  /****************************Task 9: Hook and functions****************************/
  
  useEffect(() => {
    setIsLoading(true); // Set loading state to true while data is fetched
    // Fetch all income from Firestore for the current user
    const fetchIncome = async () => {
      try {
        const response = await axios.post("/getAllTransactions", {
          type: transactionType,
          userId: user.uid,
        });
  
        if (response.data.success) {
          // Update the income state with the fetched data
          setTransactions(response.data.userTransactions);
        } else {
          setAlertType("error");
          setAlertMessage("Income could not be retrieved.");
        }
  
        setIsLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        setAlertType("error");
        setAlertMessage("Income could not be retrieved.");
        setIsLoading(false); // Set loading state to false if there’s an error
      }
    };
  
    fetchIncome();
  }, [user, transactionType]);
  
  const handleEditTransaction = (transaction) => {
    // Generate the URL for the EditTransaction component with the income/expense data as a parameter
    let editTransactionUrl = `/edit${transactionType}?id=${transaction.formId}`;
  
    // Navigate to the EditIncome component
    navigate(editTransactionUrl);
  };
  
  const handleRemoveTransaction = (transaction) => {
    // Remove the income from the list
    setTransactions((prevIncome) =>
      prevIncome.filter((tran) => tran.formId !== transaction.formId)
    );
  };
  
  /****************************Task 9: Hook and functions****************************/

  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        {isLoading ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "80vh" }}
          >
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        ) : alertMessage ? (
          <div
            className={`alert ${
              alertType === "success" ? "alert-success" : "alert-danger"
            } mt-5`}
            role="alert"
          >
            <div>
              <i
                className={`bi ${
                  alertType === "success"
                    ? "bi-check-circle-fill"
                    : "bi-exclamation-triangle-fill"
                } m-2`}
              ></i>
              {alertMessage}
            </div>
          </div>
        ) : (
          <>
            <h2>{transactionType === "income" ? "Income" : "Expenses"}</h2>
            <Link
              to={`/add${transactionType}`}
              className="btn btn-outline-secondary mt-3 mb-4"
            >
              Add {transactionType === "income" ? "Income" : "Expense"}
            </Link>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Frequency</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.formId}>
                    <td>{transaction.date}</td>
                    <td>
                      {transaction.category.charAt(0).toUpperCase() +
                        transaction.category.slice(1)}
                    </td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.paymentMethod}</td>
                    <td>{transaction.frequency}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => handleEditTransaction(transaction)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <RemoveTransaction
                        transactionType={transactionType}
                        transaction={transaction}
                        onRemove={handleRemoveTransaction}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default Transactions;
