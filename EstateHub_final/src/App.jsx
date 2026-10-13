import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import MyProperties from "./myproperities";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Addpost from "./pages/addpost";
import UserDashboard from "./pages/UserDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Favorites from "./pages/fav";

// Admin pages
import AdminUsers from "./pages/AdminUsers";
import AdminPosts from "./pages/AdminPosts";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/:id" element={<PropertyDetails />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard/user" element={<UserDashboard />} />
      <Route path="/dashboard/agent" element={<AgentDashboard />} />
      <Route path="/dashboard/admin" element={<AdminDashboard />} />

      <Route path="/dashboard/admin/users" element={<AdminUsers />} />
      <Route path="/dashboard/admin/posts" element={<AdminPosts />} />

      <Route path="/dashboard/agent/Addpost" element={<Addpost />} />
      <Route path="/dashboard/agent/properties" element={<MyProperties />} />

      <Route path="*" element={<Home />} />
    </Routes>
  );
}
