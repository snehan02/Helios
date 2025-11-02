import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../auth";
import "../profile.css";

function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Suresh",
    role: "Party Worker",
    location: "Banglore",
    contact: "8098756587",
    district: "Bengaluru urban",
    taluk: "Bengaluru",
    bio: "Dedicated party worker with over 10 years of experience in grassroot-level political organization and public engagement. Committed to the party's ideology and working towards its success in the upcoming elections",
    occupation: "Booth Level President",
    voterId: "XYZ123658754",
    wardNo: "54",
    photo: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", formData);
    alert("Profile changes saved!");
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Ⓒ CIVIC HUB</h2>
        <nav>
          <ul>
            <li><Link to="/home" className="nav-link">🏠 Home</Link></li>
            <li className="active"><Link to="/dashboard" className="nav-link">📊 Dashboard</Link></li>
            <li><Link to="/members" className="nav-link">👥 Members</Link></li>
            <li>🎉 Events</li>
            <li><Link to="/tickets" className="nav-link">🎫 Tickets</Link></li>
            <li><Link to="/fundraising" className="nav-link">💰 Fundraising</Link></li>
            <li>📈 Analytics</li>
            <li>📋 Notice Board</li>
            <li>🪶 Post</li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="page-header">
          <h2>Edit Profile</h2>
          <div className="header-icons">
            <span>🔔</span>
            <span>👤</span>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Profile Photo */}
          <div className="photo-section">
            <div className="avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div className="photo-upload">
              <label className="photo-label">Profile photo</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="photo" className="file-button">Choose File</label>
                <span className="file-name">{formData.photo ? formData.photo.name : 'No file chosen'}</span>
              </div>
            </div>
          </div>

          {/* Form Grid */}
          <div className="form-grid-3">
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label>Contact</label>
              <input type="tel" name="contact" value={formData.contact} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>District</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Taluk</label>
              <input type="text" name="taluk" value={formData.taluk} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea name="bio" rows={4} value={formData.bio} onChange={handleChange} />
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label>Occupation</label>
              <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Voter Id</label>
              <input type="text" name="voterId" value={formData.voterId} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Ward No</label>
              <input type="text" name="wardNo" value={formData.wardNo} onChange={handleChange} />
            </div>
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
            <button type="submit" className="btn-save">Save changes</button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditProfile;
