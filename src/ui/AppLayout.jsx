import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div>
      <p>AppLayout</p>
      <Outlet />
    </div>
  );
}

export default AppLayout;
