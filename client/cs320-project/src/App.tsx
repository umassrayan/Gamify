import { useAuth } from './context/AuthContext'; // Import the custom hook
// import React from "react";
// import { AnimatePresence, motion } from "framer-motion"; //
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom';

// Import layouts
import PublicAppLayout from './components/LoginRegister';

import './App.css';
import DashboardLayout1 from './components/DashboardLayout1';

const App: React.FC = () => {
    const { currentUser } = useAuth(); // Get the current user from context
    console.log('Current User in App.tsx:', currentUser);

    return (
        <Router>
            {currentUser ? (
                // If user exists (is logged in), show dashboard
                <DashboardLayout1 /> // No need to pass logout manually if using context/firebase directly
            ) : (
                // If no user (logged out), show public layout
                <PublicAppLayout /> // No need to pass login success callback
            )}
        </Router>
    );
};
// import Sidebar from "./components/Sidebar";

// import Calendar from "./components/Calendar";
// import AssignmentBoard from "./components/Assignment";

// import ProgressBar from "./components/ProgressBar";
// import Account from "./components/Account";

// import AccountSettings from "./components/AccountSettings";
// import WeeklyAgenda from "./components/WeeklyAgenda";
// import ToDo from "./components/ToDo";

// import AccountSettings from "./components/AccountSettings";
// import Sidebar from "./components/Sidebar";

// const App: React.FC = () => {
//   return (
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
//   );
// };

// function Main() {
//   const location = useLocation();

//   // If the current URL starts with /todo/, we know a day-specific page is selected
//   const isDayToDo = location.pathname.startsWith("/todo/");

//   // BACKEND/DATABASE TODO: line 57, implement the progression to be by attendance/until finals
//   return (
//     <div style={{ display: "flex" }}>
//       <div>
//         <ProgressBar progress={65} />
//         <Account />
//       </div>
//       <div
//         style={{
//           backgroundColor: "#fff",
//           minHeight: "100vh",
//           padding: "15px",
//           display: "grid",
//         }}
//       >
//         <div style={{ display: "flex", marginTop: "10px" }}>
//           <Calendar />
//           {isDayToDo ? <ToDo /> : <WeeklyAgenda />}
//         </div>
//         <div style={{ marginTop: "-5px" }}>
//           <AssignmentBoard />
//         </div>
//       </div>
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Main />} />
//         <Route path="/todo/:day" element={<Main />} />
//       </Routes>
//     </Router>
//   );
// }

// BACKEND/DATABASE TODO: implement the progression to be by attendance/until finals
//     <Router>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <div style={{ display: "flex" }}>
//               <div>
//                 <ProgressBar progress={65} />
//                 <Account />
//               </div>
//               <div
//                 style={{
//                   fontFamily: "sans-serif",
//                   backgroundColor: "#fff",
//                   minHeight: "100vh",
//                   padding: "15px",
//                   display: "grid",
//                   gap: "10px",
//                 }}
//               >
//                 <Calendar></Calendar>
//                 <AssignmentBoard />
//               </div>
//             </div>
//           }
//         />
//         <Route path="/AccountSettings" element={<AccountSettings />} />
//       </Routes>
//     </Router>
//   );
// };

// const App: React.FC = () => {
//   return (
//     <Router>
//       <div style={{ display: "flex" }}>
//         <Sidebar />
//         <div
//           style={{
//             flex: 1,
//             fontFamily: "sans-serif",
//             backgroundColor: "#ece8e4",
//             minHeight: "100vh",
//             padding: "40px",
//           }}
//         >
//           <Routes>
//             <Route path="/" element={<WelcomePage />} />
//             <Route path="/signin" element={<SignIn />} />
//             <Route path="/signup" element={<SignUp />} />
//             <Route path="/calendar" element={<Calendar />} />
//             <Route path="/assignments" element={<AssignmentBoard />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// };

export default App;
