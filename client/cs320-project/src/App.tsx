import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import WelcomePage from "./components/WelcomePage";
// import SignIn from "./components/SignIn";
// import SignUp from "./components/SignUp";

import Calendar from "./components/Calendar";
import AssignmentBoard from "./components/Assignment";

import ProgressBar from "./components/ProgressBar";
import Account from "./components/Account";
import AccountSettings from "./components/AccountSettings";

const App: React.FC = () => {
  return (
    // <div>
    //   <Router>
    //     <Routes>
    //       <Route path="/" element={<WelcomePage />} />
    //       <Route path="/signin" element={<SignIn />} />
    //       <Route path="/signup" element={<SignUp />} />
    //     </Routes>
    //   </Router>
    //   <Calendar></Calendar>
    //   <AssignmentBoard></AssignmentBoard>
    // </div>

    // BACKEND/DATABASE TODO: implement the progression to be by attendance/until finals
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ display: "flex" }}>
              <div>
                <ProgressBar progress={65} />
                <Account />
              </div>
              <div
                style={{
                  fontFamily: "sans-serif",
                  backgroundColor: "#fff",
                  minHeight: "100vh",
                  padding: "15px",
                  display: "grid",
                  gap: "10px",
                }}
              >
                <Calendar></Calendar>
                <AssignmentBoard />
              </div>
            </div>
          }
        />
        <Route path="/AccountSettings" element={<AccountSettings />} />
      </Routes>
    </Router>
  );
};

export default App;
