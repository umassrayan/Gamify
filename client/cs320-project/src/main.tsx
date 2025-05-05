// // src/main.tsx (or index.tsx)
// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import App from "./App";
// import ClassPage from "./components/ClassPage";
// import { AuthProvider } from "./context/AuthContext"; // Import the provider
// import "bootstrap/dist/css/bootstrap.css";
// import SignIn from "./components/SignIn";
// import SignUp from "./components/SignUp";
// import WelcomePage from "./components/WelcomePage";

// const root = ReactDOM.createRoot(document.getElementById("root")!);
// root.render(
//   <React.StrictMode>
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<App />} />
//           <Route path="/class/:id" element={<ClassPage />} />
//           <Route
//             path="/signup"
//             // Pass props directly if needed, or SignUp can use context/navigate itself
//             element={<SignUp />}
//           />
//           <Route path="/signin" element={<SignIn />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
