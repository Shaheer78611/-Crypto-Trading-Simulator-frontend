import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Home/Login.jsx";
import Home from "./pages/Home/Home.jsx";

export default function App() {
  return (
    
    <Router>
      <Routes>
      
        <Route path="/" element={<Login />} />         {/* default login */}
        <Route path="/login" element={<Login />} />   {/* also works with /login */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

