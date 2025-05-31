import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Reports = () => {
 const [closedLeads, setClosedLeads] = useState([]);
  const [pipelineCount, setPipelineCount] = useState(0);

 useEffect(() => {
    // Get leads closed last week
    axios.get("https://major-project-two-backend.vercel.app/report/last-week").then((res) => {
      setClosedLeads(res.data);
    });

    // Get total leads in pipeline
    axios.get("http://localhost:3000/report/pipeline").then((res) => {
      setPipelineCount(res.data.totalLeadsInPipeline);
    });
  }, []);

  // Pie chart for closed vs in pipeline
  const closedVsPipelineData = {
    labels: ["Closed Leads", "In Pipeline"],
    datasets: [
      {
        data: [closedLeads.length, pipelineCount],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  // Group leads by sales agent
  const salesAgentMap = {};
  closedLeads.forEach((lead) => {
    if (lead.salesAgent in salesAgentMap) {
      salesAgentMap[lead.salesAgent]++;
    } else {
      salesAgentMap[lead.salesAgent] = 1;
    }
  });

  const agentNames = Object.keys(salesAgentMap);
  const agentCounts = Object.values(salesAgentMap);

  // Bar chart for leads closed by sales agent
  const leadsByAgentData = {
    labels: agentNames,
    datasets: [
      {
        label: "Closed Leads",
        data: agentCounts,
        backgroundColor: "#4BC0C0",
      },
    ],
  };

  return (
    <>
      <div className="bg-dark text-white text-center py-3 display-6">Anvaya CRM Reports</div>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav className="col-md-2 sidebar bg-dark text-white p-3">
            <h4>Report</h4>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">
                  ← Back to Dashboard
                </Link>
              </li>
            </ul>
          </nav>

          {/* Main Content */}
          <main className="col-md-10 p-4">
            <h5>Report Overview</h5>

            <div className="row text-center">
        {/* Pie Chart: Closed vs Pipeline */}
        <div className="col-md-6">
          <h5>Closed vs In Pipeline</h5>
          <Pie data={closedVsPipelineData} />
        </div>

        {/* Bar Chart: Leads by Agent */}
        <div className="col-md-6">
          <h5>Closed Leads by Sales Agent</h5>
          <Bar  data={leadsByAgentData} />
        </div>
      </div>

          </main>
        </div>
      </div>
    </>
  );
};

export default Reports;
