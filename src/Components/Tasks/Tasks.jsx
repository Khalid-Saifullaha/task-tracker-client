import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTasks } from "react-icons/fa";
import { AuthContext } from "../Provider/AuthProvider";
import { BiTask } from "react-icons/bi";
import AllTasks from "./AllTasks";
import useTasks from "../Hooks/useTasks";
const Tasks = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [, refetch] = useTasks();
  // Function to handle form submission
  const onSubmit = async (data) => {
    if (!data.title || !data.category) {
      toast.error("Title and Category are required!");
      return;
    }

    // Add auto-generated timestamp
    const taskData = {
      ...data,
      timestamp: new Date().toISOString(),
      addedBy: user?.email,
    };

    try {
      const res = await axios.post("http://localhost:5000/tasks", taskData);
      if (res.data.insertedId) {
        toast.success("Task added successfully!");
        reset();
        refetch();
        setIsOpen(false); // Close modal after successful submission
      }
    } catch (error) {
      console.error("Error saving task to database:", error);
      toast.error("Failed to add task. Please try again.");
    }
  };

  return (
    <div className="w-4/5 mx-auto py-10">
      {/* Title Section */}
      <div className="flex items-center gap-4 justify-center mb-8">
        <p className="text-2xl md:text-4xl lg:text-6xl font-bold">
          <FaTasks />
        </p>
        <p className="text-2xl md:text-4xl lg:text-6xl font-bold">
          Track Your Task
        </p>
      </div>

      {/* Add Task Button */}
      <div className="text-center mb-6 flex justify-center">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-800 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-all flex items-center gap-3"
        >
          <p>
            {" "}
            <BiTask className="font-bold" />
          </p>
          Add Task
        </button>
      </div>

      <div className="mt-10 ">
        <AllTasks />
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="overflow-y-auto fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-2/3 lg:w-2/4">
            <h2 className="text-2xl font-bold mb-4">Add a New Task</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Title (max 50 characters)
                </label>
                <input
                  type="text"
                  placeholder="Enter task title"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("title", {
                    required: "Title is required",
                    maxLength: {
                      value: 50,
                      message: "Title must be less than 50 characters",
                    },
                  })}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm">{errors.title.message}</p>
                )}
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Description (max 200 characters)
                </label>
                <textarea
                  placeholder="Enter task description (optional)"
                  rows="4"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("description", {
                    maxLength: {
                      value: 200,
                      message: "Description must be less than 200 characters",
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Category
                </label>
                <select
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("category", {
                    required: "Category is required",
                  })}
                >
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-400 px-6 py-2 rounded-lg text-white font-semibold hover:bg-gray-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2c2b2b] px-6 py-2 rounded-lg text-white font-semibold hover:bg-[#1d1d1d] transition-all"
                >
                  Submit Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
