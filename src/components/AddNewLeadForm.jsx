import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AddNewLeadForm = () => {
  const [leadData, setLeadData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "",
    priority: "",
    timeToClose: "",
    tags: ""
  });
  const [salesAgents, setSalesAgents] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch Sales Agents & Tags from API (Dynamic Options)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const agentsResponse = await axios.get("https://major-project-two-backend.vercel.app/agents");
        setSalesAgents(agentsResponse.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  //  Handle Input Change
  const handleChange = (e) => {
    setLeadData({ ...leadData, [e.target.name]: e.target.value });
  };

//  Handle Tags Input
  const handleTagsChange = (e) => {
    const tagsArray = e.target.value.split(",").map(tag => tag.trim());
    setLeadData({ ...leadData, tags: tagsArray });
  };
  //  Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://major-project-two-backend.vercel.app/leads/", leadData);
      setSuccessMessage("Lead added successfully!");
      setErrorMessage("");
      setLeadData({ name: "", source: "", salesAgent: "", status: "", priority: "", timeToClose: "", tags: "" }); //  Reset form
    } catch (error) {
      console.error("Error adding lead:", error);
      setErrorMessage("Failed to add lead. Try again.");
    }
  };

  return (
    <>
      <div className="bg-dark text-white text-center py-3 display-6">Add New Lead</div>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav className="col-md-2 sidebar bg-dark text-white p-3">
            <h4>Add New Lead Screen</h4>
            <ul className="nav flex-column">
              <li className="nav-item"><Link className="nav-link text-white" to="/">← Back to Dashboard</Link></li>
            </ul>
          </nav>

          {/* Main Content */}
          <main className="col-md-10 p-4">
            <h5>Add New Lead</h5>

            {/* Success & Error Messages */}
            {successMessage && <p className="text-success">{successMessage}</p>}
            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            {/* Form Section */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Lead Name:</label>
                <input type="text" className="form-control" name="name" value={leadData.name} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Source:</label>
                <select className="form-select" name="source" value={leadData.source} onChange={handleChange} required>
                  <option value="">Select Source</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Email">Email</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Sales Agent:</label>
                <select className="form-select" name="salesAgent" value={leadData.salesAgent} onChange={handleChange} required>
                  <option value="">Select Sales Agent</option>
                  {salesAgents.map((agent) => (
                    <option key={agent._id} value={agent._id}>{agent.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Lead Status:</label>
                <select className="form-select" name="status" value={leadData.status} onChange={handleChange} required>
                  <option value="">Select Status</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Priority:</label>
                <select className="form-select" name="priority" value={leadData.priority} onChange={handleChange} required>
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Time to Close (Days):</label>
                <input type="number" className="form-control" name="timeToClose" value={leadData.timeToClose} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Tags (Comma-Separated):</label>
                <input type="text" className="form-control" name="tags" onChange={handleTagsChange} placeholder="e.g. Follow-up, High Value" />
              </div>
              <button type="submit" className="btn btn-success">Submit</button>
            </form>
          </main>
        </div>
      </div>
    </>
  );
};

export default AddNewLeadForm;
