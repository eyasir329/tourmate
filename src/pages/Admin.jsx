import { Outlet } from "react-router-dom";

function Admin() {
  return (
    <div>
      <p>Admin testing</p>
      <Outlet />
    </div>
  );
}

export default Admin;
