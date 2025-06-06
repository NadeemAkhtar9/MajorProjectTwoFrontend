import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [leadStats, setLeadStats] = useState({
    new: 0,
    contacted: 0,
    qualified: 0,
    proposalSent: 0
  });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get("https://major-project-two-backend.vercel.app/leads/");
        setLeads(response.data);
        setFilteredLeads(response.data);

        const stats = { new: 0, contacted: 0, qualified: 0, proposalSent: 0 };
        response.data.forEach(lead => {
          if (lead.status === "New") stats.new++;
          else if (lead.status === "Contacted") stats.contacted++;
          else if (lead.status === "Qualified") stats.qualified++;
          else if (lead.status === "Proposal Sent") stats.proposalSent++;
        });
        setLeadStats(stats);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, []);

  const filterLeads = (status) => {
    if (status === "All") {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter(lead => lead.status === status));
    }
  };

  return (
   <>
  <div className="bg-dark text-white text-center py-3 fs-4">
    Anvaya CRM Dashboard
  </div>
  <nav className="navbar navbar-dark bg-dark d-md-none">
    <div className="container-fluid">
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#sidebarMenu"
        aria-controls="sidebarMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>

  <div className="container-fluid">
    <div className="row flex-column flex-md-row">
      <nav
        className="col-md-2 bg-dark text-white p-3 collapse d-md-block"
        id="sidebarMenu"
      >
        <h5>Navigation</h5>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/leads">Leads</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/sales">Sales</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/agents">Agents</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/status">Status</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/reports">Reports</Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="col-12 col-md-10 p-3">
        <div className="lead-status bg-light p-3 rounded mb-3">
          <h5>Lead Status</h5>
          <p>New: <span>{leadStats.new}</span> Leads</p>
          <p>Contacted: <span>{leadStats.contacted}</span> Leads</p>
          <p>Qualified: <span>{leadStats.qualified}</span> Leads</p>
          <p>Proposal Sent: <span>{leadStats.proposalSent}</span> Leads</p>
        </div>

        <div className="quick-filters mb-3">
          <h5>Quick Filters:</h5>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-primary" onClick={() => filterLeads("New")}>New</button>
            <button className="btn btn-success" onClick={() => filterLeads("Contacted")}>Contacted</button>
            <button className="btn btn-warning" onClick={() => filterLeads("Qualified")}>Qualified</button>
            <button className="btn btn-danger" onClick={() => filterLeads("Proposal Sent")}>Proposal Sent</button>
            <button className="btn btn-secondary" onClick={() => filterLeads("All")}>All</button>
          </div>
        </div>

        <div>
          <h5>Leads</h5>
          <ul className="list-group">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <li key={lead.id} className="list-group-item">
                  {lead.name} - <strong>{lead.status}</strong>
                </li>
              ))
            ) : (
              <li className="list-group-item">No Leads Found</li>
            )}
          </ul>
        </div>

        <Link className="btn btn-primary mt-3" to="/newLead">Add New Lead</Link>
      </main>
    </div>
  </div>
</>
  );
};

export default Dashboard;
