import { Link, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { LeadContext } from "../context/LeadContext";


const LeadDetails = () => {
  const { leadId } = useParams();
  //const { data, setData } = useContext(LeadContext);
  const [leadData,setLeadData] = useState([])
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [comments, setComments] = useState([]);

  useEffect(() => {
      const fetchLeads = async () => {
        try {
          const response = await axios.get(`https://major-project-two-backend.vercel.app/leads/`);
          setLeadData(response.data);
        } catch (error) {
          console.error("Error fetching leads:", error);
        }
      };
      fetchLeads();
    }, []);
    console.log(leadData)
    useEffect(() => {
      const fetchLeads = async () => {
        try {
          const response = await axios.get(`https://major-project-two-backend.vercel.app/leads/${leadId}/comments`);
          setComments(response.data);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      };
      fetchLeads();
    }, []);
    //console.log(comments)
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    status: "",
    priority: "",
    timeToClose: "",
    tags: [],
    salesAgent: "",
  });

  const catchData = leadData?.find((lead) => lead._id === leadId);

  useEffect(() => {
    if (catchData) {
      setFormData({
        name: catchData.name || "",
        source: catchData.source || "",
        status: catchData.status || "",
        priority: catchData.priority || "",
        timeToClose: catchData.timeToClose || "",
        tags: catchData.tags || [],
        salesAgent: catchData.salesAgent?._id || "",
      });
    }
  }, [catchData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending Data:", formData); 

      const response = await axios.put(`https://major-project-two-backend.vercel.app/leads/${leadId}`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Updated Lead:", response.data);

      setSuccessMessage("Lead updated successfully!");
      //setData(data.map((lead) => (lead._id === leadId ? response.data.lead : lead)));
      setShowForm(false);
       window.location.reload();
    } catch (error) {
      console.error("Error updating lead:", error.response?.data || error.message);
      setSuccessMessage(`Failed to update lead: ${error.response?.data?.details || "Unknown error"}`);
    }
  };
const [newComment, setNewComment] = useState("");

const handleCommentSubmit = async (e) => {
  e.preventDefault();
  if (!newComment.trim()) return;

  try {
    const response = await axios.post(`https://major-project-two-backend.vercel.app/leads/${leadId}/comments`, {
      commentText: newComment,
    });

    setComments([...comments, response.data]);
    setNewComment("");
    window.location.reload();
  } catch (error) {
    console.error("Error adding comment:", error.response?.data || error.message);
  }
};


  return (
    <>
      <div className="bg-dark text-white text-center py-3 display-6">Lead Management : {catchData?.name || "Loading..."}</div>
      <div className="container-fluid">
        <div className="row">
          <nav className="col-md-2 sidebar bg-dark text-white p-3">
            <h4>Lead Management</h4>
            <ul className="nav flex-column">
              <li className="nav-item"><Link className="nav-link text-white" to="/">← Back to Dashboard</Link></li>
            </ul>
          </nav>

          <main className="col-md-10 p-4">
            <h5>Lead Details</h5>
           <p><strong>Lead Name:</strong> {catchData?.name}</p>
            <p><strong>Sales Agent:</strong> {catchData?.salesAgent?.name}</p>
            <p><strong>Lead Source:</strong> {catchData?.source}</p>
            <p><strong>Lead Status:</strong> {catchData?.status}</p>
            <p><strong>Priority:</strong> {catchData?.priority}</p>
            <p><strong>Time to Close:</strong> {catchData?.timeToClose}</p>

            {successMessage && <p className="text-success">{successMessage}</p>}

            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel Editing" : "Edit Lead Details"}
            </button>

            {showForm && (
              <div className="mt-4 p-3 border rounded bg-light"> {/* Form properly styled and visible */}
                <h5>Edit Lead</h5>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label>Lead Name</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Source</label>
                    <input type="text" className="form-control" name="source" value={formData.source} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label>Status</label>
                    <select className="form-select" name="status" value={formData.status} onChange={handleChange} required>
                      <option value="New">New</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Priority</label>
                    <select className="form-select" name="priority" value={formData.priority} onChange={handleChange} required>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Time to Close</label>
                    <input type="number" className="form-control" name="timeToClose" value={formData.timeToClose} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="btn btn-success">Save Changes</button>
                </form>
              </div>
            )}
            
           <ul className="list-group mt-4">
            <p>Comments</p>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <li key={comment._id} className="list-group-item">
                    <strong>{comment.author?.name || "Anonymous"}:</strong> {comment.commentText}
                  </li>
                ))
              ) : (
                <li className="list-group-item">No comments found.</li>
              )}
          </ul>
          <div className="mt-4">
              <h5>Add a Comment</h5>
              <form onSubmit={handleCommentSubmit}>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Write your comment here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-secondary">Add Comment</button>
              </form>
          </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default LeadDetails;
