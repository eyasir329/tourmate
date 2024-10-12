import { Outlet } from "react-router-dom";

function Manager() {
  return (
    <div>
      <p>Manager</p>
      <Outlet />
    </div>
  );
}

export default Manager;
