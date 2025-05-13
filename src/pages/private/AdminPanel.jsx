import { useState, useEffect, Suspense } from "react";
import { Outlet } from "react-router-dom";
import LoadingState from "../../components/AdminDashboard/LoadingState";
import Layout from "../../components/AdminDashboard/Layout";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [pendingApprovals, setPendingApprovals] = useState({
    organizers: 0,
    events: 0,
    refunds: 0,
  });
  const [dateRange, setDateRange] = useState("30days");

  // Fetch dashboard data
  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        const mockData = {
          pendingApprovals: {
            organizers: 8,
            events: 12,
            refunds: 5,
          },
        };
        setPendingApprovals(mockData.pendingApprovals);
        setIsLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, [dateRange]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Layout
      pendingApprovals={pendingApprovals}
      dateRange={dateRange}
      setDateRange={setDateRange}
    >
      <Suspense fallback={<LoadingState />}>
        <Outlet />
      </Suspense>
    </Layout>
  );
}
