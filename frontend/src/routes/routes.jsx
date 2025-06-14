// src/routes/routes.js
import React from 'react';
const Dashboard = React.lazy(() => import('../pages/Dashboard/index.jsx'));
import AppLayout from '../layout/index';

// const Reports = React.lazy(() => import('../pages/Reports'));
// const NotFound = React.lazy(() => import('../pages/NotFound'));

// export const routes = [
//   {
//     path: '/',
//     element: <>hey</>
//   }
// //   {
// //     path: '/reports',
// //     element: <Reports />,
// //   },
// //   {
// //     path: '*',
// //     element: <NotFound />,
// //   },
// ];


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
  
];

