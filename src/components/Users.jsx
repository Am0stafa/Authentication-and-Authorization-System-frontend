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
        console.log(response.data);

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

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  };

  const thTdStyle = {
    textAlign: "left",
    padding: "0.5rem",
    borderBottom: "1px solid #ddd",
  };

  const thStyle = {
    backgroundColor: "#f4f4f4",
  };

  const roleBubbleStyle = {
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    borderRadius: "1rem",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "0.75rem",
    textTransform: "capitalize",
  };

  const profilePicStyle = {
    width: "50px", // Adjust size as needed
    height: "50px", // Adjust size as needed
    borderRadius: "50%", // This makes the image circular
    objectFit: "cover", // This ensures the image covers the area without distortion
  };

  return (
    <article>
      <h2>Users List</h2>
      {users?.length ? (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Profile Picture</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i}>
                <td>{user?.name}</td>
                <td>{user?.email}</td>
                <td>
                  <span className="role-bubble">
                    {Object.keys(user?.roles)[0]}
                  </span>
                </td>
                <td>
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
