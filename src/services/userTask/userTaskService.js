const BASE_URL = import.meta.env.VITE_BASE_URL ;
const API_URL = `${BASE_URL}/taskList/task`;

// Fetch tasks based on the user's id
export const fetchUserTasks = async (token, userId) => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error fetching tasks: ${errorData.message}`);
    }

    const data = await response.json();
    return data.filter((task) => task.id === userId); // Filter tasks by the user ID
  } catch (error) {
    console.error("Error fetching tasks:", error);
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
