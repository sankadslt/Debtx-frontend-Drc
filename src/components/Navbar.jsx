// import { useState, useEffect, useRef } from "react";
// import { FaBell, FaCog, FaUser, FaSignOutAlt, FaTasks } from "react-icons/fa";
// import profileImage from "../assets/images/profile.jpg";
// import logo from "../assets/images/logo.png";
// import { useNavigate } from "react-router-dom";
// import { getUserData, logoutUser } from "../services/auth/authService";

// const Navbar = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     setIsDropdownOpen(false);

//     localStorage.removeItem("accessToken");
//     await logoutUser();
//     setUserData(null);
//     navigate("/");
//   };
  

//   const loadUser = async () => {
//     try {
//       const user = await getUserData();
//       setUserData({
//         id: user.id,
//         name: user.username,
//         email: user.email,
//         role: user.role,
//       });
//     } catch (error) {
//       console.error("Failed to fetch user data:", error);
//       handleLogout();
//     }
//   };
  
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
  
//     if (token) {
//       loadUser();
//     } else {
//       handleLogout();
//     }
//   }, []);
  

//   const defaultUser = {
//     name: "Guest",
//     role: "Visitor",
//     profileOptions: [
//       {
//         id: 1,
//         label: "Profile",
//         icon: <FaUser />,
//         onClick: () => alert("Profile Clicked"),
//       },
//       {
//         id: 2,
//         label: "Settings & Privacy",
//         icon: <FaCog />,
//         onClick: () => alert("Settings Clicked"),
//       },
//       {
//         id: 3,
//         label: "Log Out",
//         icon: <FaSignOutAlt />,
//         onClick: handleLogout,
//       },
//     ],
//   };

//   const currentUser = userData || defaultUser;

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     if (isDropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isDropdownOpen]);

//   const [taskData, setTaskData] = useState([]);
//   const [isTaskListOpen, setIsTaskListOpen] = useState(false);
//   const [visibleTasks, setVisibleTasks] = useState(10);

//   const taskListRef = useRef(null);

//   const toggleTaskList = () => setIsTaskListOpen((prev) => !prev);


//   const pendingTasksCount = userData
//     ? taskData.filter((task) => task.id === userData.id && !task.completed).length
//     : 0;

//     const markTaskAsDoneAndNavigate = async (id, url) => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         if (!token) {
//           console.error("No token found in localStorage");
//           return;
//         }
    
//         const response = await fetch(
//           `http://localhost:5000/api/taskList/task/${id}`,
//           {
//             method: "PATCH",
//             headers: {
//               "Authorization": `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               completed: true,
//             }),
//           }
//         );
    
//         if (response.ok) {
//           setTaskData((prev) =>
//             prev.map((task) =>
//               task._id === id ? { ...task, completed: true } : task
//             )
//           );
//           navigate(url);
//         } else {
//           const errorData = await response.json();
//           console.error("Failed to update task status:", errorData.message);
//         }
//       } catch (error) {
//         console.error("Error updating task status:", error);
//       }
//     };
    

//   const handleTaskClick = (id, url) => {
//     const task = taskData.find((task) => task._id === id);

//     if (!task) {
//       console.error("Task not found:", id);
//       return;
//     }

//     if (!task.completed) {
//       markTaskAsDoneAndNavigate(id, url);
//     } else {
//       navigate(url);
//     }
//   };

//   const loadMoreTasks = () => {
//     setVisibleTasks((prev) => prev + 10);
//   };

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         if (!token) {
//           console.error("No token found in localStorage");
//           return;
//         }

//         const response = await fetch("http://localhost:5000/api/taskList/task", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(`Error: ${response.status} - ${errorData.message}`);
//         }

//         const data = await response.json();
//         setTaskData(data);
//       } catch (error) {
//         console.error("Error fetching tasks:", error.message);
//       }
//     };

//     fetchTasks();

//     const handleClickOutside = (event) => {
//       if (
//         taskListRef.current &&
//         !taskListRef.current.contains(event.target) &&
//         !event.target.closest(".task-button")
//       ) {
//         setIsTaskListOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-md fixed top-0 left-0 w-full z-50 font-poppins">
//       <div className="flex items-center gap-4">
//         <img src={logo} alt="Logo" className="h-10 w-full" />
//       </div>
//       <div className="flex items-center gap-6">
//         <div className="relative">
//           <FaBell className="w-6 h-6 text-green-500 bg-white rounded-full p-1 shadow-md cursor-pointer" />
//           <div className="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full"></div>
//         </div>

//         <div className="relative">
//           <button
//             onClick={toggleTaskList}
//             className="task-button bg-teal-700 text-white py-1 px-3 rounded-full flex items-center gap-2"
//           >
//             <FaTasks />
//             <span>{pendingTasksCount}</span>
//           </button>

//           {isTaskListOpen && (
//             <div
//               ref={taskListRef}
//               className="absolute top-12 right-0 w-[420px] bg-gray-800 text-white rounded-lg shadow-lg p-4"
//             >
//               <p className="text-lg font-semibold text-center mb-4">
//                 Task List
//               </p>
//               <ul
//                 className="divide-y divide-gray-700 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
//                 onScroll={(e) => {
//                   const { scrollTop, scrollHeight, clientHeight } = e.target;
//                   if (scrollTop + clientHeight >= scrollHeight) {
//                     loadMoreTasks();
//                   }
//                 }}
//               >
//                 {taskData
//                   .filter((task) => task.id === userData?.id)
//                   .slice(0, visibleTasks)
//                   .map((task) => (
//                     <li
//                       key={task._id}
//                       className="flex items-center justify-between py-3 px-2 hover:bg-gray-700 rounded-lg"
//                     >
//                       <div className="flex items-center gap-2">
//                         <span
//                           className={`w-3 h-3 rounded-full ${
//                             task.completed ? "bg-green-500" : "bg-red-500"
//                           }`}
//                         ></span>
//                         <span>{task.task}</span>
//                       </div>
//                       <button
//                         onClick={() => handleTaskClick(task._id, task.url)}
//                         className={`text-xs font-semibold py-1 px-2 rounded-md ${
//                           task.completed
//                             ? "bg-green-600 text-white hover:bg-green-700"
//                             : "bg-blue-500 text-white hover:bg-blue-600"
//                         }`}
//                       >
//                         {task.completed ? "Done" : "Mark as Read"}
//                       </button>
//                     </li>
//                   ))}
//               </ul>
//             </div>
//           )}
//         </div>

//         <FaCog className="w-6 h-6 text-blue-500 bg-white rounded-full p-1 shadow-md cursor-pointer" />
//         <div className="relative" ref={dropdownRef}>
//           <div
//             className="w-10 h-10 rounded-full overflow-hidden border-2 border-white cursor-pointer"
//             onClick={() => setIsDropdownOpen((prev) => !prev)}
//           >
//             <img
//               src={profileImage}
//               alt="User Profile"
//               className="w-full h-full object-cover"
//             />
//           </div>
//           {isDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-[240px] bg-gray-800 text-white rounded-lg shadow-lg p-4 bg-opacity-90">
//               <p className="text-sm font-semibold text-center">
//                 {currentUser.name}
//               </p>
//               <p className="text-xs mb-4 text-center">{currentUser.role}</p>
//               <div className="space-y-2">
//                 {defaultUser.profileOptions.map((option) => (
//                   <button
//                     key={option.id}
//                     className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-700"
//                     onClick={option.onClick}
//                   >
//                     {option.icon}
//                     {option.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { useState, useEffect, useRef } from "react";
import { FaBell, FaCog, FaUser, FaSignOutAlt, FaTasks } from "react-icons/fa";
import profileImage from "../assets/images/profile.jpg";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken, logoutUser } from "../services/auth/authService";
import { fetchUserTasks, markTaskAsCompleted } from "../services/userTask/userTaskService";


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
      // {
      //   id: 1,
      //   label: "Profile",
      //   icon: <FaUser />,
      //   onClick: () => alert("Profile Clicked"),
      // },
      // {
      //   id: 2,
      //   label: "Settings & Privacy",
      //   icon: <FaCog />,
      //   onClick: () => alert("Settings Clicked"),
      // },
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

  const pendingTasksCount = userData
    ? taskData.filter((task) => task.userId === userData.user_id && !task.completed).length
    : 0;

  const markTaskAsDoneAndNavigate = async (user_id, url) => {
    try {
      const response = await markTaskAsCompleted(localStorage.getItem("accessToken"), user_id);

      if (response) {
        setTaskData((prev) =>
          prev.map((task) =>
            task._id === user_id ? { ...task, completed: true } : task
          )
        );
        navigate(url);
      } else {
        console.error("Failed to update task status.");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleTaskClick = (user_id, url) => {
    const task = taskData.find((task) => task._id === user_id);

    if (!task) {
      console.error("Task not found:", user_id);
      return;
    }

    if (!task.completed) {
      markTaskAsDoneAndNavigate(user_id, url);
    } else {
      navigate(url);
    }
  };

  const loadMoreTasks = () => {
    setVisibleTasks((prev) => prev + 10);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      console.log("Fetching tasks for user:", userData);
      console.log("delegete user id: ", userData?.id);
      try {
        const tasks = await fetchUserTasks(localStorage.getItem("accessToken"), userData?.id);
        console.log("Fetched tasks:", tasks);

        const enriched = tasks.map((t) => ({
          ...t,
          task: t.Process,
        }));

        setTaskData(enriched);
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    };

    if (userData) {
      fetchTasks();
    }

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
  }, [userData]);

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
              className="absolute top-12 right-0 w-[550px] border-2 border-[#00256A] bg-white bg-opacity-40 backdrop-blur-sm   text-[#E1E4F5] rounded-xl shadow-2xl p-5"
            >
              <div className="flex items-center justify-center mb-5">
                <div className="flex items-center gap-2">

                  <h3 className="text-xl font-bold text-black">Task List</h3>
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100 scrollbar-thumb-rounded-full">
                {taskData
                  // .filter((task) => task.task && (!task.showParameters || task.showParameters.every((key) => task[key] !== undefined)))
                  // .filter((task) => task.task)
                  .slice(0, visibleTasks)
                  .map((task) => (

                    <div
                      key={task._id}
                      className="group relative bg-white bg-opacity-60 border-2 border-[#b1c4e] rounded-lg p-4 transition-all duration-300 hover:bg-[#00256A]
 hover:border-blue-100 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 pr-16 pb-7">
                          <div className="flex items-center gap-3 mb-2">
                            {/* <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${task.completed
                              ? "bg-green-400 shadow-md"
                              : "bg-red-500   shadow-md "
                              }`}></div> */}
                            <h4 className="font-semibold text-[#00256A] text-sm leading-tight line-clamp-2 group-hover:text-white transition-colors">
                              {task.task}
                            </h4>


                          </div>
                          {task.showParameters && Array.isArray(task.showParameters) &&
                            task.showParameters.map((paramKey) => (
                              task.filtered_parameters[paramKey.toLowerCase()] &&
                              (<div key={paramKey} className="text-sm text-gray-900  group-hover:text-white ">
                                {paramKey.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: {task.filtered_parameters[paramKey.toLowerCase()]}
                              </div>)
                            ))
                          }
                        </div>

                        <div className="absolute top-2 right-3 text-xs text-gray-500 group-hover:text-white ">
                          {new Date(task.CreateDTM).toLocaleDateString("en-GB")}
                        </div>

                        <div className="absolute bottom-3 right-3">
                          {/* <div className="text-xs text-gray-500 mt-2">
                            {new Date(task.CreateDTM).toLocaleDateString("en-GB")}
                          </div> */}


                          <button
                            onClick={() => handleTaskClick(task.Interaction_Log_ID, task.url)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-full border border-[#fffff] transition-all duration-200 flex-shrink-0 w-auto ${task.completed
                              ? "bg-green-200 text-green-900 hover:bg-green-300"
                              // : "bg-[#00256A] text-white group-hover:text-blue hover:bg-white"
                              : "bg-[#00256A] text-white hover:text-[#00256A] hover:bg-white"

                              }`}
                          >
                            {task.completed ? "✓ Done" : "Ok"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                {taskData.length === 0 && (
                  <div className="text-center py-8">
                    <FaTasks className="mx-auto text-4xl text-gray-400 mb-3" />
                    <p className="text-gray-500 text-sm">No tasks available</p>
                  </div>
                )}

                {visibleTasks < taskData.length && (
                  <div className="text-center pt-3">
                    <button
                      onClick={loadMoreTasks}
                      className="text-xs text-[#00256A] hover:text-blue-700 transition-colors font-medium"
                    >
                      Load more tasks...
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center mt-5">
                <div className="flex items-center gap-2">
                  <button className="text-l text-[#00256A]">Go To Full Worklist</button>
                </div>
              </div>
            </div>
          )}


        </div>

        {/* <FaCog className="w-6 h-6 text-blue-500 bg-white rounded-full p-1 shadow-md cursor-pointer" /> */}
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
