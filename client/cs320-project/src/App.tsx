import { useAuth } from "./context/AuthContext"; // Import the custom hook

// Import layouts
import PublicAppLayout from "./components/LoginRegister";

import "./App.css";
import DashboardLayout from "./components/Dashboard";

const App: React.FC = () => {
  const { currentUser } = useAuth(); // Access currentUser from context

  // If the user is logged in, show the Dashboard layout
  if (currentUser) {
    return <DashboardLayout />;
  }

  // If no user (logged out), show public login/sign-up pages
  return <PublicAppLayout />;
};

export default App;
