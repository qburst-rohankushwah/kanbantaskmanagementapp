
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      {/* <Route path="/login" element={<Login />} /> */}
    </Routes>
  );
}

export default AppRoutes;