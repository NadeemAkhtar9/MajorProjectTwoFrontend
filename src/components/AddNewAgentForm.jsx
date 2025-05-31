import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AddNewAgentForm = () => {
  const [agentData, setAgentData] = useState({ name: "", email: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //  Handle Input Change
  const handleChange = (e) => {
    setAgentData({ ...agentData, [e.target.name]: e.target.value });
  };

  //  Email Validation Function
  const validateEmail = (email) => {
    const atIndex = email.indexOf("@");
    const dotIndex = email.lastIndexOf(".");

    if (atIndex > 0 && dotIndex > atIndex) {
      return true; // Valid Email
    } else {
      return false; // Invalid Email
    }
  };

  //  Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    //  Check if email is valid before sending data
    if (!validateEmail(agentData.email)) {
      setErrorMessage("Invalid Email Format! Please enter a valid email.");
      return;
    }

    try {
      await axios.post("https://major-project-two-backend.vercel.app/agents", agentData);
      setSuccessMessage("Agent added successfully!");
      setErrorMessage("");
      setAgentData({ name: "", email: "" }); //  Reset form
    } catch (error) {
      console.error("Error adding agent:", error);
      setErrorMessage("Failed to add agent. Try again.");
    }
  };

  return (
    <>
      <div className="bg-dark text-white text-center py-3 display-6">Sales Agent Management</div>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav className="col-md-2 sidebar bg-dark text-white p-3">
            <h4>Add New Agent Screen</h4>
            <ul className="nav flex-column">
              <li className="nav-item"><Link className="nav-link text-white" to="/">← Back to Dashboard</Link></li>
            </ul>
          </nav>

          {/* Main Content */}
          <main className="col-md-10 p-4">
            <h5>Add New Sales Agent</h5>

            {/* Success & Error Messages */}
            {successMessage && <p className="text-success">{successMessage}</p>}
            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            {/* Form Section */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Agent Name:</label>
                <input type="text" className="form-control" name="name" value={agentData.name} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Agent Email:</label>
                <input type="text" className="form-control" name="email" value={agentData.email} onChange={handleChange} required />
              </div>

              <button type="submit" className="btn btn-success">Submit</button>
            </form>
          </main>
        </div>
      </div>
    </>
  );
};

export default AddNewAgentForm;
