import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Home = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const [user, setUser] = useState("");

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  // Add this function to handle redirection to the profile page
  const goToProfile = () => {
    navigate("/profile");
  };


  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axiosPrivate.get("/users/me");
        setUser(data);
        // console.log(user);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [axiosPrivate]);

  // Inline CSS for the circular image
  const userProfileStyle = {
    width: '50px', // Adjust size as needed
    height: '50px', // Adjust size as needed
    borderRadius: '50%', // This makes the image circular
    objectFit: 'cover', // This ensures the image covers the area without distortion
    cursor: 'pointer', // Changes the cursor to indicate it's clickable
    border: '2px solid white', // Optional: adds a border around the image
    position: 'absolute', // Adjust positioning as needed
    top: '10px', // Adjust positioning as needed
    right: '10px', // Adjust positioning as needed
  };


  return (
    <section style={{ position: 'relative' }}> {/* Add relative positioning to the section */}
      <Link to="/profile" onClick={goToProfile} style={{ textDecoration: 'none' }}>
        <img
          src={user.profilePic}
          alt="User"
          style={userProfileStyle}
        />
      </Link>
      <h1>Home</h1>
      <br />
      <p>You are logged in!</p>
      <br />
      <Link to="/editor">Go to the Editor page</Link>
      <br />
      <Link to="/admin">Go to the Admin page</Link>
      <br />
      <Link to="/lounge">Go to the Users page</Link>
      <br />
      <Link to="/linkpage">Go to the link page</Link>
      <div className="flexGrow">
        <button onClick={signOut}>Sign Out</button>
      </div>
    </section>
  );
};

export default Home;
