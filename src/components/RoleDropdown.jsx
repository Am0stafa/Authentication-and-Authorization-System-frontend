import React from "react";

const RoleDropdown = ({ currentRole, onChange }) => {
  const [role, setRole] = useState(currentRole);

  const handleChange = (e) => {
    setRole(e.target.value);
    onChange(e.target.value);
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
