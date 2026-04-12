import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Reorder } from "framer-motion";
import "./AdminDashboard.css";

import { API_BASE_URL } from "../api.js";

const API = `${API_BASE_URL}/api`;

const AdminDashboard = () => {
  const [token, setToken] = useState(localStorage.getItem("admin_token") || "");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("projects");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // New/Edit Item State (Generic form)
  const [formData, setFormData] = useState({ order_index: 0 });

  const logout = () => {
    setToken("");
    localStorage.removeItem("admin_token");
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API}/${activeTab}`, { headers });
      setItems(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) logout();
    }
    setLoading(false);
  };

  useEffect(() => {
    const verifyAndFetch = async () => {
      if (!token) return;
      try {
        await axios.get(`${API}/verify-token`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchItems();
      } catch (err) {
        if (err.response?.status === 401) logout();
      }
    };
    verifyAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, activeTab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/login`, { password });
      const newToken = res.data.access_token;
      setToken(newToken);
      localStorage.setItem("admin_token", newToken);
    } catch (err) {
      alert("Login failed. Incorrect password.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${activeTab}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (editingId === id) {
        setEditingId(null);
        setFormData({ order_index: items.length });
      }
      fetchItems();
    } catch (err) {
      if (err.response?.status === 401) logout();
      else alert("Failed to delete item.");
    }
  };

  const handleEditInit = (item) => {
    setEditingId(item.id);
    setFormData(item);
    window.document.querySelector('.admin-content').scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/${activeTab}/${editingId}`, formData, {
           headers: { Authorization: `Bearer ${token}` }
        });
        setEditingId(null);
      } else {
        await axios.post(`${API}/${activeTab}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setFormData({ order_index: items.length });
      fetchItems();
    } catch (err) {
      if (err.response?.status === 401) logout();
      else alert("Failed to save item.");
    }
  };

  const handleReorder = async (newOrderList) => {
    setItems(newOrderList);
    try {
      await Promise.all(
        newOrderList.map((item, index) => {
           if (item.order_index !== index) {
              item.order_index = index;
              return axios.patch(`${API}/${activeTab}/${item.id}/order?order_index=${index}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
              });
           }
           return Promise.resolve();
        })
      );
    } catch(err) {
       if (err.response?.status === 401) logout();
       else console.error("Failed to sync order changes");
    }
  };

  if (!token) {
    return (
      <div className="admin-login-container">
        <form className="admin-form" onSubmit={handleLogin}>
          <h2>Admin Login</h2>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="admin-btn primary">Authenticate</button>
          
          <Link to="/" style={{textAlign:'center', marginTop: '10px', color: '#9ca3af', textDecoration: 'none'}}>
            ← Return to Portfolio
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* SIDEBAR NAVIGATION */}
      <aside className="admin-sidebar">
        <h2>Dashboard</h2>
        <div className="admin-tabs">
          <button className={activeTab === "analytics" ? "active" : ""} onClick={() => setActiveTab("analytics")}>Analytics</button>
          <button className={activeTab === "messages" ? "active" : ""} onClick={() => setActiveTab("messages")}>Messages</button>
          <button className={activeTab === "projects" ? "active" : ""} onClick={() => setActiveTab("projects")}>Projects</button>
          <button className={activeTab === "experiences" ? "active" : ""} onClick={() => setActiveTab("experiences")}>Experiences</button>
          <button className={activeTab === "skills" ? "active" : ""} onClick={() => setActiveTab("skills")}>Skills</button>
          <button className={activeTab === "blogs" ? "active" : ""} onClick={() => setActiveTab("blogs")}>Blogs</button>
        </div>
        
        <div className="sidebar-actions">
          <Link to="/" className="admin-btn secondary" style={{justifyContent: 'center'}}>← View Live Site</Link>
          <button className="admin-btn delete" onClick={logout}>Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="admin-content">
        <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
        
        {/* Render Analytics Graph differently */}
        {activeTab === "analytics" && (
           <div className="admin-add-form" style={{display:'block'}}>
              <h4>Page Visits & Interactions</h4>
              {loading ? <p>Loading data...</p> : (
                 <div style={{color: 'var(--text-secondary)'}}>
                   <p>Total Events Logged: {items.length}</p>
                   <p>You can integrate Recharts here using `items` state.</p>
                   {/* Simplified table instead of full Recharts configuration to save space, user can expand later */}
                   <div style={{maxHeight: '400px', overflowY: 'auto', marginTop: '1rem', border: '1px solid var(--glass-border)', borderRadius: '10px'}}>
                     <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
                       <thead style={{background: 'rgba(255,255,255,0.05)'}}>
                         <tr>
                           <th style={{padding: '1rem', borderBottom:'1px solid var(--glass-border)'}}>Type</th>
                           <th style={{padding: '1rem', borderBottom:'1px solid var(--glass-border)'}}>Path</th>
                           <th style={{padding: '1rem', borderBottom:'1px solid var(--glass-border)'}}>Time</th>
                         </tr>
                       </thead>
                       <tbody>
                         {items.map(event => (
                           <tr key={event.id} style={{borderBottom: '1px solid var(--glass-border)'}}>
                             <td style={{padding: '1rem'}}>{event.event_type}</td>
                             <td style={{padding: '1rem'}}>{event.path}</td>
                             <td style={{padding: '1rem'}}>{new Date(event.timestamp).toLocaleString()}</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 </div>
              )}
           </div>
        )}

        {/* Render Messages Inbox differently */}
        {activeTab === "messages" && (
           <div className="admin-add-form" style={{display:'block'}}>
              <h4>Inbox Leads</h4>
              {loading ? <p>Loading data...</p> : (
                 <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                   {items.length === 0 && <p style={{color:'var(--text-muted)'}}>No new messages.</p>}
                   {items.map(msg => (
                     <div key={msg.id} style={{background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '10px', border: '1px solid var(--glass-border)'}}>
                       <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
                         <strong>{msg.name} ({msg.email})</strong>
                         <span style={{fontSize:'0.85rem', color:'var(--primary-accent)'}}>{new Date(msg.created_at).toLocaleString()}</span>
                       </div>
                       {msg.phone && <span style={{fontSize:'0.9rem', color:'var(--text-secondary)', display:'block', marginBottom:'1rem'}}>Phone: {msg.phone}</span>}
                       <p style={{background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', color: 'var(--text-secondary)', margin:0}}>{msg.message}</p>
                       <div style={{marginTop: '1rem', textAlign: 'right'}}>
                         <button className="admin-btn delete" onClick={() => handleDelete(msg.id)} style={{display: 'inline-block', padding: '0.5rem 1rem'}}>Delete</button>
                       </div>
                     </div>
                   ))}
                 </div>
              )}
           </div>
        )}

        {/* The rest of the forms for CRUD */}
        {(activeTab !== "analytics" && activeTab !== "messages") && (
          <>
            <form className="admin-add-form" onSubmit={handleSubmit}>
              <h4>{editingId ? "Edit Existing Item" : "Add New Item"}</h4>
              
              {activeTab === "projects" && (
                <>
                  <input type="text" placeholder="Title" required value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
                  <input type="text" placeholder="Period (e.g. 2024)" required value={formData.period || ""} onChange={e => setFormData({...formData, period: e.target.value})} />
                  <input type="text" placeholder="Description" required value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
                  <input type="text" placeholder="Tech Stack (comma separated)" required value={formData.tech || ""} onChange={e => setFormData({...formData, tech: e.target.value})} />
                  <input type="text" placeholder="Public Image URL (e.g. Imgur link) or Local Path" value={formData.logo || ""} onChange={e => setFormData({...formData, logo: e.target.value})} />
                  <div style={{display:'flex', gap:'1rem'}}>
                    <input type="text" placeholder="GitHub URL" value={formData.github || ""} onChange={e => setFormData({...formData, github: e.target.value})} />
                    <input type="text" placeholder="Live Demo URL" value={formData.live || ""} onChange={e => setFormData({...formData, live: e.target.value})} />
                  </div>
                </>
              )}

              {activeTab === "experiences" && (
                <>
                  <input type="text" placeholder="Role (e.g. Software Engineer)" required value={formData.role || ""} onChange={e => setFormData({...formData, role: e.target.value})} />
                  <input type="text" placeholder="Company Name" required value={formData.company || ""} onChange={e => setFormData({...formData, company: e.target.value})} />
                  <input type="text" placeholder="Period (e.g. Dec 2024 - Present)" required value={formData.period || ""} onChange={e => setFormData({...formData, period: e.target.value})} />
                  <textarea placeholder='Description (Array of strings wrapped in [] for bullet points, e.g. ["Did x", "Did y"])' rows={4} required value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
                </>
              )}

              {activeTab === "skills" && (
                <>
                  <input type="text" placeholder="Category (e.g. Frontend)" required value={formData.category || ""} onChange={e => setFormData({...formData, category: e.target.value})} />
                  <input type="text" placeholder="Items (comma separated, e.g. React, Vue)" required value={formData.items || ""} onChange={e => setFormData({...formData, items: e.target.value})} />
                </>
              )}

              {activeTab === "blogs" && (
                <>
                  <input type="text" placeholder="Title" required value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
                  <input type="text" placeholder="Display Image URL (Optional)" value={formData.image || ""} onChange={e => setFormData({...formData, image: e.target.value})} />
                  <input type="text" placeholder="External URL (e.g. Medium link)" value={formData.external_url || ""} onChange={e => setFormData({...formData, external_url: e.target.value})} />
                  <textarea placeholder="Content (Markdown Supported)" rows={15} required value={formData.content_md || ""} onChange={e => setFormData({...formData, content_md: e.target.value})} style={{fontFamily: 'monospace'}} />
                </>
              )}
              
              <div style={{display: 'flex', gap: '1rem', marginTop: '0.5rem'}}>
                 <button type="submit" className="admin-btn primary" style={{flex: 1}}>{editingId ? "Save Changes" : `Create ${activeTab.slice(0, -1)}`}</button>
                 {editingId && (
                   <button type="button" className="admin-btn secondary" onClick={() => {setEditingId(null); setFormData({ order_index: items.length });}}>Cancel Edit</button>
                 )}
              </div>
            </form>

            {loading ? <p>Loading data...</p> : (
              <div className="admin-list" style={{paddingBottom: '40px'}}>
                 <p style={{fontSize:'0.9rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>
                   * Drag and drop the ☰ icon to reorder items dynamically on the live site.
                 </p>
                 <Reorder.Group axis="y" values={items} onReorder={handleReorder} style={{listStyle: "none"}}>
                  {items.map(item => (
                    <Reorder.Item key={item.id} value={item} style={{marginBottom: '12px'}}>
                      <div className="admin-list-item">
                        <div className="item-details" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                          <div style={{color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'grab', padding: '0 10px'}}>☰</div>
                          <div>
                            <strong>{item.title || item.role || item.category}</strong>
                            <p>{item.company ? `${item.company} | ${item.period}` : (item.period || item.items || (item.published_date ? new Date(item.published_date.endsWith('Z') ? item.published_date : item.published_date + 'Z').toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : ""))}</p>
                          </div>
                        </div>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                          <button className="admin-btn secondary" onClick={() => handleEditInit(item)}>Edit</button>
                          <button className="admin-btn delete" onClick={() => handleDelete(item.id)}>Delete</button>
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
