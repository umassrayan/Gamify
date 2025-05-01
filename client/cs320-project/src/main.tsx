import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import ClassPage from "./components/ClassPage"; // Adjust path if needed

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/class/:id" element={<ClassPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
