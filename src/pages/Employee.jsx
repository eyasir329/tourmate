import { Outlet } from "react-router-dom";

function Employee() {
  return (
    <div>
      <p>Employee</p>
      <Outlet />
    </div>
  );
}

export default Employee;
