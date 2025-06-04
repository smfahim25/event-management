import { useNavigate } from "react-router-dom";
import { useSettingsStore } from "../../store/SettingsStore";
import PendingApprovalCard from "./PendingApprovalCard";
import StatsCard from "./StatsCard";
import { useState, useEffect, useRef } from "react";
import * as Chart from "chart.js";

Chart.Chart.register(
  Chart.CategoryScale,
  Chart.LinearScale,
  Chart.BarElement,
  Chart.BarController,
  Chart.DoughnutController,
  Chart.PieController,
  Chart.Title,
  Chart.Tooltip,
  Chart.Legend,
  Chart.ArcElement,
  Chart.LineElement,
  Chart.PointElement
);

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const { adminStats, fetchAdminStats } = useSettingsStore();
  const navigate = useNavigate();

  const overviewChartRef = useRef(null);
  const revenueChartRef = useRef(null);
  const eventStatusChartRef = useRef(null);
  const pendingApprovalsChartRef = useRef(null);

  const overviewChartInstance = useRef(null);
  const revenueChartInstance = useRef(null);
  const eventStatusChartInstance = useRef(null);
  const pendingApprovalsChartInstance = useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      await fetchAdminStats();
    };
    fetchDashboardData();
  }, [fetchAdminStats]);

  useEffect(() => {
    if (adminStats) {
      setDashboardData(adminStats);
    }
  }, [adminStats]);

  useEffect(() => {
    if (dashboardData) {
      if (overviewChartInstance.current)
        overviewChartInstance.current.destroy();
      if (revenueChartInstance.current) revenueChartInstance.current.destroy();
      if (eventStatusChartInstance.current)
        eventStatusChartInstance.current.destroy();
      if (pendingApprovalsChartInstance.current)
        pendingApprovalsChartInstance.current.destroy();

      if (overviewChartRef.current) {
        overviewChartInstance.current = new Chart.Chart(
          overviewChartRef.current,
          {
            type: "bar",
            data: {
              labels: [
                "Total Events",
                "Active Events",
                "Total Organizers",
                "Active Organizers",
                "Total Users",
              ],
              datasets: [
                {
                  label: "Count",
                  data: [
                    dashboardData.totalEvents || 0,
                    dashboardData.totalActiveEvents || 0,
                    dashboardData.totalOrganizers || 0,
                    dashboardData.activeOrganizers || 0,
                    dashboardData.totalUsers || 0,
                  ],
                  backgroundColor: [
                    "#4f46e5",
                    "#10B981",
                    "#F59E0B",
                    "#EF4444",
                    "#8B5CF6",
                  ],
                  borderColor: [
                    "#2563EB",
                    "#059669",
                    "#D97706",
                    "#DC2626",
                    "#7C3AED",
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: "Platform Overview",
                },
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          }
        );
      }

      if (revenueChartRef.current) {
        const totalRevenue = dashboardData.totalRevenue || 0;
        const commission = dashboardData.totalPlatformCommission || 0;
        const organizerRevenue = totalRevenue - commission;

        revenueChartInstance.current = new Chart.Chart(
          revenueChartRef.current,
          {
            type: "pie",
            data: {
              labels: ["Organizer Revenue", "Platform Commission"],
              datasets: [
                {
                  data: [organizerRevenue, commission],
                  backgroundColor: ["#10B981", "#4f46e5"],
                  borderColor: ["#059669", "#2563EB"],
                  borderWidth: 2,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: "Revenue Breakdown",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return (
                        context.label + ": $" + context.parsed.toLocaleString()
                      );
                    },
                  },
                },
              },
            },
          }
        );
      }

      if (eventStatusChartRef.current) {
        const activeEvents = dashboardData.totalActiveEvents || 0;
        const inactiveEvents = (dashboardData.totalEvents || 0) - activeEvents;

        eventStatusChartInstance.current = new Chart.Chart(
          eventStatusChartRef.current,
          {
            type: "doughnut",
            data: {
              labels: ["Active Events", "Inactive Events"],
              datasets: [
                {
                  data: [activeEvents, inactiveEvents],
                  backgroundColor: ["#10B981", "#EF4444"],
                  borderColor: ["#059669", "#DC2626"],
                  borderWidth: 2,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: "Event Status Distribution",
                },
              },
            },
          }
        );
      }

      if (pendingApprovalsChartRef.current) {
        pendingApprovalsChartInstance.current = new Chart.Chart(
          pendingApprovalsChartRef.current,
          {
            type: "bar",
            data: {
              labels: ["Organizer Approvals", "Event Approvals"],
              datasets: [
                {
                  label: "Pending Count",
                  data: [
                    dashboardData.pendingOrganizers || 0,
                    dashboardData.pendingEvents || 0,
                  ],
                  backgroundColor: ["#0acaf5", "#4f46e5"],
                  borderColor: ["#0acaf5", "#4f46e5"],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: "Pending Approvals",
                },
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            },
          }
        );
      }
    }

    return () => {
      if (overviewChartInstance.current)
        overviewChartInstance.current.destroy();
      if (revenueChartInstance.current) revenueChartInstance.current.destroy();
      if (eventStatusChartInstance.current)
        eventStatusChartInstance.current.destroy();
      if (pendingApprovalsChartInstance.current)
        pendingApprovalsChartInstance.current.destroy();
    };
  }, [dashboardData]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Events"
          value={dashboardData?.totalEvents}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
          footer={`${dashboardData?.totalActiveEvents} active events`}
        />

        <StatsCard
          title="Active Organizers"
          value={dashboardData?.activeOrganizers}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
          footer={`${dashboardData?.totalOrganizers} total organizers`}
        />

        <StatsCard
          title="Total Revenue"
          value={`$${dashboardData?.totalRevenue?.toFixed(2)}`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          footer={`$${dashboardData?.totalPlatformCommission?.toFixed(
            2
          )} commission`}
          footerColor="text-green-600"
        />

        <StatsCard
          title="Total Users"
          value={dashboardData?.totalUsers}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
          footer={
            <button
              onClick={() => navigate("/admin/users")}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all users
            </button>
          }
        />
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Overview Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div style={{ position: "relative", height: "300px" }}>
              <canvas ref={overviewChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div style={{ position: "relative", height: "300px" }}>
              <canvas ref={revenueChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Event Status Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div style={{ position: "relative", height: "300px" }}>
              <canvas ref={eventStatusChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Pending Approvals Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div style={{ position: "relative", height: "300px" }}>
              <canvas ref={pendingApprovalsChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="mt-8">
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          Pending Approvals
        </h2>
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <PendingApprovalCard
            title="Organizer Approvals"
            count={dashboardData?.pendingOrganizers}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />

          <PendingApprovalCard
            title="Event Approvals"
            count={dashboardData?.pendingEvents}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}
