const BASE_URL = import.meta.env.VITE_BASE_URL ;
const API_URL = `${BASE_URL}/taskList/task`;
import axios from "axios";

// Fetch tasks based on the user's id
// export const fetchUserTasks = async (token, userId) => {
//   try {
//     const response = await fetch(API_URL, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(`Error fetching tasks: ${errorData.message}`);
//     }

//     const data = await response.json();
//     return data.filter((task) => task.id === userId); // Filter tasks by the user ID
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     throw error;
//   }
// };

export const fetchUserTasks = async (token, delegate_user_id) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/task/List_All_Open_Requests_For_To_Do_List`,
      { delegate_user_id },
      {
        headers: {
          Authorization: `Bearer ${token}`, // attach JWT
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.data) {
      const tasks = response.data.data.map((task) => {
        const showParamsNotEmpty =
          Array.isArray(task.showParameters) && task.showParameters.length > 0;
        return {
          ...task,
          Case_ID:
            showParamsNotEmpty && task.parameters?.case_id !== undefined
              ? task.parameters.case_id
              : undefined,
        };
      });
      return tasks;
    } else {
      const tasks = [];
      return tasks;
    }
  } catch (error) {
    console.error("Error fetching user tasks:", error.message);
    throw error;
  }
};

// Mark a task as completed
export const markTaskAsCompleted = async (token, taskId) => {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error updating task status: ${errorData.message}`);
    }

    return true;
  } catch (error) {
    console.error("Error marking task as completed:", error);
    throw error;
  }
};

// Load more tasks if necessary (in case of pagination or infinite scroll)
export const loadMoreTasks = async (token, limit, skip) => {
  try {
    const response = await fetch(`${API_URL}?limit=${limit}&skip=${skip}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error fetching more tasks: ${errorData.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching more tasks:", error);
    throw error;
  }
};
