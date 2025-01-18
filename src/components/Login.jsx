import { useState } from "react";
import { loginUser } from "../services/auth/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await loginUser({ email, password }); // Call login API
      const { accessToken, refreshToken, user } = response; // Extract tokens and user data

      // Save the tokens and user data in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // console.log("Access Token:", accessToken);

      setMessage("Login successful!");
      navigate("/dashboard"); // Redirect to the home/dashboard page
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  // const handleLogout = () => {
  //   // Remove tokens and user data from localStorage
  //   localStorage.removeItem("accessToken");
  //   localStorage.removeItem("refreshToken");
  //   localStorage.removeItem("user");

  //   // Optionally, redirect to the login page or refresh the current page
  //   setMessage("Logged out successfully!");
  //   navigate("/");
  // };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg bg-opacity-50">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
      </form>

      {/* <button
        onClick={handleLogout}
        className="mt-4 w-full py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition duration-200"
      >
        Logout
      </button> */}

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
};

export default Login;
