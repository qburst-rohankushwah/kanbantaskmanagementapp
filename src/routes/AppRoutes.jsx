
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import MyTask from "../pages/MyTask";
import Report from "../pages/Report";
import Setting from "../pages/Setting"; 

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/my-tasks" element={<MyTask />} />
      <Route path="/report" element={<Report />} />
      <Route path="/setting" element={<Setting />} />
    </Routes>
  );
}

export default AppRoutes;