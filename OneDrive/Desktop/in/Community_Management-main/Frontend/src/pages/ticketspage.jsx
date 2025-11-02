import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../ticketspage.css";

function TicketsPage() {
  const BACKEND_ENABLED = (import.meta.env.VITE_BACKEND_ENABLED || 'false') === 'true';
  const SAMPLE_TICKETS = [
    { id: 1234, title: 'Water', reporter: 'Suresh', reportedOn: '11-09-2024', priority: 'High', status: 'Open' },
    { id: 1235, title: 'General', reporter: 'Suresh', reportedOn: '19-09-2024', priority: 'Low', status: 'Progress' },
    { id: 1236, title: 'School', reporter: 'Suresh', reportedOn: '17-09-2024', priority: 'Medium', status: 'Progress' },
    { id: 1237, title: 'Water', reporter: 'Suresh', reportedOn: '09-09-2024', priority: 'Low', status: 'Resolved' },
    { id: 1238, title: 'Electricity', reporter: 'Suresh', reportedOn: '12-09-2024', priority: 'Medium', status: 'Open' },
    { id: 1239, title: 'Water', reporter: 'Suresh', reportedOn: '02-10-2024', priority: 'Low', status: 'Resolved' },
    { id: 1240, title: 'Fund', reporter: 'Suresh', reportedOn: '12-09-2024', priority: 'Medium', status: 'Open' },
    { id: 1241, title: 'Road', reporter: 'Suresh', reportedOn: '22-09-2024', priority: 'High', status: 'Progress' },
    { id: 1242, title: 'Medical', reporter: 'Suresh', reportedOn: '24-09-2024', priority: 'High', status: 'Open' },
  ];
  const [tickets, setTickets] = useState(BACKEND_ENABLED ? [] : SAMPLE_TICKETS);
  const [loading, setLoading] = useState(BACKEND_ENABLED);
  const [error, setError] = useState(null);

  const normalize = (t) => {
    // Normalize backend keys to what this UI expects
    const id = t.id ?? t.pk ?? t.ticket_id ?? null;
    const title = t.title ?? t.name ?? "";
    const reporter = t.reportedBy ?? t.reporter ?? t.reported_by ?? t.reported_by_name ?? "-";
    const reportedOn = t.reportedOn ?? t.reported_on ?? t.date ?? null;
    const priority = t.priority ?? t.priority_level ?? "Low";
    const status = t.status ?? t.current_status ?? "Open";
    return { id, title, reporter, reportedOn, priority, status };
  };

  useEffect(() => {
    if (!BACKEND_ENABLED) return; // use sample tickets without fetching
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/tickets");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data.map(normalize) : [];
        if (mounted) setTickets(list);
      } catch (err) {
        console.warn("Failed to load tickets:", err);
        if (mounted) setError(err.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [BACKEND_ENABLED]);

  const getPriorityClass = (priority) => {
    if (priority === "High") return "priority high";
    if (priority === "Medium") return "priority medium";
    return "priority low";
  };

  const getStatusClass = (status) => {
    if (status === "Open") return "status open";
    if (status === "Progress") return "status progress";
    return "status resolved";
  };

  const formatReportedOn = (reportedOn) => {
    if (!reportedOn) return "";
    // if already dd-mm-yyyy, return as-is
    if (/^\d{2}-\d{2}-\d{4}$/.test(reportedOn)) return reportedOn;
    // try ISO YYYY-MM-DD or full ISO
    try {
      const datePart = String(reportedOn).split('T')[0];
      const [y, m, d] = datePart.split('-');
      if (d && m && y) return `${d}-${m}-${y}`;
    } catch (e) {}
    return String(reportedOn);
  };

  return (
    <div className="tickets-container">
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
            <li><Link to="/fundraising" className="nav-link">💰 Fundraising</Link></li>
            <li>📈 Analytics</li>
            <li>📋 Notice Board</li>
            <li>🪶 Post</li>
          </ul>
        </nav>
      </aside>

      {/* Main Section */}
      <main className="main-content">
        <header className="page-header">
          <h2>Tickets</h2>
          <div className="header-icons">
            <span title="Notifications">🔔</span>
            <Link to="/profile" className="nav-link" title="Profile">👤</Link>
          </div>
        </header>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <p>Total Tickets</p>
            <h3>{tickets.length}</h3>
          </div>
          <div className="stat-card">
            <p>Open Tickets</p>
            <h3>{tickets.filter(t => t.status === 'Open').length}</h3>
          </div>
          <div className="stat-card">
            <p>Pending Tickets</p>
            <h3>{tickets.filter(t => t.status === 'Progress' || t.status === 'Pending').length}</h3>
          </div>
          <div className="stat-card">
            <p>Resolved Tickets</p>
            <h3>{tickets.filter(t => t.status === 'Resolved').length}</h3>
          </div>
          <div className="stat-card">
            <p>Success Rate</p>
            <h3>{tickets.length ? Math.round((tickets.filter(t=>t.status==='Resolved').length / tickets.length) * 100) + '%' : '—'}</h3>
          </div>
        </div>

        {/* Actions */}
        <div className="actions">
          <Link to="/tickets/create">
            <button className="create-btn">➕ Create Ticket</button>
          </Link>
          <button>Ticket Form</button>
          <button>Export</button>
          <select>
            <option>dd-mm-yy</option>
          </select>
          <select>
            <option>All Status</option>
          </select>
        </div>

        {/* Ticket Table */}
        <div className="ticket-table">
          <table>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Title</th>
                <th>Reported By</th>
                <th>Reported On</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{padding:20}}>Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={7} style={{padding:20,color:'red'}}>Error: {error}</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={7} style={{padding:20}}>No tickets found</td></tr>
              ) : (
                tickets.map((t, i) => (
                  <tr key={t.id ?? i}>
                    <td>
                      {t.id ? (
                        <Link to={`/tickets/${t.id}`} style={{color:'inherit', textDecoration:'none'}}>
                          {String(t.id).startsWith('#') ? t.id : `#${t.id}`}
                        </Link>
                      ) : `#${i+1}`}
                    </td>
                    <td>{t.title}</td>
                    <td>{t.reporter}</td>
                    <td>{formatReportedOn(t.reportedOn)}</td>
                    <td><span className={getPriorityClass(t.priority)}>{t.priority}</span></td>
                    <td><span className={getStatusClass(t.status)}>{t.status}</span></td>
                    <td>
                      {t.id ? (
                        <Link to={`/tickets/${t.id}`} className="dots-btn" aria-label={`Open ticket ${t.id}`}>View</Link>
                      ) : (
                        <button aria-label={`Open actions for ticket ${t.id ?? i}`} className="dots-btn">⋯</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default TicketsPage;
