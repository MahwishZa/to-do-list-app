import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskItem from "./TaskItem";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const userId = localStorage.getItem("userId");

  // If the user is not authenticated, redirect to login
  if (!userId) {
    toast.error("User not authenticated. Please login.");
    navigate("/login");
  }

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/v1/task/user-task/${userId}`);
      if (data?.success) {
        setTasks(data.userTask.tasks || []);
      }
    } catch (error) {
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    try {
      const { data } = await axios.post("http://localhost:8080/api/v1/task/create-task", {
        text: newTaskText,
        user: userId,
      });
      if (data.success) {
        toast.success("Task created");
        setNewTaskText(""); // Clear input
        fetchTasks(); // Refresh tasks after adding a new task
      } else {
        toast.error("Task creation failed");
      }
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const clearCompletedTasks = async () => {
    try {
      const completed = tasks.filter((t) => t.completed);
      await Promise.all(
        completed.map((task) =>
          axios.delete(`http://localhost:8080/api/v1/task/delete-task/${task._id}`)
        )
      );
      toast.success("Cleared completed tasks");
      fetchTasks(); // Refresh tasks after clearing completed
    } catch (error) {
      toast.error("Failed to clear completed tasks");
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.text.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "completed" && task.completed) ||
        (filterStatus === "incomplete" && !task.completed);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <h1 className="text-2xl font-semibold mb-6">My To-Do List</h1>

      <form onSubmit={handleCreateTask} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={clearCompletedTasks} className="text-red-600 hover:underline">
          Clear Completed Tasks
        </button>
      </div>

      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem key={task._id} task={task} refreshTasks={fetchTasks} />
          ))
        ) : (
          <p className="text-gray-500">No tasks found</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;