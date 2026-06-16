import React, { useState } from "react";
import styles from "./Contact.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../services/servicedashboard";
export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace with your API endpoint
      await axios.post(`${import.meta.env.VITE_API_URL}/api/jobsadd/queries`, formData);

      toast.success("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (<>
     <Navbar></Navbar>
  
    <div className={styles.contactContainer}>
      <div className={styles.contactCard}>
        <div className={styles.left}>
            
          <h1>Contact Us</h1>
          <p>
            Have questions, suggestions, or need assistance? We'd love to hear
            from you.
          </p>

          <div className={styles.info}>
            <p>📧 support@accessibilityportal.com</p>
            <p>📞 +91 1234567890</p>
            <p>📍 Chennai, Tamil Nadu, India</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            rows="6"
            placeholder="Write your message..."
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
    </>
  );
}