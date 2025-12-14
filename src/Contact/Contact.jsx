import React, { useRef } from "react";
import "./Contact.css";
import { FaLinkedin, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const formRef = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          alert("Message sent successfully!");
          formRef.current.reset();
        },
        (error) => {
          console.error(error);
          alert("Something went wrong. Please try again.");
        }
      );
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
        <form ref={formRef} className="contact-form" onSubmit={sendEmail}>
          <div className="form-row">
            <input type="text" name="name" placeholder="Name" required />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            />
          </div>

          <input type="tel" name="phone" placeholder="Phone Number" />

          <textarea name="message" placeholder="Message" required />

          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
