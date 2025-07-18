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

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  let { type, employee } = useParams();
  console.log(employee, "EMPLOYEE ID");
  employee = employee?.split("=")?.[1];
  console.log(employee, "EMPLOYEE ID");

  const token = localStorage.getItem("token");
  let decodedUserId = null;
  if (token) {
    const decoded = jwtDecode(token);
    decodedUserId = decoded.userId;
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

  return (
    <Box className={styles.dashboardContainer}>
      <DeskTimeHeader setFilters={memoizedSetFilters} />

      {isLoading ? (
        <LoadingComponent />
      ) : (
        <AnalyticCards
          setFilters={memoizedSetFilters}
          getDashboardData={getDashboardData}
        />
      )}

      {filters.viewMode !== "month" &&
        (isProductivityLoading ? (
          <LoadingComponent />
        ) : (
          <ProductivityBar getProductiviyData={getProductiviyData} />
        ))}

      {filters.viewMode === "month" && (
        <EmployeeCalendar
          getProductiviyData={getProductiviyData}
          filters={filters}
        />
      )}

      {filters.viewMode === "day" && (
        <ScreenshotGrid employee={employee} filters={filters} />
      )}
    </Box>
  );
};

export default memo(Dashboard);
