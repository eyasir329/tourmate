import { Outlet } from "react-router-dom";

function Guest() {
  return (
    <div>
      <p>Guest</p>
      <Outlet />
    </div>
  );
}

export default Guest;
