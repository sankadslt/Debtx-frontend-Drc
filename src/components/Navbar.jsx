import { useState, useEffect, useRef } from "react";
import { FaBell, FaCog, FaUser, FaSignOutAlt, FaTasks } from "react-icons/fa";
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
        id: decoded.user_id,
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
      {
        id: 1,
        label: "Profile",
        icon: <FaUser />,
        onClick: () => alert("Profile Clicked"),
      },
      {
        id: 2,
        label: "Settings & Privacy",
        icon: <FaCog />,
        onClick: () => alert("Settings Clicked"),
      },
      {
        id: 3,
        label: "Log Out",
        icon: <FaSignOutAlt />,
        onClick: handleLogout,
      },
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

  const [taskData, setTaskData] = useState([]);
  const [isTaskListOpen, setIsTaskListOpen] = useState(false);
  const [visibleTasks, setVisibleTasks] = useState(10);

  const taskListRef = useRef(null);

  const toggleTaskList = () => setIsTaskListOpen((prev) => !prev);

  // Ensure taskData is fetched correctly before computing pendingTasksCount
  const pendingTasksCount = userData
    ? taskData.filter((task) => task.user_id === userData.id && !task.completed).length
    : 0;

    const markTaskAsDoneAndNavigate = async (id, url) => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }
    
        const response = await fetch(
          `http://localhost:5000/api/taskList/task/${id}`,
          {
            method: "PATCH",
            headers: {
              "Authorization": `Bearer ${token}`, // Ensure the token is included
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              completed: true,
            }),
          }
        );
    
        if (response.ok) {
          setTaskData((prev) =>
            prev.map((task) =>
              task._id === id ? { ...task, completed: true } : task
            )
          );
          navigate(url);
        } else {
          const errorData = await response.json();
          console.error("Failed to update task status:", errorData.message);
        }
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    };
    

  const handleTaskClick = (id, url) => {
    const task = taskData.find((task) => task._id === id);

    if (!task) {
      console.error("Task not found:", id);
      return;
    }

    if (!task.completed) {
      markTaskAsDoneAndNavigate(id, url);
    } else {
      navigate(url);
    }
  };

  const loadMoreTasks = () => {
    setVisibleTasks((prev) => prev + 10);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        const response = await fetch("http://localhost:5000/api/taskList/task", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        const data = await response.json();
        setTaskData(data);
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    };

    fetchTasks();

    const handleClickOutside = (event) => {
      if (
        taskListRef.current &&
        !taskListRef.current.contains(event.target) &&
        !event.target.closest(".task-button")
      ) {
        setIsTaskListOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

        <div className="relative">
          <button
            onClick={toggleTaskList}
            className="task-button bg-teal-700 text-white py-1 px-3 rounded-full flex items-center gap-2"
          >
            <FaTasks />
            <span>{pendingTasksCount}</span>
          </button>

          {isTaskListOpen && (
            <div
              ref={taskListRef}
              className="absolute top-12 right-0 w-[420px] bg-gray-800 text-white rounded-lg shadow-lg p-4"
            >
              <p className="text-lg font-semibold text-center mb-4">
                Task List
              </p>
              <ul
                className="divide-y divide-gray-700 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                onScroll={(e) => {
                  const { scrollTop, scrollHeight, clientHeight } = e.target;
                  if (scrollTop + clientHeight >= scrollHeight) {
                    loadMoreTasks();
                  }
                }}
              >
                {taskData
                  .filter((task) => task.user_id === userData?.id)
                  .slice(0, visibleTasks)
                  .map((task) => (
                    <li
                      key={task._id}
                      className="flex items-center justify-between py-3 px-2 hover:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            task.completed ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        <span>{task.task}</span>
                      </div>
                      <button
                        onClick={() => handleTaskClick(task._id, task.url)}
                        className={`text-xs font-semibold py-1 px-2 rounded-md ${
                          task.completed
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {task.completed ? "Done" : "Mark as Read"}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        <FaCog className="w-6 h-6 text-blue-500 bg-white rounded-full p-1 shadow-md cursor-pointer" />
        <div className="relative" ref={dropdownRef}>
          <div
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white cursor-pointer"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <img
              src={profileImage}
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </div>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-[240px] bg-gray-800 text-white rounded-lg shadow-lg p-4 bg-opacity-90">
              <p className="text-sm font-semibold text-center">
                {currentUser.name}
              </p>
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
