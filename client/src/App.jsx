import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react"; 
import Login from "./page/login";
import Register from "./page/register";
import { AuthProvider } from "./auth/AuthContex";
import Home from "./page/home";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
