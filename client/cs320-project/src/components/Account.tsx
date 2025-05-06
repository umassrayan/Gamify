import { useEffect, useState } from "react";
import { getUserProfile } from "../api/firestore";

const userId = "hqbb3FUjX6LLjMKAnqb2"; // Hardcoded for now

type AccountProps = {
  onClick: () => void;
};

const Account: React.FC<AccountProps> = ({ onClick }) => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getUserProfile(userId);
        setProfile(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

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
      {profile.name ? profile.name.charAt(0).toUpperCase() : "B"}
    </button>
  );
};

export default Account;
