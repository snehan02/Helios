import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../ticketdetails.css";

const normalize = (t) => {
  const id = t.id ?? t.pk ?? t.ticket_id ?? null;
  return {
    id,
    title: t.title ?? t.name ?? "",
    description: t.description ?? t.desc ?? "",
    district: t.district ?? t.location_district ?? "",
    taluk: t.taluk ?? t.location_taluk ?? "",
    status: t.status ?? t.current_status ?? "Open",
    priority: t.priority ?? t.priority_level ?? "Low",
    assignee: t.assigned_to ?? t.assignedTo ?? t.assigned_name ?? "-",
    reportedAt: t.reportedAt ?? t.reported_at ?? t.date ?? null,
    attachments: t.attachments ?? [],
    activity: t.activity ?? [],
  };
};

function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/tickets/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (mounted) setTicket(normalize(data));
        } else {
          // fall back: if endpoint not ready, show a mocked example close to the design
          if (mounted) setTicket({
            id,
            title: "Water Supply issue in Ward 4",
            description: "The main water pipe in the street has been leaking for the past 3 days. It's causing waterlogging and is a health hazard. Please get it repaired as soon as possible.",
            district: "Shimoga",
            taluk: "Shimoga",
            status: "Progress",
            priority: "High",
            assignee: "Suresh",
            reportedAt: "2025-07-28",
            attachments: [
              "https://via.placeholder.com/320x160?text=Attachment+1",
              "https://via.placeholder.com/320x160?text=Attachment+2",
            ],
            activity: [
              { time: "26-07-2024 10:00AM", text: "Ticket Created", who: "by Suresh" },
              { time: "28-07-2024 10:00AM", text: "Ticket Assigned to Suresh", who: "by District admin" },
              { time: "02-08-2024 10:00AM", text: "Status updated to 'In Progress'", who: "by Suresh" },
            ],
          });
        }
      } catch (e) {
        if (mounted) setTicket({
          id,
          title: "Water Supply issue in Ward 4",
          description: "The main water pipe in the street has been leaking for the past 3 days. It's causing waterlogging and is a health hazard. Please get it repaired as soon as possible.",
          district: "Shimoga",
          taluk: "Shimoga",
          status: "Progress",
          priority: "High",
          assignee: "Suresh",
          reportedAt: "2025-07-28",
          attachments: [],
          activity: [],
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [id]);

  const chip = useMemo(() => ({
    priority: {
      High: "chip chip-priority-high",
      Medium: "chip chip-priority-medium",
      Low: "chip chip-priority-low",
    },
    status: {
      Open: "chip chip-status-open",
      Progress: "chip chip-status-progress",
      Resolved: "chip chip-status-resolved",
    }
  }), []);

  const fmtDate = (d) => {
    if (!d) return "";
    if (/^\d{2}-\d{2}-\d{4}$/.test(d)) return d;
    try {
      const [y,m,dd] = String(d).split("T")[0].split("-");
      return `${dd}-${m}-${y}`;
    } catch { return String(d); }
  };

  return (
    <div className="ticketdetails-container">
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

      <main className="main-content">
        <header className="page-header">
          <h2>{loading ? 'Loading…' : ticket?.title || 'Ticket'}</h2>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div className="breadcrumbs"><Link to="/tickets">← Back to tickets</Link></div>
            <div className="header-icons" style={{marginLeft:12}}>
              <span title="Notifications">🔔</span>
              <Link to="/profile" className="nav-link" title="Profile">👤</Link>
            </div>
          </div>
        </header>

        {!loading && ticket && (
          <div className="details-grid">
            {/* Left column */}
            <section className="card ticket-info">
              <h3>Ticket information</h3>
              <div className="info-row">
                <div><div className="label">Status</div><span className={chip.status[ticket.status] || 'chip'}>{ticket.status === 'Progress' ? 'In progress' : ticket.status}</span></div>
                <div><div className="label">Priority</div><span className={chip.priority[ticket.priority] || 'chip'}>{ticket.priority}</span></div>
              </div>
              <div className="label">Title</div>
              <div className="value">{ticket.title}</div>

              <div className="label">Description</div>
              <p className="value" style={{lineHeight:1.6}}>{ticket.description}</p>

              <div className="grid-2">
                <div>
                  <div className="label">District</div>
                  <div className="value">{ticket.district}</div>
                </div>
                <div>
                  <div className="label">Taluk</div>
                  <div className="value">{ticket.taluk}</div>
                </div>
                <div>
                  <div className="label">Assigned to</div>
                  <div className="value">{ticket.assignee}</div>
                </div>
                <div>
                  <div className="label">Reported At</div>
                  <div className="value">{fmtDate(ticket.reportedAt)}</div>
                </div>
              </div>
            </section>

            <section className="card attachments">
              <h3>Attachments</h3>
              <div className="attachment-strip">
                {(ticket.attachments && ticket.attachments.length ? ticket.attachments : [
                  "https://via.placeholder.com/320x160?text=No+Attachment"
                ]).map((src, idx) => (
                  <img key={idx} src={src} alt={`attachment-${idx+1}`} />
                ))}
              </div>
            </section>

            <section className="card activity-logs">
              <h3>Activity logs</h3>
              <ul className="timeline">
                {(ticket.activity && ticket.activity.length ? ticket.activity : [
                  { time: fmtDate(ticket.reportedAt), text: "Ticket Created", who: "" },
                ]).map((ev, idx) => (
                  <li key={idx}>
                    <div className="dot" />
                    <div>
                      <div className="value">{ev.text}</div>
                      <div className="hint">{ev.time}{ev.who ? ` | ${ev.who}` : ''}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Right column */}
            <aside className="right-rail">
              <div className="card actions">
                <h3>Actions</h3>
                <div className="form">
                  <label className="label">Change status</label>
                  <select defaultValue={ticket.status}>
                    <option>Open</option>
                    <option>Progress</option>
                    <option>Resolved</option>
                  </select>

                  <label className="label">Reassign to</label>
                  <select defaultValue={ticket.assignee}>
                    <option>Suresh</option>
                    <option>Ravi</option>
                    <option>Anita</option>
                  </select>

                  <button className="btn">Update Ticket</button>
                </div>
              </div>

              <div className="card note">
                <h3>Internal Note</h3>
                <textarea placeholder="Add an internal note to the team" rows={4} />
                <button className="btn">Add Note</button>
              </div>

              <div className="card notify">
                <h3>Send Notification</h3>
                <input placeholder="Send message to assigned members" />
                <button className="btn">Send Message</button>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default TicketDetails;
