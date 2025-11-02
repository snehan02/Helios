import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../StartFundraiser.css";

export default function StartFundraiser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    duration: "",
    attachment: null,
    payment: "UPI",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Fundraiser submitted successfully!");
  };

  const handleReset = () => {
    setFormData({
      title: "",
      amount: "",
      description: "",
      category: "",
      duration: "",
      attachment: null,
      payment: "UPI",
    });
  };

  return (
    <div className="fundraiser-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Ⓒ CIVIC HUB</h2>
        <ul>
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              🏠 Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              📊 Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/members"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              👥 Members
            </NavLink>
          </li>
          <li>🎉 Events</li>
          <li>
            <NavLink
              to="/tickets"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              🎫 Tickets
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/fundraising"
              end={false} // Matches nested routes like /fundraising/start
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              💰 Fundraising
            </NavLink>
          </li>
          <li>📈 Analytics</li>
          <li>📋 Notice Board</li>
          <li>🪶 Post</li>
        </ul>
      </aside>

      {/* Main Section */}
      <main className="main-content">
        <header className="page-header">
          <h2>Start a New Fundraiser</h2>
          <div className="header-icons">
            <span title="Notifications">🔔</span>
            <Link to="/profile" className="nav-link">
              👤
            </Link>
          </div>
        </header>

        <form className="fundraiser-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Fundraiser Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder="Enter a catchy title for your fundraiser"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Target Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              placeholder="$200"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Describe the issue"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Category/Issue Type *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Environment">Environment</option>
              <option value="Community">Community</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Duration *</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              placeholder="e.g. 30 days"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Attachment (optional)</label>
            <input
              type="file"
              name="attachment"
              accept=".png, .jpg, .jpeg, .pdf"
              onChange={handleChange}
            />
            <small>PNG, JPG or PDF (max 5MB)</small>
          </div>

          <div className="form-group">
            <label>Payment Gateway</label>
            <select
              name="payment"
              value={formData.payment}
              onChange={handleChange}
            >
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-reset" onClick={handleReset}>
              Reset Form
            </button>
            <button type="submit" className="btn-submit">
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
