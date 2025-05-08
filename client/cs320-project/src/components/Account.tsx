import { useEffect, useState } from "react";
import { getUserProfile } from "../api/firestore";
import { useAuth } from "../context/AuthContext";

type AccountProps = {
  onClick: () => void;
};

const Account: React.FC<AccountProps> = ({ onClick }) => {
  const { currentUser, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!currentUser) return;
      try {
        const data = await getUserProfile(currentUser.uid);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    fetchProfile();
  }, [currentUser]);

  if (loading || !currentUser) return null;
  if (!profile) return <div style={{ marginLeft: "25px" }}>Loading...</div>;

  return (
    <button
      onClick={onClick}
      style={{
        width: "7vh",
        height: "7vh",
        border: "none",
        borderRadius: "50%",
        backgroundColor: "#6D5A4F",
        color: "white",
        textAlign: "center",
        marginLeft: "25px",
        marginTop: "30px",
        cursor: "pointer",
        fontSize: "40px",
      }}
    >
      {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
    </button>
  );
};

export default Account;

