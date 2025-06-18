// src/routes/routes.js
import React from 'react';
const Dashboard = React.lazy(() => import('../pages/Dashboard/index.jsx'));
import AppLayout from '../layout/index';
import Login from '../pages/Auth/Login';
import Profile from '../pages/Profile/index.jsx';
import Colleagues from '../pages/Colleagues/index.jsx';
import Projects from '../pages/Projects/index.jsx';


export const routes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true, // renders on /
        element: <Dashboard />,
      },
      
      // Add other nested routes here
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  // {
  //   path: '/forgot-password',
  //   element: <ForgotPassword />,
  // },
  // {
  //   path: '/verify-otp',
  //   element: <OtpVerify />,
  // },
  // {
  //   path: '/reset-password',
  //   element: <ResetPassword />,
  // },

  {
    path: '/settings',
    element: <AppLayout />,
    children: [
      {
        index: true, // renders on /
        element: <Profile />,
      },
      
      // Add other nested routes here
    ],
  },

  {
    path: '/colleagues',
    element: <AppLayout />,
    children: [
      {
        index: true, // renders on /
        element: <Colleagues />,
      },
      
      // Add other nested routes here
    ],
  },
   {
    path: '/projects',
    element: <AppLayout />,
    children: [
      {
        index: true, // renders on /
        element: <Projects />,
      },
      
      // Add other nested routes here
    ],
  },
  
];

