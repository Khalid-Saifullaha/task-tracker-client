import React, { useContext } from 'react';
import useTasks from '../Hooks/useTasks';
import { AuthContext } from '../Provider/AuthProvider';
import Todo from './Todo';
import InProgress from './InProgress';
import Done from './Done';

const AllTasks = () => {
    const { user } = useContext(AuthContext);
    const [tasks, refetch] = useTasks();

    const myTasks = tasks?.filter(task => task.addedBy === user?.email);

    // Filter tasks by category
    const todoTasks = myTasks?.filter(task => task.category === "To-Do");
    const inProgressTasks = myTasks?.filter(task => task.category === "In Progress");
    const doneTasks = myTasks?.filter(task => task.category === "Done");

    return (
        <div className=" flex flex-col md:flex-row gap-4 md:justify-between justify-center">
            {/* To-Do Tasks */}
            <Todo tasks={todoTasks} refetch={refetch}/>

            {/* In Progress Tasks */}
            <InProgress tasks={inProgressTasks} refetch={refetch}/>

            {/* Done Tasks */}
            <Done tasks={doneTasks} refetch={refetch}/>
        </div>
    );
};

export default AllTasks;
