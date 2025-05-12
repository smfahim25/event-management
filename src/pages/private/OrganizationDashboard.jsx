import { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiCreditCard,
  FiDownload,
} from "react-icons/fi";
import RefundPolicyManager from "../../components/organization/RefundPolicy";
import StripeDashboard from "../../components/organization/StripeDashboard";
import EarningsSummary from "../../components/organization/OrganizationSummary";

const OrganizerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("7days");
  const [isExporting, setIsExporting] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [events, setEvents] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = () => {
      // Mock data
      const mockEvents = [
        { id: "event1", name: "Tech Conference 2025" },
        { id: "event2", name: "Music Festival" },
        { id: "event3", name: "Art Exhibition" },
      ];

      const mockDashboardData = {
        totalSales: 156,
        totalRevenue: 8750.5,
        platformFee: 875.05, // 10% of revenue
        netEarnings: 7875.45,
        ticketsSold: 243,
        averageTicketPrice: 36.01,
        conversionRate: 68.5,
        refundRate: 3.2,
      };

      setEvents(mockEvents);
      setDashboardData(mockDashboardData);
    };

    fetchDashboardData();
  }, [dateRange, selectedEvent]);

  // Handle export attendee list
  const handleExportAttendees = () => {
    setIsExporting(true);

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      alert("Attendee list exported successfully!");
    }, 1500);
  };

  // Handle save refund policies
  const handleSaveRefundPolicies = (policies) => {
    console.log("Saving refund policies:", policies);
    alert("Refund policies saved successfully!");
  };

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Dashboard Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Organizer Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="all">All Events</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="year">This Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>
              <button
                onClick={handleExportAttendees}
                disabled={isExporting}
                className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-sm ${
                  isExporting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {isExporting ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <FiDownload className="mr-2 h-4 w-4" />
                    Export Attendees
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === "overview"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("earnings")}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === "earnings"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Earnings
            </button>
            <button
              onClick={() => setActiveTab("payouts")}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === "payouts"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Payouts
            </button>
            <button
              onClick={() => setActiveTab("refunds")}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === "refunds"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Refund Policies
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Revenue Card */}
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiDollarSign className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Revenue
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            ${dashboardData.totalRevenue.toFixed(2)}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-gray-500">
                      Net: ${dashboardData.netEarnings.toFixed(2)} (after fees)
                    </span>
                  </div>
                </div>
              </div>

              {/* Tickets Sold Card */}
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiCalendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Tickets Sold
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {dashboardData.ticketsSold}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-gray-500">
                      Avg. ${dashboardData.averageTicketPrice.toFixed(2)} per
                      ticket
                    </span>
                  </div>
                </div>
              </div>

              {/* Conversion Rate Card */}
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiTrendingUp className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Conversion Rate
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {dashboardData.conversionRate}%
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-gray-500">
                      Of page visitors who purchased
                    </span>
                  </div>
                </div>
              </div>

              {/* Refund Rate Card */}
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiCreditCard className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Refund Rate
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {dashboardData.refundRate}%
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <button
                      onClick={() => setActiveTab("refunds")}
                      className="font-medium text-purple-600 hover:text-purple-900"
                    >
                      Manage refund policies
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Summary */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Earnings Summary
                </h3>
              </div>
              <div className="p-6">
                <EarningsSummary eventId={selectedEvent} />
              </div>
            </div>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === "earnings" && (
          <div className="space-y-8">
            <EarningsSummary eventId={selectedEvent} />
          </div>
        )}

        {/* Payouts Tab */}
        {activeTab === "payouts" && (
          <div className="space-y-8">
            <StripeDashboard />
          </div>
        )}

        {/* Refund Policies Tab */}
        {activeTab === "refunds" && (
          <div className="space-y-8">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Refund Policy Management
                </h3>
              </div>
              <div className="p-6">
                <RefundPolicyManager
                  eventId={selectedEvent}
                  onSave={handleSaveRefundPolicies}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
