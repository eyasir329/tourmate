import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import GlobalStyles from "./styles/GlobalStyles";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Manager from "./pages/Manager";
import Employee from "./pages/Employee";
import Guest from "./pages/Guest";
import Users from "./pages/Users";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import Settings from "./pages/Settings";
import PageNotFound from "./pages/PageNotFound";
import SignUp from "./pages/SignUp";
import AppLayout from "./ui/AppLayout";
import CreateHotel from "./pages/CreateHotel";
import DeleteHotel from "./pages/DeleteHotel";
import CreateEmployee from "./pages/CreateEmployee";
import DeleteEmployee from "./pages/DeleteEmployee";
import History from "./pages/History";

function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          {/* main app */}
          <Route path="/app" element={<AppLayout />}>
            {/* admin */}
            <Route path="admin" element={<Admin />}>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="account" element={<Account />} />
              <Route path="create_hotel" element={<CreateHotel />} />
              <Route path="delete_hotel" element={<DeleteHotel />} />
              <Route path="*" element={<PageNotFound />} />{" "}
            </Route>
            {/* manager */}
            <Route path="manager" element={<Manager />}>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="account" element={<Account />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="cabins" element={<Cabins />} />
              <Route path="settings" element={<Settings />} />
              <Route path="create_employee" element={<CreateEmployee />} />
              <Route path="delete_employee" element={<DeleteEmployee />} />
              <Route path="history" element={<History />} />
              <Route path="*" element={<PageNotFound />} />{" "}
            </Route>
            {/* employee */}
            <Route path="employee" element={<Employee />}>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="account" element={<Account />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="cabins" element={<Cabins />} />
              <Route path="*" element={<PageNotFound />} />{" "}
            </Route>
            {/* guest */}
            <Route path="guest" element={<Guest />}>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="account" element={<Account />} />
              <Route path="*" element={<PageNotFound />} />{" "}
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
