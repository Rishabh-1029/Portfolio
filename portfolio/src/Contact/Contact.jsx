import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./Contact.css";
import {
  FaCheck,
  FaEnvelope,
  FaExclamationTriangle,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
  FaSyncAlt,
  FaSpinner,
} from "react-icons/fa";
import { API_BASE_URL } from "../api.js";

const formatLocationName = (location) => {
  if (!location) {
    return "";
  }

  return [
    ...new Set(
      [location.city, location.region, location.country].filter(Boolean),
    ),
  ].join(", ");
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [visitorLocation, setVisitorLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");

  const updateFormData = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (statusMessage) {
      setStatusMessage(null);
    }
  };

  const openEmailFallback = () => {
    const subject = encodeURIComponent(
      `Portfolio message from ${formData.name}`,
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || "Not provided"}\n\n${formData.message}`,
    );

    window.location.href = `mailto:rspsurana@gmail.com?subject=${subject}&body=${body}`;
  };

  const detectVisitorLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      return;
    }

    setLocationStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const coordinates = {
          latitude: Number(coords.latitude.toFixed(6)),
          longitude: Number(coords.longitude.toFixed(6)),
          accuracy_meters: Math.round(coords.accuracy),
        };

        setVisitorLocation(coordinates);
        setLocationStatus("resolving");
        axios
          .get(`${API_BASE_URL}/api/location/reverse`, {
            params: coordinates,
            timeout: 5000,
          })
          .then(({ data }) => setVisitorLocation({ ...coordinates, ...data }))
          .catch(() => undefined)
          .finally(() => setLocationStatus("ready"));
      },
      () => setLocationStatus("unavailable"),
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 8000 },
    );
  }, []);

  useEffect(() => {
    const detectionTimer = window.setTimeout(detectVisitorLocation, 0);
    return () => window.clearTimeout(detectionTimer);
  }, [detectVisitorLocation]);

  const sendEmail = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage({ type: "sending", text: "Sending your message..." });
    try {
      const visitorTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await axios.post(
        `${API_BASE_URL}/api/messages`,
        {
          ...formData,
          visitor_context: {
            timezone: visitorTimezone || null,
            locale: navigator.language || null,
            location: visitorLocation,
          },
        },
        {
          timeout: 12000,
        },
      );
      setFormData({ name: "", email: "", phone: "", message: "" });
      setStatusMessage({
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: "The message server is taking too long. Opening your email app instead.",
      });
      openEmailFallback();
    }
    setSubmitting(false);
  };

  const detectedLocationName = formatLocationName(visitorLocation);
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h2>
            GET IN <span className="gradient-text">TOUCH</span>
          </h2>
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
          {statusMessage?.type === "success" ? (
            <div className="contact-success" role="status" aria-live="polite">
              <div className="contact-success-icon" aria-hidden="true">
                <FaCheck />
              </div>
              <h3>Thank you !</h3>
              <p>
                Your message has been received, and I'll get back to you soon.
                Until then{" "}
                <span className="contact-success-signoff">
                  Create, Learn, Evolve.
                </span>
              </p>
              <button
                type="button"
                className="contact-reset-button"
                onClick={() => {
                  setStatusMessage(null);
                  detectVisitorLocation();
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <div className="form-row">
                <label className="form-field">
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                  />
                </label>
                <label className="form-field">
                  <span>Email Address</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                  />
                </label>
              </div>

              <label className="form-field">
                <span>Phone Number</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Include country code"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                />
              </label>

              <label className="form-field form-message-field">
                <span>Message</span>
                <textarea
                  name="message"
                  placeholder="Tell me a little about what you have in mind."
                  required
                  value={formData.message}
                  onChange={(e) => updateFormData("message", e.target.value)}
                />
              </label>

              {locationStatus !== "unavailable" && (
                <div
                  className={`contact-location-context ${locationStatus}`}
                  role="status"
                  aria-live="polite"
                >
                  <div className="contact-location-icon" aria-hidden="true">
                    {locationStatus === "requesting" ||
                    locationStatus === "resolving" ? (
                      <FaSpinner />
                    ) : locationStatus === "ready" ? (
                      <FaMapMarkerAlt />
                    ) : (
                      <FaExclamationTriangle />
                    )}
                  </div>
                  <div className="contact-location-copy">
                    <strong>
                      {locationStatus === "requesting" &&
                        "Allow location access"}
                      {locationStatus === "resolving" && "Finding your city"}
                      {locationStatus === "ready" && (
                        <span className="gradient-text contact-location-name">
                          {detectedLocationName || "Location found"}
                        </span>
                      )}
                      {locationStatus === "unavailable" &&
                        "Location unavailable"}
                      {locationStatus === "idle" && "Checking your location"}
                    </strong>
                    <span className="contact-location-meta">
                      {locationStatus === "requesting" &&
                        "Confirm the browser to include your city with this message."}
                      {locationStatus === "resolving" &&
                        "Your city will be added to the message once it is ready."}
                      {locationStatus === "ready" &&
                        "Your location will be included with this message."}
                      {locationStatus === "unavailable" &&
                        "You can still send a message without sharing your location."}
                      {locationStatus === "idle" &&
                        "This helps provide useful context for your message."}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="contact-location-refresh"
                    onClick={detectVisitorLocation}
                    disabled={
                      locationStatus === "requesting" ||
                      locationStatus === "resolving" ||
                      submitting
                    }
                    aria-label="Refresh detected location"
                    title="Refresh detected location"
                  >
                    <FaSyncAlt />
                  </button>
                </div>
              )}
              {statusMessage && (
                <div
                  className={`contact-status ${statusMessage.type}`}
                  role={statusMessage.type === "error" ? "alert" : "status"}
                  aria-live="polite"
                >
                  <span className="contact-status-icon" aria-hidden="true">
                    {statusMessage.type === "sending" ? (
                      <FaPaperPlane />
                    ) : (
                      <FaExclamationTriangle />
                    )}
                  </span>
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <button
                type="submit"
                className="contact-submit"
                disabled={submitting}
              >
                <span>{submitting ? "Sending message" : "Send message"}</span>
                {submitting ? (
                  <FaSpinner
                    className="contact-submit-spinner"
                    aria-hidden="true"
                  />
                ) : (
                  <FaPaperPlane aria-hidden="true" />
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;
