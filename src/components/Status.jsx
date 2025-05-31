import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

const LeadStatusView = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [salesAgents, setSalesAgents] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortOrder, setSortOrder] = useState("asc"); // ASC by default

  const salesAgentFilter = searchParams.get("salesAgent") || "";
  const priorityFilter = searchParams.get("priority") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadsResponse = await axios.get("https://major-project-two-backend.vercel.app/leads/");
        setLeads(leadsResponse.data);
        setFilteredLeads(leadsResponse.data);

        const agentsResponse = await axios.get("https://major-project-two-backend.vercel.app/agents/");
        setSalesAgents(agentsResponse.data);

        const uniqueStatuses = [...new Set(leadsResponse.data.map((lead) => lead.status))];
        setStatuses(uniqueStatuses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...leads];

    if (salesAgentFilter) {
      filtered = filtered.filter((lead) => lead.salesAgent?._id === salesAgentFilter);
    }
    if (priorityFilter) {
      filtered = filtered.filter((lead) => lead.priority === priorityFilter);
    }

    setFilteredLeads(filtered);
  }, [salesAgentFilter, priorityFilter, leads]);

  return (
    <>
      <div className="bg-dark text-white text-center py-3 display-6">Leads by Status</div>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav className="col-md-2 sidebar bg-dark text-white p-3">
            <h5>Lead List by Status</h5>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">← Back to Dashboard</Link>
              </li>
            </ul>
          </nav>

          {/* Main Content */}
          <main className="col-md-10 p-4">

            {/* Status Sections */}
            {statuses.map((status) => (
              <div key={status} className="mb-4">
                <h6 className="border-bottom pb-2">Status: {status}</h6>
                <ul className="list-group">
                  {filteredLeads
                    .filter((lead) => lead.status === status)
                    .map((lead) => (
                      <li key={lead._id} className="list-group-item">
                        {lead.name} - <strong>[Sales Agent: {lead.salesAgent?.name || "Unknown"}]</strong> - {lead.priority}
                      </li>
                    ))}
                </ul>
              </div>
            ))}

            {/* Filters (status filter removed) */}
            <div className="row my-3">
              <h5>Filters</h5>
              <div className="col-md-6">
                <select
                  className="form-select"
                  onChange={(e) =>
                    setSearchParams({ salesAgent: e.target.value, priority: priorityFilter })
                  }
                >
                  <option value="">Filter by Sales Agent</option>
                  {salesAgents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <select
                  className="form-select"
                  onChange={(e) =>
                    setSearchParams({ salesAgent: salesAgentFilter, priority: e.target.value })
                  }
                >
                  <option value="">Filter by Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Sorting Radio Buttons */}
            <div className="my-3">
              <h5>Sort by Time to Close</h5>
              <div>
                <label className="me-3">
                  <input
                    type="radio"
                    name="sortOrder"
                    value="asc"
                    checked={sortOrder === "asc"}
                    onChange={() => setSortOrder("asc")}
                  />{" "}
                  Ascending
                </label>
                <label>
                  <input
                    type="radio"
                    name="sortOrder"
                    value="desc"
                    checked={sortOrder === "desc"}
                    onChange={() => setSortOrder("desc")}
                  />{" "}
                  Descending
                </label>
              </div>
            </div>

            {/* Sorted Lead List */}
            <div>
              <h5>Leads</h5>
              <ul className="list-group">
                {leads.length > 0 ? (
                  [...leads]
                    .sort((a, b) => {
                      const timeA = new Date(a.timeToClose);
                      const timeB = new Date(b.timeToClose);
                      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
                    })
                    .map((lead) => (
                      <li key={lead.id} className="list-group-item">
                        {lead.name} - <strong>{lead.status}</strong> -{lead.timeToClose}
                      </li>
                    ))
                ) : (
                  <li className="list-group-item">No Leads Found</li>
                )}
              </ul>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default LeadStatusView;
