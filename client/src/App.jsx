import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react"; 
import Login from "./page/login";
import Register from "./page/register";
import { AuthProvider } from "./auth/AuthContex";
import Home from "./page/home";
import AgentProfile from "./page/agentProfile";
import Myproperties from "./page/mypropertiesAgent";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/client/profile" element={<AgentProfile />} />
          <Route path="/agent/profile" element={<AgentProfile />} />
          <Route path="/agent/properties" element={<Myproperties />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
