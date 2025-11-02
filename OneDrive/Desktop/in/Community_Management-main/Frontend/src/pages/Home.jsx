import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../auth";
import "../home.css";

function Home() {
  const navigate = useNavigate();
  const handleLogout = () => { clearAuth(); navigate('/login'); };
  const FEED = [
    {
      id: 1,
      user: "Suresh.S",
      role: "District Head",
      time: "2 hours ago",
      title: "Community Clean-Up Drive Success!",
      text:
        "A big thank you to everyone who participated in our community clean-up drive this past weekend. We collected over 50 bags of trash and made our public shine!",
      image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
      stats: { likes: "1.2k", comments: 320, shares: 124, saves: 2 },
    },
    {
      id: 2,
      user: "Ram",
      role: "Taluk Head",
      time: "9 hours ago",
      title: "New Government Scheme for Small Businesses",
      text:
        "Excited to announce a new financial assistance program aimed at supporting local entrepreneurs. Learn more about the eligibility criteria and application process.",
      image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
      stats: { likes: "3.4k", comments: 600, shares: 204, saves: 39 },
    },
  ];

  return (
    <div className="home-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Ⓒ CIVIC HUB</h2>
        <nav>
          <ul>
            <li className="active"><Link to="/home" className="nav-link">🏠 Home</Link></li>
            <li><Link to="/dashboard" className="nav-link">📊 Dashboard</Link></li>
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
        <div className="topbar">
          <div className="spacer" />
          <div className="header-actions">
            <div className="header-icons">
              <span title="Notifications">🔔</span>
              <Link to="/profile" className="nav-link" title="Profile">👤</Link>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="content-grid">
          {/* Left Column */}
          <section className="left-col">
            {/* Start a Post */}
            <div className="start-post card">
              <div className="start-post-input">
                <span className="avatar">👤</span>
                <input placeholder="Start a Post...." />
              </div>
              <div className="start-post-actions">
                <div className="media-icons">
                  <span title="Photo">📷</span>
                  <span title="Video">🎥</span>
                  <span title="Poll">📊</span>
                </div>
                <button className="btn-post">Post</button>
              </div>
            </div>

            {/* Feed */}
            {FEED.map((p) => (
              <article key={p.id} className="post card">
                <header className="post-header">
                  <div className="user-avatar">👤</div>
                  <div className="user-meta">
                    <div className="name-role">
                      <strong>{p.user}</strong>
                      <span className="role">{p.role}</span>
                      <span className="dot">•</span>
                      <span className="time">{p.time}</span>
                    </div>
                  </div>
                </header>
                <h3 className="post-title">{p.title}</h3>
                <p className="post-text">{p.text}</p>
                <img src={p.image} alt="post" className="post-image" />
                <footer className="post-actions">
                  <div className="metric">👍 {p.stats.likes}</div>
                  <div className="metric">💬 {p.stats.comments}</div>
                  <div className="metric">🔁 {p.stats.shares}</div>
                  <div className="metric">🔖 {p.stats.saves}</div>
                </footer>
              </article>
            ))}
          </section>

          {/* Right Column */}
          <aside className="right-col">
            <div className="card right-card">
              <h4>Top News</h4>
              <div className="placeholder" />
            </div>
            <div className="card right-card">
              <div className="placeholder" style={{height: 320}} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Home;
