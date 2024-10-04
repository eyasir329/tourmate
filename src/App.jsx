import { BrowserRouter, Route, Routes } from "react-router-dom";

import GlobalStyles from "./styles/GlobalStyles";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Managers from "./pages/Managers";
import Employees from "./pages/Employees";
import Guests from "./pages/Guests";
import Users from "./pages/Users";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import Settings from "./pages/Settings";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/managers" element={<Managers />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/users" element={<Users />} />
          <Route path="/account" element={<Account />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/cabins" element={<Cabins />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
