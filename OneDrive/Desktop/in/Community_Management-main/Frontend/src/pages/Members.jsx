import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../auth";
import "../members.css";

function Members() {
  const navigate = useNavigate();
  const handleLogout = () => { clearAuth(); navigate('/login'); };
  const DATA = useMemo(() => ([
    { id: 1, name: "Suresh S", email: "suresh@example.com", role: "District Head", district: "Bengaluru Urban", taluk: "Bengaluru", status: "Active" },
    { id: 2, name: "Ram Kumar", email: "ram@example.com", role: "Taluk Head", district: "Mysore", taluk: "HD Kote", status: "Active" },
    { id: 3, name: "Anita Rao", email: "anita@example.com", role: "Booth Level", district: "Bengaluru Rural", taluk: "Hosakote", status: "Inactive" },
    { id: 4, name: "Rahul", email: "rahul@example.com", role: "Volunteer", district: "Hubli", taluk: "Hubli", status: "Active" },
  ]), []);

  const [filters, setFilters] = useState({ role: "All", status: "All", region: "All" });

  const filtered = useMemo(() => DATA.filter(m => (
    (filters.role === "All" || m.role === filters.role) &&
    (filters.status === "All" || m.status === filters.status) &&
    (filters.region === "All" || m.district === filters.region)
  )), [DATA, filters]);

  const counts = useMemo(() => ({
    total: DATA.length,
    active: DATA.filter(m => m.status === 'Active').length,
    districtHeads: DATA.filter(m => m.role === 'District Head').length,
    talukHeads: DATA.filter(m => m.role === 'Taluk Head').length,
  }), [DATA]);

  const resetFilters = () => setFilters({ role: "All", status: "All", region: "All" });

  return (
    <div className="members-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Ⓒ CIVIC HUB</h2>
        <nav>
          <ul>
            <li><Link to="/home" className="nav-link">🏠 Home</Link></li>
            <li><Link to="/dashboard" className="nav-link">📊 Dashboard</Link></li>
            <li className="active"><Link to="/members" className="nav-link">👥 Members</Link></li>
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
          <h2>Members</h2>
          <div className="header-actions">
            <div className="header-icons">
              <span title="Notifications">🔔</span>
              <Link to="/profile" className="nav-link" title="Profile">👤</Link>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        {/* Stats */}
        <section className="stats">
          <div className="stat-card"><p>Total Members</p><h3>{counts.total}</h3></div>
          <div className="stat-card"><p>Active Members</p><h3>{counts.active}</h3></div>
          <div className="stat-card"><p>District Heads</p><h3>{counts.districtHeads}</h3></div>
          <div className="stat-card"><p>Taluk Heads</p><h3>{counts.talukHeads}</h3></div>
        </section>

        {/* Filters */}
        <section className="filters">
          <div className="filter-group">
            <label>Role</label>
            <select value={filters.role} onChange={e=>setFilters(f=>({...f, role:e.target.value}))}>
              <option>All</option>
              <option>District Head</option>
              <option>Taluk Head</option>
              <option>Booth Level</option>
              <option>Volunteer</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select value={filters.status} onChange={e=>setFilters(f=>({...f, status:e.target.value}))}>
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Region</label>
            <select value={filters.region} onChange={e=>setFilters(f=>({...f, region:e.target.value}))}>
              <option>All</option>
              <option>Bengaluru Urban</option>
              <option>Mysore</option>
              <option>Hubli</option>
            </select>
          </div>
          <div className="filter-actions">
            <button className="btn-secondary" onClick={resetFilters}>Clear</button>
            <button className="btn-primary">Apply</button>
          </div>
        </section>

        {/* Table */}
        <section className="member-table">
          <table>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>District</th>
                <th>Taluk</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id}>
                  <td><div className="avatar">👤</div></td>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.role}</td>
                  <td>{m.district}</td>
                  <td>{m.taluk}</td>
                  <td><span className={m.status === 'Active' ? 'pill active' : 'pill inactive'}>{m.status}</span></td>
                  <td><button className="link-btn">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default Members;
