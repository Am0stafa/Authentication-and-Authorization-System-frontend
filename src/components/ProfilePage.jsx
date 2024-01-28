import { useRef, useState } from "react";
import { faUpload, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "../api/axios";

const ProfilePage = () => {
  const imgRef = useRef();
  const navigate = useNavigate();
  const [profileImg, setProfileImg] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [name, setName] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSaveChanges = async () => {
    const formData = new FormData();
    if (name) formData.append('name', name);
    if (profileImg) formData.append('profilePic', profileImg);

    try {
      const response = await axiosPrivate.patch('/users/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMessage(response.data.message);
      setErrorMessage(""); // Clear any previous errors
      // Additional success handling like redirecting or updating UI
    } catch (error) {
      const message = error.response?.data?.message || "An error occurred while updating the profile.";
      setErrorMessage(message);
      setSuccessMessage(""); // Clear any previous success message
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImg("");
      setPreviewSrc("");
    }
  };

  const triggerFileSelectPopup = () => imgRef.current.click();

  const handelUpdatePass = async () => {
    try{
      const response = await axios.post("/users/forgot-password", { email });
    }
    catch (error) {
      console.log(error);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const formStyle = {
    padding: "20px",
    margin: "10px",
  };

  const inputStyle = {
    display: "block",
    margin: "10px 0",
  };

  const labelStyle = {
    fontWeight: "bold",
  };

  const buttonStyle = {
    padding: "10px 20px",
    cursor: "pointer",
  };

  const backButtonStyle = {
    padding: "10px 20px",
    cursor: "pointer",
    backgroundColor: "#f0f0f0", // Light grey background
    color: "#333", // Dark text color
    border: "1px solid #ccc",
    borderRadius: "5px",
    margin: "0 0 20px", // Add some margin to the bottom
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px", // Adjust font size as needed
    fontWeight: "bold",
  };

  const iconStyle = {
    marginRight: "5px", // Space between icon and text
  };

  const passwordResetButtonStyle = {
    ...buttonStyle, // Spread the existing button styles
    backgroundColor: "#4CAF50", // Green background
    color: "white", // White text color
    border: "none",
    borderRadius: "5px",
    margin: "10px 0", // Add some margin
  };

  return (
    <div style={formStyle}>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <button onClick={goBack} style={backButtonStyle}>
        <FontAwesomeIcon icon={faArrowLeft} style={iconStyle} />
        Back
      </button>

      <h2>Edit your profile details.</h2>

      <label style={labelStyle}>Name</label>
      <input
        type="text"
        style={inputStyle}
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label style={labelStyle}>Profile picture</label>
      <input
        type="file"
        ref={imgRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
        accept="image/*"
      />
      <div
        onClick={triggerFileSelectPopup}
        style={{
          height: "80px",
          width: "80px",
          borderRadius: "50%",
          cursor: "pointer",
          border: "2px dashed #cccccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "10px auto",
          overflow: "hidden",
        }}
      >
        {previewSrc ? (
          <img
            src={previewSrc}
            alt="Profile Preview"
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <FontAwesomeIcon
            icon={faUpload}
            style={{ fontSize: "24px", color: "#666666" }}
          />
        )}
      </div>

      <button style={passwordResetButtonStyle} onClick={handelUpdatePass}>
        Send Password Reset Email
      </button>
      <br />
      <button style={buttonStyle} onClick={handleSaveChanges}>Save Changes</button>
    </div>
  );
};

export default ProfilePage;
