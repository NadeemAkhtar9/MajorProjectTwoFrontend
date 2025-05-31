import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 


const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [leadStats, setLeadStats] = useState({
    new: 0,
    contacted: 0,
    qualified: 0
  });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get("https://major-project-two-backend.vercel.app/leads/");
        setLeads(response.data);
        setFilteredLeads(response.data);

        const stats = { new: 0, contacted: 0, qualified: 0 };
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
      <div className="bg-dark text-white text-center py-3 display-6"> Anvaya CRM Dashboard</div>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav className="col-md-2 sidebar bg-dark text-white p-3">
            <h4>Navigation</h4>
            <ul className="nav flex-column">
              <li className="nav-item"><Link className="nav-link text-white" to="/leads">Leads</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/sales">Sales</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/agents">Agents</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/status">Status</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/reports">Reports</Link></li>
            </ul>
          </nav>

          {/* Main Content */}
          <main className="col-md-10 p-4">
            <div className="lead-status bg-light p-3 rounded mb-3">
              <h5>Lead Status</h5>
              <p>New: <span>{leadStats.new}</span> Leads</p>
              <p>Contacted: <span>{leadStats.contacted}</span> Leads</p>
              <p>Qualified: <span>{leadStats.qualified}</span> Leads</p>
            </div>

            <div className="quick-filters mb-3">
              <h4>Quick Filters:</h4>
              <button className="btn btn-primary me-2" onClick={() => filterLeads("New")}>New</button>
              <button className="btn btn-success me-2" onClick={() => filterLeads("Contacted")}>Contacted</button>
              <button className="btn btn-warning" onClick={() => filterLeads("Qualified")}>Qualified</button>
              <button className="btn btn-danger ms-2" onClick={() => filterLeads("Proposal Sent")}>Proposal Sent</button>
              <button className="btn btn-secondary ms-2" onClick={() => filterLeads("All")}>All</button>
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
