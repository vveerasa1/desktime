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

const Dashboard = () => {
  const date = dayjs().format("YYYY-MM-DD");
  const [filters, setFilters] = useState({
    date: date,
    viewMode: "day",
  });

  const navigate = useNavigate();
  const { type } = useParams();

  const memoizedSetFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  useEffect(() => {
    if (type !== filters.viewMode) {
      navigate(`/dashboard/?view=${filters.viewMode}`);
    }
  }, [filters.viewMode, navigate, type]);

  const { data: getDashboardData, isLoading } = useGetDashboardDataQuery({
    day: filters.viewMode,
    date: filters.date,
  });

  const { data: getProductiviyData, isLoading: isProductivityLoading } =
    useGetProductivityDataQuery({ day: filters.viewMode, date: filters.date });

  return (
    <Box sx={{ width: "100%" }}>
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
        <ScreenshotGrid />
      )}
    </Box>
  );
};

export default memo(Dashboard);
