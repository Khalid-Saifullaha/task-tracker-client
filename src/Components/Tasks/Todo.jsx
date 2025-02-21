import { useState } from "react";
import moment from "moment";
import { FaEye, FaPen, FaRegClock } from "react-icons/fa";
import { ImTarget } from "react-icons/im";
import { MdDeleteForever } from "react-icons/md";
import { TbSubtask } from "react-icons/tb";
import toast from "react-hot-toast";
import axios from "axios";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const Todo = ({ tasks, refetch }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  // Function to open modal and pre-fill input values
  const openModal = (task) => {
    setSelectedTask(task);
    setUpdatedTitle(task.title); // Set the default value for the title
    setUpdatedDescription(task.description || ""); // Set the default value for description
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedTask(null);
  };

  // Handle title and description changes
  const handleTitleChange = (e) => setUpdatedTitle(e.target.value);
  const handleDescriptionChange = (e) => setUpdatedDescription(e.target.value);

  // Handle updating the task
  const handleUpdate = () => {
    axios
      .put(
        `https://task-tracker-server-iota.vercel.app/tasks/${selectedTask._id}`,
        {
          title: updatedTitle,
          description: updatedDescription,
        }
      )
      .then((res) => {
        toast.success("Task updated successfully");
        refetch(); // Refetch tasks to reflect the updated task
        closeModal(); // Close the modal after updating
      })
      .catch((err) => {
        toast.error("Failed to update task");
      });
  };

  //   delete
  const handleDelete = (taskId) => {
    axios
      .delete(`https://task-tracker-server-iota.vercel.app/tasks/${taskId}`)
      .then((res) => {
        refetch();
        toast.success("Task deleted successfully");
      })
      .catch((err) => {
        toast.error("Failed to delete task");
      });
  };

  return (
    <div className="md:w-2/6">
      {/* Title */}
      <div className="text-xl md:text-2xl text-red-500 lg:text-3xl font-bold flex justify-center items-center gap-2 mb-5">
        <p>
          <ImTarget />
        </p>
        <p>To-Do</p>
      </div>

      <Droppable droppableId="todo">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4 min-h-[200px]"
          >
            {tasks?.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`border-2 border-red-200 bg-slate-200 p-2 rounded-md flex gap-2 flex-col 
                                            shadow-[0px_4px_10px_rgba(239,68,68,0.2)] 
                                            ${
                                              snapshot.isDragging
                                                ? "opacity-75"
                                                : ""
                                            }`}
                  >
                    {/* Title */}
                    <div className="font-medium text-lg flex gap-1 items-center">
                      <p>
                        <TbSubtask />
                      </p>
                      <p>{task.title}</p>
                    </div>

                    {/* Time */}
                    <div className="text-md flex gap-1 items-center">
                      <p>
                        <FaRegClock />
                      </p>
                      <p>{moment(task.timestamp).format("MMM D YYYY")}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      {/* Description Button */}
                      <div
                        className="flex gap-1 items-center text-info cursor-pointer"
                        onClick={() => openModal(task)}
                      >
                        <p>
                          <FaEye />
                        </p>
                        <p> Description</p>
                      </div>

                      <div className="flex gap-2 items-center">
                        {/* Edit Button */}
                        <button onClick={() => openModal(task)}>
                          <FaPen className="text-green-500 text-sm" />
                        </button>

                        {/* Delete Button */}
                        <button onClick={() => handleDelete(task._id)}>
                          <MdDeleteForever className="text-lg text-error" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-2">Edit Task</h2>

            {/* Title Input */}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-gray-700 font-semibold"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={updatedTitle}
                onChange={handleTitleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 font-semibold"
              >
                Description
              </label>
              <textarea
                id="description"
                value={updatedDescription}
                required
                onChange={handleDescriptionChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="4"
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;
