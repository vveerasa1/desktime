import React, { lazy } from "react";
import AppLayout from "../layout";
import Login from "../pages/Auth/Login";
import AbsenceCalender from "../pages/AbsenceCalendar";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const Colleagues = lazy(() => import("../pages/Colleagues"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));
const OtpVerify = lazy(() => import("../pages/Auth/OtpVerify"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword"));

export const routes = [
  {
    path: "/", // ✅ Root path shows Login
    element: <Login />,
  },
  // {
  //   path: "/login",
  //   element: <Login />,
  // },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/otp-verify",
    element: <OtpVerify />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/", // ✅ Protected routes with layout
    element: <AppLayout />,
    children: [
      {
        path: "dashboard/:type?",
        element: <Dashboard />,
      },
      {
        path: "settings",
        element: <Profile />,
      },
      {
        path: "settings/edit/:_id",
        element: <Profile />,
      },
      {
        path: "colleagues/edit/:_id",
        element: <Profile />,
      },
      {
        path: "colleagues",
        element: <Colleagues />,
      },
      {
        path: "absence-calendar",
        element: <AbsenceCalender />,
      },
    ],
  },
];
