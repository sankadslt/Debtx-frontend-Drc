import { useState, useEffect, useRef } from "react";
import { FaBell, FaCog, FaUser, FaSignOutAlt, FaTasks } from "react-icons/fa";
import profileImage from "../assets/images/profile.jpg";
import logo from "../assets/images/logo.png";

const Navbar = () => {
  const userData = {
    name: "Mr. Nishantha Alwis",
    role: "Manager",
    profileOptions: [
      { id: 1, label: "Profile", icon: <FaUser />, onClick: () => alert("Profile Clicked") },
      { id: 2, label: "Settings & Privacy", icon: <FaCog />, onClick: () => alert("Settings Clicked") },
      { id: 3, label: "Log Out", icon: <FaSignOutAlt />, onClick: () => alert("Log Out Clicked") },
    ],
  };

  const [taskData, setTaskData] = useState([
    { id: 1, task: "Approve pending requests", completed: false },
    { id: 2, task: "Review monthly report", completed: true },
    { id: 3, task: "Schedule team meeting", completed: false },
    { id: 4, task: "Update project roadmap", completed: false },
    { id: 5, task: "Prepare performance reviews", completed: false },
    { id: 6, task: "Organize workshop", completed: false },
    { id: 7, task: "Plan budget meeting", completed: false },
    { id: 8, task: "Check compliance report", completed: false },
    { id: 9, task: "Arrange client presentation", completed: false },
    { id: 10, task: "Prepare quarterly report", completed: false },
    { id: 11, task: "Submit project closure", completed: false },
    { id: 12, task: "Plan training session", completed: false },
  ]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTaskListOpen, setIsTaskListOpen] = useState(false);
  const [visibleTasks, setVisibleTasks] = useState(10);

  const taskListRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleTaskList = () => {
    setIsTaskListOpen((prev) => !prev);
  };

  const pendingTasksCount = taskData.filter((task) => !task.completed).length;

  const markTaskAsDone = (id) => {
    setTaskData((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: true } : task))
    );
  };

  const loadMoreTasks = () => {
    setVisibleTasks((prev) => prev + 10);
  };

  useEffect(() => {
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
        <img src={logo} alt="DRS SLTMOBITEL Logo" className="h-10 w-full" />
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
              <p className="text-lg font-semibold text-center mb-4">Task List</p>
              <ul
                className="divide-y divide-gray-700 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                onScroll={(e) => {
                  const { scrollTop, scrollHeight, clientHeight } = e.target;
                  if (scrollTop + clientHeight >= scrollHeight) {
                    loadMoreTasks();
                  }
                }}
              >
                {taskData.slice(0, visibleTasks).map((task) => (
                  <li
                    key={task.id}
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
                    {task.completed ? (
                      <span className="text-xs font-semibold py-1 px-2 rounded-md bg-green-600 text-white">
                        Done
                      </span>
                    ) : (
                      <button
                        onClick={() => markTaskAsDone(task.id)}
                        className="text-xs font-semibold py-1 px-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Mark as Done
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <FaCog className="w-6 h-6 text-blue-500 bg-white rounded-full p-1 shadow-md cursor-pointer" />

        <div className="relative">
          <div
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white cursor-pointer"
            onClick={toggleDropdown}
          >
            <img src={profileImage} alt="User Profile" className="w-full h-full object-cover" />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-[240px] bg-gray-800 text-white rounded-lg shadow-lg p-4">
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
