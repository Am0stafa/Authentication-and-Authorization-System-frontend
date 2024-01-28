import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    try {
      const response = await axios.post("/users/forgot-password", { email });
      if (response.status === 200) {
        setMessage("Email sent. Please check your inbox for the reset link.");
        setTimeout(() => navigate("/login"), 7000);
      }
    } catch (error) {
      setIsError(true);
      setMessage("Error occurred. Please try again later.");
    }
  };

  return (
    <section>
      <h1>Forgot Password</h1>
      {message && <p style={{ color: isError ? "red" : "green" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </section>
  );
};

export default ForgotPassword;
