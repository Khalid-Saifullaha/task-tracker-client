import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../Provider/AuthProvider";

const useTasks = () => {
  const { user } = useContext(AuthContext);

  const { refetch, data: tasks = [] } = useQuery({
    queryKey: ["tasks", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];

      const res = await axios.get(`http://localhost:5000/tasks`, {
        params: {
          addedBy: user.email,
        },
      });
      console.log("Fetched tasks for user:", user.email, res.data); // Debug log
      return res.data;
    },
    enabled: !!user?.email,
  });

  return [tasks, refetch];
};

export default useTasks;
