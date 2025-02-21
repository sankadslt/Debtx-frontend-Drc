import { useState } from "react";


const CreateTask = () => {
  const [task, setTask] = useState("");
  const [url, setUrl] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");  // State to store success/error message

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessage("You must be logged in to create a task");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/taskList/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
        body: JSON.stringify({ task, url, userEmail }), // Only send assigned user's email
      });
  
      if (response.ok) {
        setMessage("Task created successfully!");
        setTask(""); // Reset input fields
        setUrl("");
      } else {
        const data = await response.json();
        setMessage(data.message || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      setMessage("An error occurred while creating the task");
    }
  };
  

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Create Task</h2>
      <form onSubmit={handleTaskSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Task Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">URL</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Assigned User Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-700 text-white py-2 rounded-lg"
        >
          Create Task
        </button>
      </form>

      {message && (
        <div className="mt-4 text-center">
          <p className={message.includes("successfully") ? "text-green-500" : "text-red-500"}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateTask;
