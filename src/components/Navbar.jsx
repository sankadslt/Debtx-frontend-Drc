import { useState, useEffect, useRef } from "react";
import { FaBell, FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";
import profileImage from "../assets/images/profile.jpg";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken, logoutUser } from "../services/auth/authService";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logoutUser();
    setUserData(null);
    navigate("/");
  };

  const loadUser = async () => {
    let token = localStorage.getItem("accessToken");
    if (!token) {
      setUserData(null);
      return;
    }

    try {
      let decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        token = await refreshAccessToken();
        if (!token) return;
        decoded = jwtDecode(token);
      }

      setUserData({
        id: decoded.id,
        name: decoded.username,
        email: decoded.email,
        role: decoded.role,
      });
    } catch (error) {
      console.error("Invalid token:", error);
      handleLogout();
    }
  };

  useEffect(() => {
    loadUser();
  }, [localStorage.getItem("accessToken")]);

  const defaultUser = {
    name: "Guest",
    role: "Visitor",
    profileOptions: [
      { id: 1, label: "Profile", icon: <FaUser />, onClick: () => alert("Profile Clicked") },
      { id: 2, label: "Settings & Privacy", icon: <FaCog />, onClick: () => alert("Settings Clicked") },
      { id: 3, label: "Log Out", icon: <FaSignOutAlt />, onClick: handleLogout },
    ],
  };

  const currentUser = userData || defaultUser;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-md fixed top-0 left-0 w-full z-50 font-poppins">
      <div className="flex items-center gap-4">
        <img src={logo} alt="Logo" className="h-10 w-full" />
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <FaBell className="w-6 h-6 text-green-500 bg-white rounded-full p-1 shadow-md cursor-pointer" />
          <div className="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full"></div>
        </div>
        <FaCog className="w-6 h-6 text-blue-500 bg-white rounded-full p-1 shadow-md cursor-pointer" />
        <div className="relative" ref={dropdownRef}>
          <div
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white cursor-pointer"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <img src={profileImage} alt="User Profile" className="w-full h-full object-cover" />
          </div>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-[240px] bg-gray-800 text-white rounded-lg shadow-lg p-4 bg-opacity-90">
              <p className="text-sm font-semibold text-center">{currentUser.name}</p>
              <p className="text-xs mb-4 text-center">{currentUser.role}</p>
              <div className="space-y-2">
                {defaultUser.profileOptions.map((option) => (
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