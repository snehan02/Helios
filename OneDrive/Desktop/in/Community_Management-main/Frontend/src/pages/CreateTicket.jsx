import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../createticket.css";

function CreateTicket() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "",
    district: "",
    taluk: "",
    wardNo: "",
    attachment: null,
    confirm: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.confirm) {
      alert("Please confirm that the issue described is genuine.");
      return;
    }
    console.log("Ticket submitted:", formData);
    alert("Ticket created successfully!");
    navigate("/tickets");
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      category: "",
      district: "",
      taluk: "",
      wardNo: "",
      attachment: null,
      confirm: false
    });
  };

  return (
    <div className="create-ticket-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Ⓒ CIVIC HUB</h2>
        <nav>
          <ul>
            <li><Link to="/home" className="nav-link">🏠 Home</Link></li>
            <li><Link to="/dashboard" className="nav-link">📊 Dashboard</Link></li>
            <li><Link to="/members" className="nav-link">👥 Members</Link></li>
            <li>🎉 Events</li>
            <li className="active"><Link to="/tickets" className="nav-link">🎫 Tickets</Link></li>
            <li>💰 Fundraising</li>
            <li>📈 Analytics</li>
            <li>📋 Notice Board</li>
            <li>🪶 Post</li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="panel">
          <header className="page-header">
            <div className="header-left">
              <Link to="/tickets" className="back-link">← Raise a New Ticket</Link>
              <p className="header-subtitle">Fill in the details below to submit a new ticket. Reqired field are marked with *</p>
            </div>
            <div className="header-actions">
              <div className="header-icons">
                <span title="Notifications">🔔</span>
                <Link to="/profile" className="nav-link" title="Profile">👤</Link>
              </div>
              <button type="submit" form="ticket-form" className="btn-post">Post Ticket</button>
            </div>
          </header>

          <form id="ticket-form" onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label>Ticket Title <span className="required">*</span></label>
            <input
              type="text"
              name="title"
              placeholder="e.g- pathhole on main street"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows={4}
              placeholder="describe the issue"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Priority Level<span className="required">*</span></label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="priority"
                  value="Low"
                  checked={formData.priority === "Low"}
                  onChange={handleChange}
                />
                <span>Low</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="priority"
                  value="Medium"
                  checked={formData.priority === "Medium"}
                  onChange={handleChange}
                />
                <span>Medium</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="priority"
                  value="High"
                  checked={formData.priority === "High"}
                  onChange={handleChange}
                />
                <span>High</span>
              </label>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Category/Issue Type <span className="required">*</span></label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                <option value="Water">Water</option>
                <option value="Electricity">Electricity</option>
                <option value="Road">Road</option>
                <option value="School">School</option>
                <option value="Medical">Medical</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="form-group">
              <label>District <span className="required">*</span></label>
              <input
                type="text"
                name="district"
                placeholder="Mysore"
                value={formData.district}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Taluk<span className="required">*</span></label>
              <input
                type="text"
                name="taluk"
                placeholder="HD kote"
                value={formData.taluk}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Ward No <span className="required">*</span></label>
              <input
                type="text"
                name="wardNo"
                placeholder="eg. 12"
                value={formData.wardNo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Attachment (optional)</label>
            <div className="file-upload-zone">
              <input
                type="file"
                id="attachment"
                accept="image/png,image/jpeg,.pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="attachment" className="upload-label">
                <div className="upload-icon">☁️</div>
                <p>Click to upload or drag and drop</p>
                <small>PNG,JPG or PDF (MAX 5MB)</small>
              </label>
              {formData.attachment && <p className="file-selected">{formData.attachment.name}</p>}
            </div>
          </div>

          <div className="confirm-group">
            <label className="confirm-label">
              <input
                type="checkbox"
                name="confirm"
                checked={formData.confirm}
                onChange={handleChange}
              />
              <span>I confirm that the issue described above is genius</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-reset" onClick={handleReset}>Reset Form</button>
            <button type="submit" className="btn-submit">Submit Ticket</button>
          </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateTicket;
