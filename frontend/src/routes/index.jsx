import React, { lazy } from "react";
import AppLayout from "../layout";
import Login from "../pages/Auth/Login";
import CognitoLoginRedirect from "../components/CognitoLoginRedirect";
import OidcLoginRedirect from "../components/OidcLoginRedirect";
import AbsenceCalender from "../pages/AbsenceCalendar";
import Projects from "../pages/UserProjects";
import ProtectedRoute from "../components/ProtectedRoute";
import OfflineTimes from "../pages/OfflineTimes";
import LogoutSuccess from "../pages/Auth/Logout";
import Billing from "../pages/Billing";
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const Colleagues = lazy(() => import("../pages/Colleagues"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));
const OtpVerify = lazy(() => import("../pages/Auth/OtpVerify"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword"));
const Callback = lazy(() => import("../Callback"))
const Teams = lazy(() => import('../pages/Teams'))
const Subscribe = lazy(() => import('../pages/Auth/Subscribe/SubscribeToHRMS'))
const TeamMembers = lazy(() =>import('../pages/TeamMembers'))
// export const routes = [
//   {
//     path: "/", // ✅ Root path shows Login
//     element: <Login />,
//   },
//   // {
//   //   path: "/login",
//   //   element: <Login />,
//   // },
//   {
//     path: "/forgot-password",
//     element: <ForgotPassword />,
//   },
//   {
//     path: "/verify-otp",
//     element: <OtpVerify />,
//   },
//   {
//     path: "/reset-password",
//     element: <ResetPassword />,
//   },
//   {
//     path: "/", // ✅ Protected routes with layout
//     element: <AppLayout />,
//     children: [
//       {
//         path: "dashboard/:type?",
//         element: <Dashboard />,
//       },
//       {
//         path: "colleagues/edit/:_id",
//         element: <Profile />,
//       },
//       {
//         path: "colleagues",
//         element: <Colleagues />,
//       },
//       {
//         path: "settings",
//         element: <Profile />,
//       },

//       {
//         path: "absence-calendar",
//         element: <AbsenceCalender />,
//       },
//        {
//         path: "projects",
//         element: <Projects />,
//       },
//     ],
//   },
// ];

export const routes = [
  {
    path: "/",
    element: <OidcLoginRedirect />,
  },
  {
    path: "/callback",
    element: <Callback />,
  },
   {
    path: "/logout-success",
    element: <LogoutSuccess />,
  },
  {
    path: "/subscribe-trackme",
    element: <Billing />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/verify-otp",
    element: <OtpVerify />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  { path: "/billings", element: <Billing /> },

  {
    path: "/", // 🔒 Protected Route Shell
    element: <ProtectedRoute />, // ✅ Auth check happens here
    children: [
      {
        path: "/",
        element: <AppLayout />, // ✅ Only render if authenticated
        children: [
          { path: "dashboard/:employee?/:type?", element: <Dashboard /> },
          { path: "colleagues/edit/:_id", element: <Profile /> },
          { path: "colleagues/view/:employee", element: <Dashboard /> },
          { path: "colleagues", element: <Colleagues /> },
          { path: "settings", element: <Profile /> },
          { path: "absence-calendar", element: <AbsenceCalender /> },
          { path: "projects", element: <Projects /> },
          { path: "teams", element: <Teams /> },
          { path: "/team-members", element: <TeamMembers /> },
          { path: "/offline-times", element: <OfflineTimes /> },
        ],
      },
    ],
  },
];
