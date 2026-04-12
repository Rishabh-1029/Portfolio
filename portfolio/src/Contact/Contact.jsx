import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";
import { FaLinkedin, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { API_BASE_URL } from "../api.js";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/messages`, formData);
      alert("Thank You for connecting, Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Something went wrong or hit rate limit. Please try again later.");
    }
    setSubmitting(false);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h2>GET IN TOUCH</h2>
          <p>Feel free to reach out — I’d love to connect.</p>
        </div>

        {/* ICON ROW */}
        <div className="contact-top">
          <a
            href="https://www.linkedin.com/in/rishabh-surana-718582253/"
            target="_blank"
            rel="noreferrer"
            className="contact-link"
          >
            <FaLinkedin />
            <span>LinkedIn</span>
          </a>

          <span className="divider">|</span>

          <a href="mailto:rspsurana@gmail.com" className="contact-link">
            <FaEnvelope />
            <span>rspsurana@gmail.com</span>
          </a>

          <span className="divider">|</span>

          <a href="tel:+918700122543" className="contact-link">
            <FaPhoneAlt />
            <span>+91 8700122543</span>
          </a>
        </div>

        <div className="contact-separator" />

        {/* FORM */}
        <form className="contact-form" onSubmit={sendEmail}>
          <div className="form-row">
            <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />

          <textarea name="message" placeholder="Message" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />

          <button type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send Message"}</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
