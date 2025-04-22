// import Calendar from "./components/Calendar";
import WelcomePage from "./components/WelcomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {
  return (
    // <div>
    //   <Calendar></Calendar>
    // </div>
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
