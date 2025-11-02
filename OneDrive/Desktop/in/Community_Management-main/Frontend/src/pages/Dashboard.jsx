import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../auth";
import "../dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const BACKEND_ENABLED = (import.meta.env.VITE_BACKEND_ENABLED || 'false') === 'true';
  const FALLBACK = { members: 1234, activeTickets: 56, fundraisers: 3, posts: 758 };
  const [stats, setStats] = useState(FALLBACK);
  const [loading, setLoading] = useState(BACKEND_ENABLED);

  useEffect(() => {
    if (!BACKEND_ENABLED) return; // use fallback without fetching (avoid proxy errors)
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          if (mounted) setStats({
            members: data.members ?? FALLBACK.members,
            activeTickets: data.activeTickets ?? data.tickets_active ?? FALLBACK.activeTickets,
            fundraisers: data.ongoingFundraisers ?? data.fundraisers ?? FALLBACK.fundraisers,
            posts: data.postsPublished ?? data.posts ?? FALLBACK.posts,
          });
        }
      } catch (e) {
        // keep FALLBACK
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [BACKEND_ENABLED]);

  const modules = useMemo(() => ([
    { key: 'members', title: 'Members', desc: 'View and manage all community members.', to: '/members' },
    { key: 'tickets', title: 'Tickets', desc: 'Track and resolve support tickets.', to: '/tickets' },
    { key: 'events', title: 'Events', desc: 'Details of all upcoming events.', to: '#' },
    { key: 'analytics', title: 'Analytics', desc: 'Analyze community engagement and growth.', to: '#' },
    { key: 'fundraising', title: 'Fundraising', desc: 'Manage fundraising campaigns.', to: '/fundraising' },
    { key: 'post', title: 'Post', desc: 'Create and Schedule new post.', to: '#' },
    { key: 'notice', title: 'Notice Board', desc: 'Share important announcements.', to: '#' },
  ]), []);

  return (
    <div className="dashboard-container">
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
          <h2>Dashboard</h2>
          <div className="header-actions">
            <div className="header-icons">
              <span title="Notifications">🔔</span>
              <span title="Profile">
                <Link to="/profile" className="nav-link">👤</Link>
              </span>
            </div>
            <button className="create-btn" onClick={()=>{ clearAuth(); navigate('/login'); }}>Logout</button>
          </div>
        </header>

        {/* Stat cards */}
        <div className="stats">
          <div className="stat-card">
            <p>Total Members</p>
            <h3>{loading ? '—' : stats.members}</h3>
          </div>
          <div className="stat-card">
            <p>Active Tickets</p>
            <h3>{loading ? '—' : stats.activeTickets}</h3>
          </div>
          <div className="stat-card">
            <p>Ongoing Fundraisers</p>
            <h3>{loading ? '—' : stats.fundraisers}</h3>
          </div>
          <div className="stat-card">
            <p>Post Published</p>
            <h3>{loading ? '—' : stats.posts}</h3>
          </div>

          <button className="create-btn" style={{justifySelf:'end'}}>+ Create New Post</button>
        </div>

        {/* Modules grid */}
        <section className="modules-grid">
          {modules.map(m => (
            m.to && m.to !== '#' ? (
              <Link to={m.to} key={m.key} className="module-card link">
                <div className="module-title">{m.title}</div>
                <div className="module-desc">{m.desc}</div>
              </Link>
            ) : (
              <div key={m.key} className="module-card">
                <div className="module-title">{m.title}</div>
                <div className="module-desc">{m.desc}</div>
              </div>
            )
          ))}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
