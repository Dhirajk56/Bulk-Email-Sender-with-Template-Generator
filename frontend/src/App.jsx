import React from "react";
import { Routes, Route } from "react-router-dom";
import Send from "./pages/Send.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./component/Navbar.jsx";
import GenerateEmail from "./pages/GenerateEmail.jsx";
import GeneratedEmail from "./pages/GeneratedEmail.jsx";
const App = () => {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/send" element={<Send />} />
        <Route path="/generate-email" element={<GenerateEmail />} />
        <Route path="/generate-email/:data" element={<GeneratedEmail />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
};

export default App;
