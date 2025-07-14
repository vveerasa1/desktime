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
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import styles from './index.module.css'
import { jwtDecode } from "jwt-decode";
const Dashboard = () => {

  const [searchParams] = useSearchParams();
  const token = localStorage.getItem('token')
  let userId = null
  if(token){
    const decoded = jwtDecode(token)
    userId = decoded.userId
  }
  const date = searchParams.get("date") || dayjs().format("YYYY-MM-DD");
  const [filters, setFilters] = useState({
    date: date,
    viewMode: "day",
  });
  const viewMode = searchParams.get("view") || "day";
  const navigate = useNavigate();
  const { type } = useParams();

  const memoizedSetFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  useEffect(() => {
    if (!searchParams.get("view") || !searchParams.get("date")) {
      navigate(`/dashboard?view=${viewMode}&date=${date}`, { replace: true });
    }
  }, [searchParams, viewMode, date, navigate]);
  const { data: getDashboardData, isLoading } = useGetDashboardDataQuery({
    day: filters.viewMode,
    date: filters.date,
    userId:userId
  });

  const { data: getProductiviyData, isLoading: isProductivityLoading } =
    useGetProductivityDataQuery({ day: filters.viewMode, date: filters.date, userId:userId });

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

      {filters.viewMode === "month" ? (
        <EmployeeCalendar
          getProductiviyData={getProductiviyData}
          filters={filters}
        />
      ) : (
        ""
      )}

      {filters.viewMode === "week" || filters.viewMode === "month" ? (
        ""
      ) : (
        <ScreenshotGrid userId={userId} filters={filters} />
      )}
    </Box>
  );
};

export default memo(Dashboard);
