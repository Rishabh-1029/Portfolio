import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { API_BASE_URL } from "../api.js";
import "./Blogs.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [activeBlog, setActiveBlog] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const utcString = isoString.endsWith("Z") ? isoString : `${isoString}Z`;
    return new Date(utcString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const itemsPerPage = 3;
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const currentBlogs = blogs.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // Auto-advance pages every 5s, pausing on hover or when modal is open
  useEffect(() => {
    if (totalPages <= 1 || isHovered || activeBlog) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 12000);
    return () => clearInterval(interval);
  }, [totalPages, isHovered, activeBlog]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/blogs`);
        setBlogs(res.data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const openModal = (blog) => {
    setActiveBlog(blog);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  };

  const closeModal = () => {
    setActiveBlog(null);
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  };

  return (
    <section id="blogs" className="blogs-section">
      <div className="blogs-container">
        
        {/* Header */}
        <motion.div 
          className="blogs-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>DEV <span className="gradient-text">INSIGHTS</span></h2>
          <p className="section-subtext">
            Deep dives into <strong>elegant architecture</strong>, robust systems, and the relentless pursuit of <strong>clean code</strong>.
          </p>
        </motion.div>

        {/* Grid */}
        <div 
          className="blogs-grid"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isLoading ? (
             Array.from({ length: 3 }).map((_, idx) => (
               <div key={idx} className="blog-card glass-card">
                 <div className="skeleton skeleton-img" style={{borderBottomLeftRadius: 0, borderBottomRightRadius: 0, height: '180px'}}></div>
                 <div className="blog-content">
                   <div className="skeleton skeleton-text short" style={{width: '30%', marginBottom: '1rem'}}></div>
                   <div className="skeleton skeleton-title"></div>
                   <div className="skeleton skeleton-text"></div>
                   <div className="skeleton skeleton-text"></div>
                   <div className="skeleton skeleton-badge" style={{marginTop: '1.5rem', width: '120px'}}></div>
                 </div>
               </div>
             ))
          ) : currentBlogs.length === 0 ? (
             <p style={{textAlign:'center', color:'var(--text-muted)'}}>No blogs published yet.</p>
          ) : (
            currentBlogs.map((blog, index) => (
              <motion.div 
                key={blog.id} 
                className="blog-card"
                onClick={() => openModal(blog)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {blog.image && (
                  <div className="blog-banner">
                    <img src={blog.image} alt={blog.title} />
                  </div>
                )}
                <div className="blog-content">
                  <span className="blog-date">{formatDate(blog.published_date)}</span>
                  <h3>{blog.title}</h3>
                  <div className="blog-preview-text">
                    <ReactMarkdown>{blog.content_md.substring(0, 150) + "..."}</ReactMarkdown>
                  </div>
                  <button className="read-more">Read Article</button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-controls"
               onMouseEnter={() => setIsHovered(true)}
               onMouseLeave={() => setIsHovered(false)}>
            <button 
              className="read-more" 
              style={{
                opacity: currentPage === 0 ? 0.5 : 1, 
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', padding: '0.6rem 0'
              }}
              disabled={currentPage === 0} 
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <FaChevronLeft />
            </button>
            <span className="page-indicator">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button 
              className="read-more" 
              style={{
                opacity: currentPage === totalPages - 1 ? 0.5 : 1, 
                cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', padding: '0.6rem 0'
              }}
              disabled={currentPage === totalPages - 1} 
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {createPortal(
        <AnimatePresence>
          {activeBlog && (
            <motion.div 
              className="blog-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <div className="blog-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-modal-btn" onClick={closeModal}>×</button>
                
                {activeBlog.image && (
                  <img className="modal-header-img" src={activeBlog.image} alt={activeBlog.title} />
                )}
                
                <div className="modal-body">
                  <h2>{activeBlog.title}</h2>
                  <span className="modal-date">Published on {formatDate(activeBlog.published_date)}</span>
                  
                  <div className="markdown-wrapper">
                    <ReactMarkdown>{activeBlog.content_md}</ReactMarkdown>
                  </div>
                  
                  {activeBlog.external_url && (
                     <div style={{marginTop: '3rem', textAlign: 'center'}}>
                       <a href={activeBlog.external_url} target="_blank" rel="noreferrer" className="btn primary glass-button" style={{display: 'inline-block'}}>
                         Read Original on Medium
                       </a>
                     </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

export default Blogs;
