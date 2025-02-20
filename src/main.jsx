import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './Components/Home/Home';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './Components/Provider/AuthProvider';
import Login from './Components/Users/Login';
import Register from './Components/Users/Register';
import PrivateRoute from './Components/Routes/PrivateRoute';
import Tasks from './Components/Tasks/Tasks';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: 
      <Home/>
  },
  {
    path:"tasks",
    element:
    <PrivateRoute>
      <Tasks></Tasks>
    </PrivateRoute>
    
  },
  {
    path:"login",
    element:<Login></Login>
  },
  {
    path:"register",
    element:<Register></Register>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AuthProvider>
  <QueryClientProvider client={queryClient}>
        <Toaster />
        <RouterProvider router={router} />
      </QueryClientProvider>
  </AuthProvider>
</StrictMode>,
)
