import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TaskItem = ({ task, refreshTasks }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const toggleComplete = async () => {
    try {
      await axios.put(`http://localhost:8080/api/v1/task/update-task/${task._id}`, {
        completed: !task.completed,
        text: task.text,
      });
      refreshTasks();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/task/delete-task/${task._id}`);
      toast.success("Task deleted");
      refreshTasks();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/api/v1/task/update-task/${task._id}`, {
        text: editText,
        completed: task.completed,
      });
      toast.success("Task updated");
      setEditing(false);
      refreshTasks();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div
      className={`flex justify-between items-center p-4 rounded shadow bg-white ${task.completed ? "opacity-60 line-through" : ""}`}
    >
      <div className="flex items-center gap-3 flex-grow">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={toggleComplete}
          className="cursor-pointer"
        />
        {editing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
        ) : (
          <span>{task.text}</span>
        )}
      </div>

      <div className="flex gap-3 ml-3">
        {editing ? (
          <button onClick={handleUpdate} className="text-green-500 hover:underline">
            Save
          </button>
        ) : (
          <button onClick={() => setEditing(true)} className="text-blue-500 hover:underline">
            Edit
          </button>
        )}
        <button onClick={handleDelete} className="text-red-500 hover:underline">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
