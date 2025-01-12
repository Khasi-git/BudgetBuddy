import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Budget = () => {
  /********************Task 12: Authentication and state variables*******************/
  useAuth("/login");
  const { user } = useUserContext();
  const navigate = useNavigate();

  /********************Task 12: Authentication and state variables*******************/

  const [isLoading, setIsLoading] = useState(false); // Add a loading state

  // State variables to manage the alert
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const initialState = {
    groceries: 0,
    health: 0,
    transport: 0,
    accommodation: 0,
    gift: 0,
    other: 0,
  };

  const [budgetData, setBudgetData] = useState(initialState);

  /****************************Task 12: Hook and functions***************************/

  useEffect(() => {
    setIsLoading(true); // Set loading state to true while data is fetched
    // Fetch budget data from Firestore for the current user
    const fetchBudget = async () => {
      try {
        const response = await axios.post("/getBudget", {
          userId: user.uid,
        });
  
        if (response.data.success) {
          // Update the expenses state with the fetched data
          setBudgetData(response.data.budgetData);
        } else {
          setAlertType("error");
          setAlertMessage("Budget could not be retrieved.");
        }
        setIsLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        setAlertType("error");
        setAlertMessage("Budget could not be retrieved.");
        setIsLoading(false); // Set loading state to false if there's an error
      }
    };
  
    fetchBudget();
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBudgetData((prevData) => ({ ...prevData, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/saveBudget", {
        budgetData,
        userId: user.uid,
      });
      if (response.data.success) {
        setAlertType("success");
        setAlertMessage("Budget saved successfully.");
      } else {
        setAlertType("error");
        setAlertMessage("Budget could not be saved.");
      }
    } catch (error) {
      setAlertType("error");
      setAlertMessage("Budget could not be saved.");
    }
  };
  
  const handleCancel = () => {
    // Redirect to the homepage on cancel
    navigate("/");
  };

  /****************************Task 12: Hook and functions***************************/

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
        ) : (
          <>
            <h2>Budget Allocation</h2>
            <div className="row mt-5">
              <div className="col-md-6 offset-md-3">
                <form onSubmit={handleSubmit}>
                  <div className="input-group mb-3">
                    <div className="col-md-4">
                      <span className="input-group-text" id="basic-addon1">
                        <i className="bi bi-cart-fill me-2"></i>Groceries
                      </span>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="number"
                        className="form-control"
                        id="groceries"
                        name="groceries"
                        value={budgetData.groceries}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <div className="col-md-4">
                      <span className="input-group-text" id="basic-addon1">
                        <i className="bi bi-hospital-fill me-2"></i>Health
                      </span>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="number"
                        className="form-control"
                        id="health"
                        name="health"
                        value={budgetData.health}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <div className="col-md-4">
                      <span className="input-group-text" id="basic-addon1">
                        <i className="bi bi-car-front-fill me-2"></i>Transport
                      </span>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="number"
                        className="form-control"
                        id="transport"
                        name="transport"
                        value={budgetData.transport}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <div className="col-md-4">
                      <span className="input-group-text" id="basic-addon1">
                        <i className="bi bi-house-fill me-2"></i>Accommodation
                      </span>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="number"
                        className="form-control"
                        id="accommodation"
                        name="accommodation"
                        value={budgetData.accommodation}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <div className="col-md-4">
                      <span className="input-group-text" id="basic-addon1">
                        <i className="bi bi-gift-fill me-2"></i>Gift
                      </span>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="number"
                        className="form-control"
                        id="gift"
                        name="gift"
                        value={budgetData.gift}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <div className="col-md-4">
                      <span className="input-group-text" id="basic-addon1">
                        <i className="bi bi-cash-stack me-2"></i>Other
                      </span>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="number"
                        className="form-control"
                        id="other"
                        name="other"
                        value={budgetData.other}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3 text-center">
                    <button
                      type="submit"
                      className="btn btn-outline-success me-2"
                    >
                      <i className="bi bi-save me-2"></i>Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={handleCancel}
                    >
                      <i className="bi bi-x-square me-2"></i>Cancel
                    </button>
                  </div>
                </form>
                {alertMessage && (
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
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Budget;
