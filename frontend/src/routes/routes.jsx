// src/routes/routes.js
import React from 'react';
const Dashboard = React.lazy(() => import('../pages/Dashboard/index.jsx'));
import AppLayout from '../layout/index';
import Login from '../pages/Auth/Login';


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
  
];

