import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
} from "react-icons/fa";
import { usePublicContent } from "../content/usePublicContent.js";
import "./Blogs.css";

const MotionDiv = motion.div;

const Blogs = () => {
  const { blogs } = usePublicContent();
  const [activeBlog, setActiveBlog] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const utcString = isoString.endsWith("Z") ? isoString : `${isoString}Z`;
    return new Date(utcString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPlainText = (markdown = "") =>
    markdown
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[`*_>#-]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const getBlogPreview = (content) => {
    const preview = getPlainText(content);
    return preview.length > 150 ? `${preview.slice(0, 150).trim()}...` : preview;
  };

  const getReadingTime = (content) => {
    const wordCount = getPlainText(content).split(" ").filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 180));
  };

  const itemsPerPage = 3;
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const lastPage = Math.max(totalPages - 1, 0);
  const safeCurrentPage = Math.min(currentPage, lastPage);
  const currentBlogs = blogs.slice(
    safeCurrentPage * itemsPerPage,
    (safeCurrentPage + 1) * itemsPerPage,
  );

  // Auto-advance pages every 5s, pausing on hover or when modal is open
  useEffect(() => {
    if (totalPages <= 1 || isHovered || activeBlog) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 12000);
    return () => clearInterval(interval);
  }, [totalPages, isHovered, activeBlog]);

  useEffect(() => {
    const overflow = activeBlog ? "hidden" : "auto";
    document.body.style.overflow = overflow;
    document.documentElement.style.overflow = overflow;

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, [activeBlog]);

  const openModal = (blog) => {
    setActiveBlog(blog);
  };

  const closeModal = () => {
    setActiveBlog(null);
  };

  const handleCardKeyDown = (event, blog) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    openModal(blog);
  };

  return (
    <section id="blogs" className="blogs-section">
      <div className="blogs-container">
        {/* Header */}
        <MotionDiv
          className="blogs-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>
            DEV <span className="gradient-text">INSIGHTS</span>
          </h2>
          <p className="section-subtext">
            Thoughts, learnings, and technical insights from my perspective
          </p>
        </MotionDiv>

        {/* Grid */}
        <div
          className="blogs-grid"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {currentBlogs.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
              No blogs published yet.
            </p>
          ) : (
            currentBlogs.map((blog, index) => (
              <MotionDiv
                key={blog.id}
                role="button"
                tabIndex={0}
                className="blog-card"
                onClick={() => openModal(blog)}
                onKeyDown={(event) => handleCardKeyDown(event, blog)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="blog-banner">
                  {blog.image ? (
                    <img src={blog.image} alt={blog.title} />
                  ) : (
                    <div className="blog-banner-fallback">Dev Insight</div>
                  )}
                  <span className="blog-image-shade" />
                  <div className="blog-meta-row">
                    <span className="blog-date">
                      <FaCalendarAlt />
                      {formatDate(blog.published_date)}
                    </span>
                    <span className="blog-read-time">
                      <FaClock />
                      {getReadingTime(blog.content_md)} min read
                    </span>
                  </div>
                </div>
                <div className="blog-content">
                  <h3>{blog.title}</h3>
                  <p className="blog-preview-text">
                    {getBlogPreview(blog.content_md)}
                  </p>
                  <span className="read-more">
                    Read Article
                    <FaArrowRight />
                  </span>
                </div>
              </MotionDiv>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="pagination-controls"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              className="read-more"
              style={{
                opacity: safeCurrentPage === 0 ? 0.5 : 1,
                cursor: safeCurrentPage === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                padding: "0.6rem 0",
              }}
              disabled={safeCurrentPage === 0}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            >
              <FaChevronLeft />
            </button>
            <span className="page-indicator">
              Page {safeCurrentPage + 1} of {totalPages}
            </span>
            <button
              className="read-more"
              style={{
                opacity: safeCurrentPage === lastPage ? 0.5 : 1,
                cursor:
                  safeCurrentPage === lastPage ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                padding: "0.6rem 0",
              }}
              disabled={safeCurrentPage === lastPage}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, lastPage))
              }
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
            <MotionDiv
              className="blog-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <div
                className="blog-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-modal-btn" onClick={closeModal}>
                  ×
                </button>

                {activeBlog.image && (
                  <img
                    className="modal-header-img"
                    src={activeBlog.image}
                    alt={activeBlog.title}
                  />
                )}

                <div className="modal-body">
                  <h2>{activeBlog.title}</h2>
                  <span className="modal-date">
                    Published on {formatDate(activeBlog.published_date)}
                  </span>

                  <div className="markdown-wrapper">
                    <ReactMarkdown>{activeBlog.content_md}</ReactMarkdown>
                  </div>

                  {activeBlog.external_url && (
                    <div style={{ marginTop: "3rem", textAlign: "center" }}>
                      <a
                        href={activeBlog.external_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn primary glass-button"
                        style={{ display: "inline-block" }}
                      >
                        Read Original on Medium
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
};

export default Blogs;
