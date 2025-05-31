import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";


const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [salesAgents, setSalesAgents] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortPriority, setSortPriority] = useState("");

  const statusFilter = searchParams.get("status") || "";
  const salesAgentFilter = searchParams.get("salesAgent") || "";
  const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };



  //  Fetch Leads & Filters from API (Dynamic Lists)
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get("https://major-project-two-backend.vercel.app/leads/");
        setLeads(response.data);
        setFilteredLeads(response.data);

        //  Extract unique statuses dynamically
        const uniqueStatuses = [...new Set(response.data.map(lead => lead.status))];
        setStatuses(uniqueStatuses);

        //  Extract unique sales agents dynamically
        const uniqueSalesAgents = [...new Set(response.data.map(lead => lead.salesAgent?.name).filter(Boolean))];
        setSalesAgents(uniqueSalesAgents);

      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, []);

  //  Apply Filters when Selected
  useEffect(() => {
    let filtered = [...leads];

    if (statusFilter) {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }
    if (salesAgentFilter) {
      filtered = filtered.filter(lead => lead.salesAgent?.name === salesAgentFilter);
    }

    setFilteredLeads(filtered);
  }, [statusFilter, salesAgentFilter, leads]);

  //  Apply Sorting on Priority when Selected
  useEffect(() => {
  let sortedLeads = [...filteredLeads];
  const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };

  if (sortPriority === "highToLow") {
    sortedLeads.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  }
  if (sortPriority === "lowToHigh") {
    sortedLeads.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  setFilteredLeads(sortedLeads);
}, [sortPriority]);


  return (
    <>
      <div className="bg-dark text-white text-center py-3 display-6">Lead List</div>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav className="col-md-2 sidebar bg-dark text-white p-3">
            <h4>Lead Management</h4>
            <ul className="nav flex-column">
              <li className="nav-item"><Link className="nav-link text-white" to="/">← Back to Dashboard</Link></li>
            </ul>
          </nav>

          {/* Main Content */}
          <main className="col-md-10 p-4">
            <h5>Leads (Original List)</h5>
            <ul className="list-group">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <li key={lead._id} className="list-group-item">
                    {lead.name} - <strong>{lead.status}</strong> - {lead.priority} <Link className="btn btn-primary" to={`/lead/${lead._id}`}>Details</Link>
                  </li>
                ))
              ) : (
                <li className="list-group-item">No Leads Found</li>
              )}
            </ul>
            {/* Filters */}
            <div className="row my-3">
              <h5>Apply Filters</h5>
              <div className="col-md-4">
                <select className="form-select" onChange={(e) => setSearchParams({ status: e.target.value, salesAgent: salesAgentFilter })}>
                  <option value="">Filter by Status</option>
                  {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <select className="form-select" onChange={(e) => setSearchParams({ status: statusFilter, salesAgent: e.target.value })}>
                  <option value="">Filter by Sales Agent</option>
                  {salesAgents.map(agent => <option key={agent} value={agent}>{agent}</option>)}
                </select>
              </div>
            </div>

            {/* Sorting Section */}
            <div className="row my-3">
              <h5>Sort by Priority</h5>
              <div className="col-md-4">
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="sortPriority" value="highToLow" onChange={(e) => setSortPriority(e.target.value)} />
                  <label className="form-check-label">High to Low</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="sortPriority" value="lowToHigh" onChange={(e) => setSortPriority(e.target.value)} />
                  <label className="form-check-label">Low to High</label>
                </div>
              </div>
            </div>

            {/* Filtered & Sorted Leads */}
            <h5>Filtered Leads</h5>
            <ul className="list-group">
              {filteredLeads.map(lead => (
                <li key={lead._id} className="list-group-item">
                  {lead.name} - <strong>{lead.status}</strong> - {lead.priority} - {lead.salesAgent?.name || "Unknown"} 
                </li>
              ))}
            </ul>

            {/* Add Lead */}
            <Link className="btn btn-danger mt-3" to="/newLead">Add New Lead</Link>
          </main>
        </div>
      </div>
    </>
  );
};

export default Leads;
