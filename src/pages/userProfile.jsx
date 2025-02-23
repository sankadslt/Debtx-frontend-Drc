import { useEffect, useState } from "react";
import { getUserData } from "../services/auth/authService";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4 border rounded-lg shadow-md w-96 mx-auto mt-10">
      <h2 className="text-xl font-bold mb-2">User Profile</h2>
      <p><strong>User ID:</strong> {user?.user_id}</p>
      <p><strong>Username:</strong> {user?.username}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>
      {user?.role === "drc_user" && <p><strong>DRC ID:</strong> {user?.drc_id || "N/A"}</p>}
    </div>
  );
};

export default UserProfile;
