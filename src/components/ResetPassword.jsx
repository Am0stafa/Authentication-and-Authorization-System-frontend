import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../api/axios";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    const token = searchParams.get("token");
    try {
      const response = await axios.post("/users/reset-password", {
        token,
        newPassword,
      });
      if (response.status === 200) {
        setMessage("Password has been reset successfully.");
        setTimeout(() => navigate("/login"), 5000); // Redirect after 5 seconds
      }
    } catch (error) {
      setIsError(true);
      setMessage("Token is invalid or has expired.");
    }
  };

  return (
    <section>
      <h1>Reset Password</h1>
      {message && <p style={{ color: isError ? "red" : "green" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </section>
  );
};

export default ResetPassword;
