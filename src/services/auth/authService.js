import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL; // Base URL from environment variables
const AUTH_URL = `${BASE_URL}/auth`; // Auth endpoint

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_URL}/register`, userData);
    return response.data; // Return the success message or data
  } catch (error) {
    console.error("Error registering user:", error.response?.data || error.message);
    throw error.response?.data || error; // Throw detailed error if available
  }
};

// Login a user
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      `${AUTH_URL}/login`, 
      userData, 
      { withCredentials: true } // Ensure cookies are sent/received
    );
    return response.data; // Return the server's response (e.g., JWT or user data)
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    throw error.response?.data || error; // Throw detailed error if available
  }
};

// Refresh access token
export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${AUTH_URL}/refresh-token`, 
      {}, 
      { withCredentials: true } // Include cookies for refresh request
    );
    const { accessToken } = response.data;

    // Log the new access token
    console.log("New Access Token:", accessToken);

    // Save the new access token to localStorage
    localStorage.setItem("accessToken", accessToken);

    return accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error.response?.data || error.message);
    throw error.response?.data || error; // Throw detailed error if available
  }
};

// Logout a user
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${AUTH_URL}/logout`, {}, { withCredentials: true });
    console.log(response.data.message); // Log the logout success message

    // Clear localStorage tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    return response.data;
  } catch (error) {
    console.error("Error logging out:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
