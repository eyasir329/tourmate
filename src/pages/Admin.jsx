import { Outlet } from "react-router-dom";

function Admin() {
  return (
    <div>
      <p>Admin</p>
      <Outlet />
    </div>
  );
}

export default Admin;