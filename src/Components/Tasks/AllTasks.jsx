import React, { useContext, useState, useEffect } from "react";
import useTasks from "../Hooks/useTasks";
import { AuthContext } from "../Provider/AuthProvider";
import Todo from "./Todo";
import InProgress from "./InProgress";
import Done from "./Done";
import { DragDropContext } from "@hello-pangea/dnd";
import axios from "axios";

const AllTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, refetch] = useTasks();
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    // Filter and sort tasks by order
    const sortedTodoTasks = tasks
      ?.filter(
        (task) => task.category === "To-Do" && task.addedBy === user.email
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const sortedInProgressTasks = tasks
      ?.filter(
        (task) => task.category === "In Progress" && task.addedBy === user.email
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const sortedDoneTasks = tasks
      ?.filter(
        (task) => task.category === "Done" && task.addedBy === user.email
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    setTodoTasks(sortedTodoTasks || []);
    setInProgressTasks(sortedInProgressTasks || []);
    setDoneTasks(sortedDoneTasks || []);
  }, [tasks, user]);

  const onDragEnd = async (result) => {
    if (!user?.email) return;
    const { destination, source, draggableId } = result;

    if (!destination) return;

    try {
      let sourceList, destinationList;
      let sourceCategory, destinationCategory;

      // Get source list and category
      if (source.droppableId === "todo") {
        sourceList = [...todoTasks];
        sourceCategory = "To-Do";
      } else if (source.droppableId === "inProgress") {
        sourceList = [...inProgressTasks];
        sourceCategory = "In Progress";
      } else if (source.droppableId === "done") {
        sourceList = [...doneTasks];
        sourceCategory = "Done";
      }

      // Same column reordering
      if (source.droppableId === destination.droppableId) {
        const items = Array.from(sourceList);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);

        // Update UI immediately
        if (source.droppableId === "todo") setTodoTasks(items);
        else if (source.droppableId === "inProgress") setInProgressTasks(items);
        else if (source.droppableId === "done") setDoneTasks(items);

        // Update all items in the column with new sequential orders
        const updatePromises = items.map((task, index) => {
          return axios.put(
            `https://task-tracker-server-iota.vercel.app/tasks/${task._id}?addedBy=${user.email}`,
            {
              order: index,
              category: sourceCategory,
              addedBy: user.email,
            }
          );
        });

        await Promise.all(updatePromises);
      } else {
        // Moving between columns
        const sourceItems = Array.from(sourceList);
        const [movedItem] = sourceItems.splice(source.index, 1);

        // Get destination list and category
        if (destination.droppableId === "todo") {
          destinationList = [...todoTasks];
          destinationCategory = "To-Do";
        } else if (destination.droppableId === "inProgress") {
          destinationList = [...inProgressTasks];
          destinationCategory = "In Progress";
        } else if (destination.droppableId === "done") {
          destinationList = [...doneTasks];
          destinationCategory = "Done";
        }

        const destItems = Array.from(destinationList);
        destItems.splice(destination.index, 0, movedItem);

        // Update UI immediately
        if (source.droppableId === "todo") setTodoTasks(sourceItems);
        else if (source.droppableId === "inProgress")
          setInProgressTasks(sourceItems);
        else if (source.droppableId === "done") setDoneTasks(sourceItems);

        if (destination.droppableId === "todo") setTodoTasks(destItems);
        else if (destination.droppableId === "inProgress")
          setInProgressTasks(destItems);
        else if (destination.droppableId === "done") setDoneTasks(destItems);

        // Update moved task category and order
        await axios.put(
          `https://task-tracker-server-iota.vercel.app/tasks/${draggableId}?addedBy=${user.email}`,
          {
            category: destinationCategory,
            order: destination.index,
            addedBy: user.email,
          }
        );

        // Update orders for source list
        const sourceUpdates = sourceItems.map((task, index) => {
          return axios.put(
            `https://task-tracker-server-iota.vercel.app/tasks/${task._id}?addedBy=${user.email}`,
            {
              order: index,
              category: sourceCategory,
              addedBy: user.email,
            }
          );
        });

        // Update orders for destination list
        const destUpdates = destItems.map((task, index) => {
          return axios.put(
            `https://task-tracker-server-iota.vercel.app/tasks/${task._id}?addedBy=${user.email}`,
            {
              order: index,
              category: destinationCategory,
              addedBy: user.email,
            }
          );
        });

        await Promise.all([...sourceUpdates, ...destUpdates]);
      }

      // Refetch to ensure database consistency
      await refetch();
    } catch (error) {
      console.error("Error updating tasks:", error);
      refetch(); // Restore state on error
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row gap-4 md:justify-between justify-center">
        <Todo tasks={todoTasks} refetch={refetch} />
        <InProgress tasks={inProgressTasks} refetch={refetch} />
        <Done tasks={doneTasks} refetch={refetch} />
      </div>
    </DragDropContext>
  );
};

export default AllTasks;
