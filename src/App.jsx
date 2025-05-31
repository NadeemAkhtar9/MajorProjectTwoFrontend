import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LeadContext } from "./context/LeadContext";
import useFetch from "./hooks/useFetch";
import Dashboard from "./components/Dashboard";
import Leads from "./components/Leads";
import Sales from "./components/Sales";
import Reports from "./components/Reports";
import Agents from "./components/Agents";
import AddNewLeadForm from "./components/AddNewLeadForm";
import AddNewAgentForm from "./components/AddNewAgentForm";
import Status from "./components/Status";
import LeadDetails from "./components/LeadDetails";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const { data: fetchedData } = useFetch("http://localhost:3000/leads/");
  const [data, setData] = useState([]);
  //console.log(data)

  useEffect(() => {
    if (fetchedData) setData(fetchedData);
  }, [fetchedData]);

  return (
    <LeadContext.Provider value={{ data, setData }}> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/newLead" element={<AddNewLeadForm />} />
          <Route path="/newAgent" element={<AddNewAgentForm />} />
          <Route path="/status" element={<Status />} />
          <Route path="/lead/:leadId" element={<LeadDetails />} />
        </Routes>
      </BrowserRouter>
    </LeadContext.Provider>
  );
}

export default App;
