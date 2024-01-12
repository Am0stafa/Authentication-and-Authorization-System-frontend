import React from 'react';

const ProfilePage = () => {
  const formStyle = {
    padding: '20px',
    margin: '10px',
    // Add other styles as needed
  };

  const inputStyle = {
    display: 'block',
    margin: '10px 0',
    // Add other styles as needed
  };

  const labelStyle = {
    fontWeight: 'bold',
    // Add other styles as needed
  };

  const buttonStyle = {
    padding: '10px 20px',
    cursor: 'pointer',
    // Add other styles as needed
  };

  return (
    <div style={formStyle}>
      <h2>Edit your profile details.</h2>
      <label style={labelStyle}>Email</label>
      <input type="email" style={inputStyle} placeholder="Enter your email" />

      <label style={labelStyle}>Name</label>
      <input type="text" style={inputStyle} placeholder="Enter your name" />

      <label style={labelStyle}>Profile Picture</label>
      <input type="file" style={inputStyle} />

      <label style={labelStyle}>New Password</label>
      <input type="password" style={inputStyle} placeholder="Enter new password" />

      <label style={labelStyle}>Confirm New Password</label>
      <input type="password" style={inputStyle} placeholder="Confirm new password" />

      <button style={buttonStyle}>Save Changes</button>
    </div>
  );
};

export default ProfilePage;
