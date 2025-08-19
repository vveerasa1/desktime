import React, { useState, useEffect, useCallback, memo } from "react";
import { Box } from "@mui/material";
import AnalyticCards from "../../components/Dashboard/AnalyticCards";
import ProductivityBar from "../../components/Dashboard/ProductivityBar";
import EmployeeCalendar from "../../components/Dashboard/DeskCalendar";
import ScreenshotGrid from "../../components/Dashboard/ScreenshotGrid";
import DeskTimeHeader from "../../components/Dashboard/DeskTimeHeader";
import {
  useGetDashboardDataQuery,
  useGetProductivityDataQuery,
} from "../../redux/services/dashboard";
import LoadingComponent from "../../components/ComponentLoader";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import styles from "./index.module.css";
import { jwtDecode } from "jwt-decode";
import { useGetSingleProfileQuery } from "../../redux/services/user";
import ProjectTimeline from "../../components/Dashboard/ProjectTimeLine";
const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  let { type, employee } = useParams();
  employee = employee?.split("=")?.[1];

  const token = localStorage.getItem("token");
  let decodedUserId = null;
  let ownerId = null
  if (token) {
    const decoded = jwtDecode(token);
    decodedUserId = decoded.userId;
    ownerId = decoded.ownerId
  }

  const userId = employee || decodedUserId || employee;

  const date = searchParams.get("date") || dayjs().format("YYYY-MM-DD");
  const viewMode = searchParams.get("view") || "day";

  const [filters, setFilters] = useState({
    date: date,
    viewMode: viewMode,
  });

  const memoizedSetFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Ensure all required searchParams exist


  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams);
    let shouldRedirect = false;

    if (!currentParams.get("view")) {
      currentParams.set("view", viewMode);
      shouldRedirect = true;
    }

    if (!currentParams.get("date")) {
      currentParams.set("date", date);
      shouldRedirect = true;
    }

    if (employee && !currentParams.get("employee")) {
      currentParams.set("employee", employee);
      shouldRedirect = true;
    }

    // if (shouldRedirect) {
    //   // http://localhost:5173/dashboard/6874d46ccb3beb5d99f1a344?view=day&date=2025-07-15&employee=6874d46ccb3beb5d99f1a344/
    //   navigate(`/dashboard/${employee || ""}?${currentParams.toString()}/?view=day&date=${new Date()}`, { replace: true });
    // }
  }, [searchParams, viewMode, date, employee, navigate]);
  
useEffect(() => {
  const handleBackButton = (event) => {
    console.log("Back button clicked!");
    navigate("/team-members", { replace: true }); // Always go to team members
  };

  window.onpopstate = handleBackButton;

  return () => {
    window.onpopstate = null; // cleanup
  };
}, [navigate]);


  const { data: getDashboardData, isLoading } = useGetDashboardDataQuery({
    day: filters.viewMode,
    date: filters.date,
    userId: userId || employee,
  });

  const { data: getProductiviyData, isLoading: isProductivityLoading } =
    useGetProductivityDataQuery({
      day: filters.viewMode,
      date: filters.date,
      userId: userId,
    });

    const { data: getSingleData, isLoading: getSingleLoading } = useGetSingleProfileQuery(
   userId ,
  {
    skip: !userId,
  }
);  

  return (
    <Box className={styles.dashboardContainer}>
      <DeskTimeHeader getSingleData={getSingleData} setFilters={memoizedSetFilters} />

      {isLoading ? (
        <LoadingComponent />
      ) : (
        <AnalyticCards
          userId={decodedUserId}
          ownerId={ownerId}
          setFilters={memoizedSetFilters}
          getDashboardData={getDashboardData}
        />
      )}

      {filters.viewMode !== "month" &&
        (isProductivityLoading ? (
          <LoadingComponent />
        ) : (
          <Box >
          <ProductivityBar userId={userId} employee={employee} ownerId={ownerId}  getProductiviyData={getProductiviyData} />

          </Box>
        ))}
          {/* <ProjectTimeline/> */}

      {filters.viewMode === "month" && (
        <Box >

        <EmployeeCalendar
          getProductiviyData={getProductiviyData}
          filters={filters}
        />
        </Box>

      )}

      {filters.viewMode === "day" && (
        <Box>

        <ScreenshotGrid employee={employee} filters={filters} />
      
        </Box>
      )}
    </Box>
  );
};

export default memo(Dashboard);
