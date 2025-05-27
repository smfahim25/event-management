import { useNavigate } from "react-router-dom";
import { useSettingsStore } from "../../store/SettingsStore";
import PendingApprovalCard from "./PendingApprovalCard";
import StatsCard from "./StatsCard";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const { adminStats, fetchAdminStats } = useSettingsStore();
  const navigate = useNavigate();

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
