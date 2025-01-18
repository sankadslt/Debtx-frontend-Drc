import { useState } from "react";
import { FaBell, FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";
import profileImage from "../assets/images/profile.jpg";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    // Remove tokens and user data from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Optionally, redirect to the login page or refresh the current page
    setMessage("Logged out successfully!");
    navigate("/");
  };

  // Dummy Data
  const userData = {
    name: "Mr. Nishantha Alwis",
    role: "Manager",
    profileOptions: [
      { id: 1, label: "Profile", icon: <FaUser />, onClick: () => alert("Profile Clicked") },
      { id: 2, label: "Settings & Privacy", icon: <FaCog />, onClick: () => alert("Settings Clicked") },
      { id: 3, label: "Log Out", icon: <FaSignOutAlt />, onClick: handleLogout }, // Fixed
    ],
  };

  return (
    <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-md fixed top-0 left-0 w-full z-50 font-poppins">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <img src={logo} alt="DRS SLTMOBITEL Logo" className="h-10 w-full" />
      </div>

      {/* Notification, and Profile */}
      <div className="flex items-center gap-6">
        {/* Notification Icon */}
        <div className="relative">
          <FaBell className="w-6 h-6 text-green-500 bg-white rounded-full p-1 shadow-md cursor-pointer" />
          <div className="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full"></div>
        </div>

        {/* Settings Icon */}
        <FaCog className="w-6 h-6 text-blue-500 bg-white rounded-full p-1 shadow-md cursor-pointer" />

        {/* Profile Picture */}
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white cursor-pointer"
            onClick={toggleDropdown}
          >
            <img src={profileImage} alt="User Profile" className="w-full h-full object-cover" />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-[240px] bg-gray-800 text-white rounded-lg shadow-lg p-4 bg-opacity-90">
              <p className="text-sm font-semibold text-center">{userData.name}</p>
              <p className="text-xs mb-4 text-center">{userData.role}</p>
              <div className="space-y-2">
                {userData.profileOptions.map((option) => (
                  <button
                    key={option.id}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-700"
                    onClick={option.onClick}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
