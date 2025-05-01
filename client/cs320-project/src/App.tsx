import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import WelcomePage from './components/WelcomePage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

// import Calendar from './components/Calendar';
// import AssignmentBoard from './components/Assignment';

// import ProgressBar from './components/ProgressBar';
// import Account from './components/Account';
// import AccountSettings from './components/AccountSettings';
// import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </Router>
            {/* <Calendar></Calendar>
            <AssignmentBoard></AssignmentBoard> */}
        </div>

        // BACKEND/DATABASE TODO: implement the progression to be by attendance/until finals
        // <Router>
        //     <Routes>
        //         <Route
        //             path="/"
        //             element={
        //                 <div style={{ display: 'flex' }}>
        //                     <div>
        //                         <ProgressBar progress={65} />
        //                         <Account />
        //                     </div>
        //                     <div
        //                         style={{
        //                             fontFamily: 'sans-serif',
        //                             backgroundColor: '#fff',
        //                             minHeight: '100vh',
        //                             padding: '15px',
        //                             display: 'grid',
        //                             gap: '10px',
        //                         }}
        //                     >
        //                         <Calendar></Calendar>
        //                         <AssignmentBoard />
        //                     </div>
        //                 </div>
        //             }
        //         />
        //         <Route path="/AccountSettings" element={<AccountSettings />} />
        //     </Routes>
        // </Router>
    );
};
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
