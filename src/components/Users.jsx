import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    //! this is used to cancel the request and we will do that if the component unmounts so that we can cancel any pending request that is out there if the component unmounts this will be passed as a signal option
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users", {
          signal: controller.signal,
        });

        isMounted && setUsers(response.data);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const baseThTdStyle = {
    textAlign: "left",
    padding: "0.8rem",
    borderBottom: "1px solid #ddd",
  };

  const nameStyle = {
    ...baseThTdStyle,
    color: "#007bff", // Example color for names
  };

  const emailStyle = {
    ...baseThTdStyle,
    color: "#28a745", // Example color for emails
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
    boxShadow: "0 2px 15px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Arial', sans-serif",
  };

  const thTdStyle = {
    textAlign: "left",
    padding: "0.8rem",
    borderBottom: "1px solid #ddd",
    color: "#333",
  };

  const thStyle = {
    ...thTdStyle,
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "1rem",
  };

  const roleBubbleStyle = {
    ...thTdStyle,
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    borderRadius: "1rem",
    backgroundColor: "#28a745",
    color: "white",
    fontSize: "0.75rem",
    textTransform: "uppercase",
  };

  const profilePicStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #007bff",
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "User":
        return "#28a745"; // Green for User
      case "Editor":
        return "#ffc107"; // Yellow for Editor
      case "Admin":
        return "#dc3545"; // Red for Admin
      default:
        return "#6c757d"; // Default gray
    }
  };

  const RoleDropdown = ({ userId, userEmail, currentRole }) => {
    const [role, setRole] = useState(currentRole);
    const [lastChangeTime, setLastChangeTime] = useState(0);

    const ROLES = {
      User: 2001,
      Editor: 1984,
      Admin: 5150,
    };

    const handleChange = async (e) => {
      const newRole = e.target.value;
      const currentTime = Date.now();

      if (currentTime - lastChangeTime >= 3000) {
        // 3000 milliseconds = 3 seconds
        setRole(newRole);
        setLastChangeTime(currentTime);

        try {
          const response = await axiosPrivate.post("/users/changeRole", {
            email: userEmail,
            roleCode: ROLES[newRole],
          });
          
          console.log(response.data.message); // Handle success
        } catch (error) {
          console.error(
            "Error changing role:",
            error.response?.data?.message || error.message
          );
        }
      } else {
        console.log("You can only change roles once every 3 seconds");
      }
    };

    return (
      <select
        value={role}
        onChange={handleChange}
        style={{ padding: "4px 8px", borderRadius: "4px" }}
      >
        <option value="User">User</option>
        <option value="Editor">Editor</option>
        <option value="Admin">Admin</option>
      </select>
    );
  };

  return (
    <article>
      <h2>Users List</h2>
      {users?.length ? (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Profile Picture</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user._id}>
                <td style={nameStyle}>{user?.name}</td>
                <td style={emailStyle}>{user?.email}</td>
                <td style={baseThTdStyle}>
                  <RoleDropdown
                    userId={user._id}
                    userEmail={user.email}
                    currentRole={Object.keys(user.roles)[0]}
                  />
                </td>
                <td style={baseThTdStyle}>
                  <img
                    style={profilePicStyle}
                    src={
                      user?.profilePic
                        ? `http://localhost:8081/${user.profilePic}`
                        : "https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                    }
                    alt={`${user?.name}'s profile`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  );
};

export default Users;
