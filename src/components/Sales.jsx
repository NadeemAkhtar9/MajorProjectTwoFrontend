import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

const SalesAgentView = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [salesAgents, setSalesAgents] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortType, setSortType] = useState("");

  const salesAgentFilter = searchParams.get("salesAgent") || "";
  const statusFilter = searchParams.get("status") || "";
  const priorityFilter = searchParams.get("priority") || "";

  // Fetch Leads & Sales Agents from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadsResponse = await axios.get("https://major-project-two-backend.vercel.app/leads/");
        setLeads(leadsResponse.data);
        setFilteredLeads(leadsResponse.data);

        const agentsResponse = await axios.get("https://major-project-two-backend.vercel.app/agents/");
        setSalesAgents(agentsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //  Apply Filters and Sorting
  useEffect(() => {
    let filtered = [...leads];

    if (salesAgentFilter) {
      filtered = filtered.filter((lead) => lead.salesAgent?._id === salesAgentFilter);
    }
    if (statusFilter) {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }
    if (priorityFilter) {
      filtered = filtered.filter((lead) => lead.priority === priorityFilter);
    }

    if (sortType === "timeToCloseAsc") {
      filtered.sort((a, b) => Number(a.timeToClose) - Number(b.timeToClose));
    }
    if (sortType === "timeToCloseDesc") {
      filtered.sort((a, b) => Number(b.timeToClose) - Number(a.timeToClose));
    }

    setFilteredLeads(filtered);
  }, [salesAgentFilter, statusFilter, priorityFilter, sortType, leads]);

  return (
    <>
      <div className="bg-dark text-white text-center py-3 display-6">Leads by Sales Agent</div>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav className="col-md-2 sidebar bg-dark text-white p-3">
            <h5>Sales Agent Management</h5>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">← Back to Dashboard</Link>
              </li>
            </ul>
          </nav>

          {/* Main Content */}
          <main className="col-md-10 p-4">
            <h5>Lead List by Sales Agent</h5>

            {/* Filters */}
            <div className="row my-3">
              <h5>Filters</h5>
              <div className="col-md-4">
                <select className="form-select" onChange={(e) => setSearchParams({ salesAgent: e.target.value, status: statusFilter, priority: priorityFilter })}>
                  <option value="">Filter by Sales Agent</option>
                  {salesAgents.map((agent) => (
                    <option key={agent._id} value={agent._id}>{agent.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <select className="form-select" onChange={(e) => setSearchParams({ salesAgent: salesAgentFilter, status: e.target.value, priority: priorityFilter })}>
                  <option value="">Filter by Status</option>
                  <option value="New">New</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Contacted">Contacted</option>
                </select>
              </div>
              <div className="col-md-4">
                <select className="form-select" onChange={(e) => setSearchParams({ salesAgent: salesAgentFilter, status: statusFilter, priority: e.target.value })}>
                  <option value="">Filter by Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Sorting */}
            <div className="row my-3">
              <h5>Sort by Time to Close</h5>
              <div className="col-md-4">
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="sortType" value="timeToCloseAsc" onChange={(e) => setSortType(e.target.value)} />
                  <label className="form-check-label">Ascending (Fastest First)</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="sortType" value="timeToCloseDesc" onChange={(e) => setSortType(e.target.value)} />
                  <label className="form-check-label">Descending (Longest First)</label>
                </div>
              </div>
            </div>

            {/* Lead List */}
            <h5>Leads</h5>
            <ul className="list-group">
              {filteredLeads.map((lead) => (
                <li key={lead._id} className="list-group-item">
                  {lead.name} - <strong>Status: {lead.status}</strong> - <strong>Time to Close: {lead.timeToClose} days</strong> -{lead.priority} - <strong>{lead.salesAgent.name}</strong>
                </li>
              ))}
            </ul>
          </main>
        </div>
      </div>
    </>
  );
};

export default SalesAgentView;
