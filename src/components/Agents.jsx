import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

const Agents = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get("https://major-project-two-backend.vercel.app/agents");
        setAgents(response.data);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };
    fetchLeads();
  }, []);

  return (
    <>
      <div className="bg-dark text-white text-center py-3 display-6">Sales Agent Management</div>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav className="col-md-2 sidebar bg-dark text-white p-3">
            <h4>Sales Agent Management Screen</h4>
            <ul className="nav flex-column">
              <li className="nav-item"><Link className="nav-link text-white" to="/">← Back to Dashboard</Link></li>
            </ul>
          </nav>

          {/* Main Content */}
          <main className="col-md-10 p-4">
            <h5>Sales Agents List</h5>
            <ul className="list-group">
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <li key={agent._id} className="list-group-item">
                    {agent.name} - {agent.email}
                  </li>
                ))
              ) : (
                <li className="list-group-item">No Agents Found</li>
              )}
            </ul>
            <Link className="btn btn-primary mt-3" to="/newAgent">Add New Agent</Link>
          </main>
        </div>
      </div>
    </>
  );
};

export default Agents;
