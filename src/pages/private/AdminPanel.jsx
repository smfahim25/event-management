import { useState, useEffect } from "react";
import {
  FiHome,
  FiUsers,
  FiCheckSquare,
  FiCalendar,
  FiPercent,
  FiMessageSquare,
  FiDollarSign,
  FiFileText,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiFilter,
  FiAlertCircle,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [dateRange, setDateRange] = useState("30days");
  const [pendingApprovals, setPendingApprovals] = useState({
    organizers: 0,
    events: 0,
    refunds: 0,
  });

  // Fetch dashboard data
  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        const mockData = {
          totalEvents: 1248,
          activeEvents: 356,
          totalOrganizers: 412,
          activeOrganizers: 287,
          totalUsers: 15642,
          totalRevenue: 124850.75,
          platformCommission: 6242.54,
          recentEvents: [
            {
              id: "evt1",
              name: "Tech Conference 2025",
              organizer: "TechCorp Inc.",
              status: "active",
              sales: 342,
            },
            {
              id: "evt2",
              name: "Summer Music Festival",
              organizer: "Melody Productions",
              status: "active",
              sales: 1205,
            },
            {
              id: "evt3",
              name: "Business Workshop",
              organizer: "Growth Hackers",
              status: "pending",
              sales: 0,
            },
            {
              id: "evt4",
              name: "Art Exhibition",
              organizer: "Creative Minds",
              status: "active",
              sales: 89,
            },
          ],
          pendingApprovals: {
            organizers: 8,
            events: 12,
            refunds: 5,
          },
          revenueByMonth: [
            { month: "Jan", revenue: 4250.5, commission: 212.53 },
            { month: "Feb", revenue: 5120.75, commission: 256.04 },
            { month: "Mar", revenue: 6840.25, commission: 342.01 },
            { month: "Apr", revenue: 8750.0, commission: 437.5 },
            { month: "May", revenue: 12540.8, commission: 627.04 },
            { month: "Jun", revenue: 15780.45, commission: 789.02 },
          ],
        };
        setDashboardData(mockData);
        setPendingApprovals(mockData.pendingApprovals);
        setIsLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, [dateRange]);

  // Handle section change
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="animate-pulse space-y-6 sm:space-y-8">
          <div className="h-8 bg-gray-200 rounded w-full sm:w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <FiX className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <FiMenu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">
                  EventAdmin
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <div className="relative">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                    <option value="year">This Year</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
                <div className="ml-3 relative">
                  <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">View notifications</span>
                    <div className="relative">
                      <FiAlertCircle className="h-6 w-6" />
                      {pendingApprovals.organizers +
                        pendingApprovals.events +
                        pendingApprovals.refunds >
                        0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {pendingApprovals.organizers +
                            pendingApprovals.events +
                            pendingApprovals.refunds}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Admin profile"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                      Admin User
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                <button
                  onClick={() => handleSectionChange("dashboard")}
                  className={`${
                    activeSection === "dashboard"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <FiHome
                    className={`${
                      activeSection === "dashboard"
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  Dashboard
                </button>

                <button
                  onClick={() => handleSectionChange("users")}
                  className={`${
                    activeSection === "users"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <FiUsers
                    className={`${
                      activeSection === "users"
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  User Management
                </button>

                <button
                  onClick={() => handleSectionChange("organizers")}
                  className={`${
                    activeSection === "organizers"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <FiCheckSquare
                    className={`${
                      activeSection === "organizers"
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  <span className="flex-1">Organizer Approvals</span>
                  {pendingApprovals.organizers > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                      {pendingApprovals.organizers}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleSectionChange("events")}
                  className={`${
                    activeSection === "events"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <FiCalendar
                    className={`${
                      activeSection === "events"
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  <span className="flex-1">Event Approvals</span>
                  {pendingApprovals.events > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                      {pendingApprovals.events}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleSectionChange("commission")}
                  className={`${
                    activeSection === "commission"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <FiPercent
                    className={`${
                      activeSection === "commission"
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  Commission Settings
                </button>

                <button
                  onClick={() => handleSectionChange("messaging")}
                  className={`${
                    activeSection === "messaging"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <FiMessageSquare
                    className={`${
                      activeSection === "messaging"
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  Messaging
                </button>

                <button
                  onClick={() => handleSectionChange("refunds")}
                  className={`${
                    activeSection === "refunds"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <FiDollarSign
                    className={`${
                      activeSection === "refunds"
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  <span className="flex-1">Refund Resolution</span>
                  {pendingApprovals.refunds > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                      {pendingApprovals.refunds}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleSectionChange("content")}
                  className={`${
                    activeSection === "content"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <FiFileText
                    className={`${
                      activeSection === "content"
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  Content Management
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <FiX className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <h1 className="text-xl font-bold text-indigo-600">
                    EventAdmin
                  </h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  <button
                    onClick={() => handleSectionChange("dashboard")}
                    className={`${
                      activeSection === "dashboard"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
                  >
                    <FiHome
                      className={`${
                        activeSection === "dashboard"
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-4 flex-shrink-0 h-6 w-6`}
                    />
                    Dashboard
                  </button>

                  <button
                    onClick={() => handleSectionChange("users")}
                    className={`${
                      activeSection === "users"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
                  >
                    <FiUsers
                      className={`${
                        activeSection === "users"
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-4 flex-shrink-0 h-6 w-6`}
                    />
                    User Management
                  </button>

                  <button
                    onClick={() => handleSectionChange("organizers")}
                    className={`${
                      activeSection === "organizers"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
                  >
                    <FiCheckSquare
                      className={`${
                        activeSection === "organizers"
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-4 flex-shrink-0 h-6 w-6`}
                    />
                    <span className="flex-1">Organizer Approvals</span>
                    {pendingApprovals.organizers > 0 && (
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                        {pendingApprovals.organizers}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleSectionChange("events")}
                    className={`${
                      activeSection === "events"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
                  >
                    <FiCalendar
                      className={`${
                        activeSection === "events"
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-4 flex-shrink-0 h-6 w-6`}
                    />
                    <span className="flex-1">Event Approvals</span>
                    {pendingApprovals.events > 0 && (
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                        {pendingApprovals.events}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleSectionChange("commission")}
                    className={`${
                      activeSection === "commission"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
                  >
                    <FiPercent
                      className={`${
                        activeSection === "commission"
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-4 flex-shrink-0 h-6 w-6`}
                    />
                    Commission Settings
                  </button>

                  <button
                    onClick={() => handleSectionChange("messaging")}
                    className={`${
                      activeSection === "messaging"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
                  >
                    <FiMessageSquare
                      className={`${
                        activeSection === "messaging"
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-4 flex-shrink-0 h-6 w-6`}
                    />
                    Messaging
                  </button>

                  <button
                    onClick={() => handleSectionChange("refunds")}
                    className={`${
                      activeSection === "refunds"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
                  >
                    <FiDollarSign
                      className={`${
                        activeSection === "refunds"
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-4 flex-shrink-0 h-6 w-6`}
                    />
                    <span className="flex-1">Refund Resolution</span>
                    {pendingApprovals.refunds > 0 && (
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                        {pendingApprovals.refunds}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleSectionChange("content")}
                    className={`${
                      activeSection === "content"
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
                  >
                    <FiFileText
                      className={`${
                        activeSection === "content"
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-4 flex-shrink-0 h-6 w-6`}
                    />
                    Content Management
                  </button>
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Admin profile"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-700">
                      Admin User
                    </p>
                    <p className="text-sm font-medium text-gray-500">
                      admin@example.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Dashboard Section */}
              {activeSection === "dashboard" && (
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Dashboard
                  </h1>

                  {/* Stats Cards */}
                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Events Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <FiCalendar className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Total Events
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">
                                  {dashboardData.totalEvents}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                          <span className="font-medium text-indigo-600">
                            {dashboardData.activeEvents} active events
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Active Organizers Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <FiUsers className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Active Organizers
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">
                                  {dashboardData.activeOrganizers}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                          <span className="font-medium text-indigo-600">
                            {dashboardData.totalOrganizers} total organizers
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Total Revenue Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
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
                          <span className="font-medium text-green-600">
                            ${dashboardData.platformCommission.toFixed(2)}{" "}
                            commission
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Total Users Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <FiUsers className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Total Users
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">
                                  {dashboardData.totalUsers}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                          <button
                            onClick={() => handleSectionChange("users")}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View all users
                          </button>
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
                      <div
                        className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSectionChange("organizers")}
                      >
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                              <FiCheckSquare className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="ml-5">
                              <div className="text-xl font-medium text-gray-900">
                                {pendingApprovals.organizers}
                              </div>
                              <div className="text-sm text-gray-500">
                                Organizer Approvals
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSectionChange("events")}
                      >
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                              <FiCalendar className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="ml-5">
                              <div className="text-xl font-medium text-gray-900">
                                {pendingApprovals.events}
                              </div>
                              <div className="text-sm text-gray-500">
                                Event Approvals
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSectionChange("refunds")}
                      >
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                              <FiDollarSign className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="ml-5">
                              <div className="text-xl font-medium text-gray-900">
                                {pendingApprovals.refunds}
                              </div>
                              <div className="text-sm text-gray-500">
                                Refund Requests
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Chart */}
                  <div className="mt-8">
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Revenue Overview
                        </h3>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <div className="h-80">
                          <div className="relative h-full">
                            {/* Y-axis labels */}
                            <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-xs text-gray-500 py-2">
                              <span>$0</span>
                              <span>
                                $
                                {Math.round(
                                  Math.max(
                                    ...dashboardData.revenueByMonth.map(
                                      (d) => d.revenue
                                    )
                                  ) / 2
                                )}
                              </span>
                              <span>
                                $
                                {Math.round(
                                  Math.max(
                                    ...dashboardData.revenueByMonth.map(
                                      (d) => d.revenue
                                    )
                                  )
                                )}
                              </span>
                            </div>

                            {/* Chart area */}
                            <div className="absolute inset-0 ml-12">
                              {/* Horizontal grid lines */}
                              <div className="absolute inset-0 flex flex-col justify-between">
                                <div className="border-t border-gray-200 h-0"></div>
                                <div className="border-t border-gray-200 h-0"></div>
                                <div className="border-t border-gray-200 h-0"></div>
                              </div>

                              {/* Bars */}
                              <div className="absolute inset-0 flex items-end justify-around">
                                {dashboardData.revenueByMonth.map(
                                  (month, index) => {
                                    const maxRevenue = Math.max(
                                      ...dashboardData.revenueByMonth.map(
                                        (d) => d.revenue
                                      )
                                    );
                                    const revenueHeight =
                                      (month.revenue / maxRevenue) * 100;
                                    const commissionHeight =
                                      (month.commission / maxRevenue) * 100;

                                    return (
                                      <div
                                        key={index}
                                        className="flex flex-col items-center"
                                      >
                                        <div className="relative w-12 sm:w-16 flex items-end">
                                          {/* Revenue bar (background) */}
                                          <div
                                            className="absolute w-8 sm:w-12 bg-indigo-200 rounded-t"
                                            style={{
                                              height: `${revenueHeight}%`,
                                            }}
                                          ></div>
                                          {/* Commission bar (foreground) */}
                                          <div
                                            className="absolute w-8 sm:w-12 bg-indigo-600 rounded-t"
                                            style={{
                                              height: `${commissionHeight}%`,
                                            }}
                                          ></div>
                                        </div>
                                        <span className="mt-1 text-xs text-gray-500">
                                          {month.month}
                                        </span>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-center space-x-6">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-indigo-600 rounded-sm mr-2"></div>
                            <span className="text-xs text-gray-600">
                              Platform Commission
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-indigo-200 rounded-sm mr-2"></div>
                            <span className="text-xs text-gray-600">
                              Total Revenue
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Events */}
                  <div className="mt-8">
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Recent Events
                        </h3>
                        <button
                          onClick={() => handleSectionChange("events")}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          View all
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Event Name
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Organizer
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Status
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Tickets Sold
                              </th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {dashboardData.recentEvents.map((event) => (
                              <tr key={event.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {event.name}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    {event.organizer}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      event.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : event.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {event.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {event.sales}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <a
                                    href="#"
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    View
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* User Management Section */}
              {activeSection === "users" && (
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    User Management
                  </h1>
                  <div className="mt-6 bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          All Users
                        </h3>
                        <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:space-x-3">
                          <div className="flex rounded-md shadow-sm">
                            <div className="relative flex-grow focus-within:z-10">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md pl-10 sm:text-sm border-gray-300"
                                placeholder="Search users..."
                              />
                            </div>
                          </div>
                          <div className="mt-3 sm:mt-0">
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <FiFilter className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                              Filter
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Email
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Role
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Joined
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {/* Sample user data */}
                          {[
                            {
                              id: 1,
                              name: "Jane Cooper",
                              email: "jane.cooper@example.com",
                              status: "active",
                              role: "User",
                              joined: "Jan 10, 2025",
                              image:
                                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
                            },
                            {
                              id: 2,
                              name: "Michael Foster",
                              email: "michael.foster@example.com",
                              status: "active",
                              role: "Organizer",
                              joined: "Feb 15, 2025",
                              image:
                                "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
                            },
                            {
                              id: 3,
                              name: "Dries Vincent",
                              email: "dries.vincent@example.com",
                              status: "inactive",
                              role: "User",
                              joined: "Mar 5, 2025",
                              image:
                                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
                            },
                            {
                              id: 4,
                              name: "Lindsay Walton",
                              email: "lindsay.walton@example.com",
                              status: "active",
                              role: "Admin",
                              joined: "Apr 20, 2025",
                              image:
                                "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
                            },
                            {
                              id: 5,
                              name: "Courtney Henry",
                              email: "courtney.henry@example.com",
                              status: "blocked",
                              role: "User",
                              joined: "May 8, 2025",
                              image:
                                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
                            },
                          ].map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={user.image || "/placeholder.svg"}
                                      alt=""
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    user.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : user.status === "inactive"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.role}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.joined}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a
                                  href="#"
                                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                                >
                                  Edit
                                </a>
                                <a
                                  href="#"
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Block
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <a
                          href="#"
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Previous
                        </a>
                        <a
                          href="#"
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Next
                        </a>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to{" "}
                            <span className="font-medium">5</span> of{" "}
                            <span className="font-medium">20</span> results
                          </p>
                        </div>
                        <div>
                          <nav
                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                            aria-label="Pagination"
                          >
                            <a
                              href="#"
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                              <span className="sr-only">Previous</span>
                              <FiChevronDown className="h-5 w-5 transform rotate-90" />
                            </a>
                            <a
                              href="#"
                              aria-current="page"
                              className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                              1
                            </a>
                            <a
                              href="#"
                              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                              2
                            </a>
                            <a
                              href="#"
                              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
                            >
                              3
                            </a>
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                            <a
                              href="#"
                              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                              8
                            </a>
                            <a
                              href="#"
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                              <span className="sr-only">Next</span>
                              <FiChevronUp className="h-5 w-5 transform rotate-90" />
                            </a>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Organizer Approvals Section */}
              {activeSection === "organizers" && (
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Organizer Approvals
                  </h1>
                  <div className="mt-6 bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Pending Organizer Applications
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Review and approve organizer applications before they
                        can create events.
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Organizer
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Business Name
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Application Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Documents
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {/* Sample organizer applications */}
                          {[
                            {
                              id: 1,
                              name: "John Smith",
                              email: "john@techevents.com",
                              business: "Tech Events Inc.",
                              date: "May 10, 2025",
                              documents: 3,
                              image:
                                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
                            },
                            {
                              id: 2,
                              name: "Sarah Johnson",
                              email: "sarah@musicfest.com",
                              business: "Music Festival Productions",
                              date: "May 11, 2025",
                              documents: 2,
                              image:
                                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
                            },
                            {
                              id: 3,
                              name: "Robert Chen",
                              email: "robert@artgallery.com",
                              business: "Modern Art Gallery",
                              date: "May 12, 2025",
                              documents: 4,
                              image:
                                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
                            },
                          ].map((organizer) => (
                            <tr key={organizer.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={
                                        organizer.image || "/placeholder.svg"
                                      }
                                      alt=""
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {organizer.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {organizer.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {organizer.business}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {organizer.date}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button className="text-indigo-600 hover:text-indigo-900">
                                  View {organizer.documents} documents
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium mr-2">
                                  Approve
                                </button>
                                <button className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                                  Reject
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Event Approvals Section */}
              {activeSection === "events" && (
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Event Approvals
                  </h1>
                  <div className="mt-6 bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Pending Event Approvals
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Review and approve events before they are published to
                        the platform.
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Event
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Organizer
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Location
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Submitted
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {/* Sample event applications */}
                          {[
                            {
                              id: 1,
                              name: "Tech Conference 2025",
                              organizer: "Tech Events Inc.",
                              date: "June 15-17, 2025",
                              location: "San Francisco, CA",
                              submitted: "May 10, 2025",
                              image: "/placeholder.svg?height=100&width=200",
                            },
                            {
                              id: 2,
                              name: "Summer Music Festival",
                              organizer: "Music Festival Productions",
                              date: "July 4-6, 2025",
                              location: "Austin, TX",
                              submitted: "May 11, 2025",
                              image: "/placeholder.svg?height=100&width=200",
                            },
                            {
                              id: 3,
                              name: "Modern Art Exhibition",
                              organizer: "Modern Art Gallery",
                              date: "August 1-30, 2025",
                              location: "New York, NY",
                              submitted: "May 12, 2025",
                              image: "/placeholder.svg?height=100&width=200",
                            },
                          ].map((event) => (
                            <tr key={event.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-16 w-24">
                                    <img
                                      className="h-16 w-24 rounded object-cover"
                                      src={event.image || "/placeholder.svg"}
                                      alt=""
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {event.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {event.organizer}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {event.date}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {event.location}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {event.submitted}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                  View Details
                                </button>
                                <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium mr-2">
                                  Approve
                                </button>
                                <button className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                                  Reject
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Commission Settings Section */}
              {activeSection === "commission" && (
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Commission Settings
                  </h1>
                  <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Global Commission Settings */}
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Global Commission Rate
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Set the default commission rate for all events on the
                          platform.
                        </p>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label
                              htmlFor="commission-rate"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Default Commission Rate (%)
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <input
                                type="number"
                                name="commission-rate"
                                id="commission-rate"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                                placeholder="5.00"
                                defaultValue="5.00"
                                step="0.01"
                                min="0"
                                max="100"
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                  %
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Special Commission Rates */}
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Special Commission Rates
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Set custom commission rates for specific organizers or
                          events.
                        </p>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="organizer"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Organizer or Event
                            </label>
                            <select
                              id="organizer"
                              name="organizer"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                              <option value="">
                                Select an organizer or event
                              </option>
                              <option value="org1">Tech Events Inc.</option>
                              <option value="org2">
                                Music Festival Productions
                              </option>
                              <option value="org3">Modern Art Gallery</option>
                              <option value="evt1">Tech Conference 2025</option>
                              <option value="evt2">
                                Summer Music Festival
                              </option>
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="special-rate"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Special Commission Rate (%)
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <input
                                type="number"
                                name="special-rate"
                                id="special-rate"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                                placeholder="3.00"
                                step="0.01"
                                min="0"
                                max="100"
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                  %
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Add Special Rate
                            </button>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-700">
                            Current Special Rates
                          </h4>
                          <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                  >
                                    Name
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                  >
                                    Type
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                  >
                                    Rate
                                  </th>
                                  <th
                                    scope="col"
                                    className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                  >
                                    <span className="sr-only">Actions</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                <tr>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    Tech Events Inc.
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    Organizer
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    3.5%
                                  </td>
                                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <a
                                      href="#"
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      Edit
                                    </a>
                                    <span className="text-gray-500 mx-1">
                                      |
                                    </span>
                                    <a
                                      href="#"
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Remove
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    Summer Music Festival
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    Event
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    4.0%
                                  </td>
                                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <a
                                      href="#"
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      Edit
                                    </a>
                                    <span className="text-gray-500 mx-1">
                                      |
                                    </span>
                                    <a
                                      href="#"
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Remove
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Messaging Section */}
              {activeSection === "messaging" && (
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Messaging & Announcements
                  </h1>
                  <div className="mt-6 bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Send Platform Announcement
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Send messages to all users, organizers, or specific
                        groups.
                      </p>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <div className="space-y-6">
                        <div>
                          <label
                            htmlFor="recipient-type"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Recipients
                          </label>
                          <select
                            id="recipient-type"
                            name="recipient-type"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="all">All Users</option>
                            <option value="organizers">All Organizers</option>
                            <option value="attendees">All Attendees</option>
                            <option value="event">
                              Specific Event Attendees
                            </option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="subject"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Subject
                          </label>
                          <input
                            type="text"
                            name="subject"
                            id="subject"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="Announcement Subject"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Message
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="message"
                              name="message"
                              rows={6}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              placeholder="Enter your message here..."
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="send-email"
                            name="send-email"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="send-email"
                            className="ml-2 block text-sm text-gray-900"
                          >
                            Also send as email
                          </label>
                        </div>

                        <div>
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Send Announcement
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Recent Announcements
                      </h3>
                    </div>
                    <div className="overflow-hidden">
                      <ul className="divide-y divide-gray-200">
                        <li>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-indigo-600 truncate">
                                Platform Update: New Features
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  All Users
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="text-sm text-gray-500">
                                  We&apos;ve added new features to the platform,
                                  including improved ticket scanning and
                                  analytics.
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <p>Sent on May 10, 2025</p>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-indigo-600 truncate">
                                Important: Commission Structure Update
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Organizers
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="text-sm text-gray-500">
                                  We&apos;re updating our commission structure
                                  effective June 1, 2025. Please review the
                                  changes.
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <p>Sent on May 5, 2025</p>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Refund Resolution Section */}
              {activeSection === "refunds" && (
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Refund Conflict Resolution
                  </h1>
                  <div className="mt-6 bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Pending Refund Requests
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Review and resolve refund disputes between attendees and
                        organizers.
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Attendee
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Event
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Ticket Price
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Request Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Reason
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {/* Sample refund requests */}
                          {[
                            {
                              id: 1,
                              attendee: "Michael Brown",
                              email: "michael@example.com",
                              event: "Tech Conference 2025",
                              price: "$199.00",
                              date: "May 10, 2025",
                              reason: "Unable to attend due to illness",
                              image:
                                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
                            },
                            {
                              id: 2,
                              attendee: "Emily Davis",
                              email: "emily@example.com",
                              event: "Summer Music Festival",
                              price: "$150.00",
                              date: "May 11, 2025",
                              reason:
                                "Event date changed, can't attend new date",
                              image:
                                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
                            },
                            {
                              id: 3,
                              attendee: "David Wilson",
                              email: "david@example.com",
                              event: "Business Workshop",
                              price: "$299.00",
                              date: "May 12, 2025",
                              reason:
                                "Workshop content changed significantly from description",
                              image:
                                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
                            },
                          ].map((request) => (
                            <tr key={request.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={request.image || "/placeholder.svg"}
                                      alt=""
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {request.attendee}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {request.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {request.event}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {request.price}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {request.date}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-500">
                                  {request.reason}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                  View Details
                                </button>
                                <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium mr-2">
                                  Approve
                                </button>
                                <button className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                                  Deny
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Management Section */}
              {activeSection === "content" && (
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Content Management
                  </h1>
                  <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* FAQs */}
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          FAQs
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Manage frequently asked questions for the platform.
                        </p>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="faq-question"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Question
                            </label>
                            <input
                              type="text"
                              name="faq-question"
                              id="faq-question"
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              placeholder="Enter FAQ question"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="faq-answer"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Answer
                            </label>
                            <textarea
                              id="faq-answer"
                              name="faq-answer"
                              rows={4}
                              className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              placeholder="Enter FAQ answer"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="faq-category"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Category
                            </label>
                            <select
                              id="faq-category"
                              name="faq-category"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                              <option value="general">General</option>
                              <option value="tickets">Tickets</option>
                              <option value="refunds">Refunds</option>
                              <option value="organizers">For Organizers</option>
                            </select>
                          </div>
                          <div>
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Add FAQ
                            </button>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-700">
                            Current FAQs
                          </h4>
                          <div className="mt-2 space-y-4">
                            <div className="border border-gray-200 rounded-md p-4">
                              <div className="flex justify-between">
                                <h5 className="text-sm font-medium text-gray-900">
                                  How do I get a refund?
                                </h5>
                                <div>
                                  <button className="text-indigo-600 hover:text-indigo-900 text-sm mr-2">
                                    Edit
                                  </button>
                                  <button className="text-red-600 hover:text-red-900 text-sm">
                                    Delete
                                  </button>
                                </div>
                              </div>
                              <p className="mt-2 text-sm text-gray-500">
                                Refunds are processed according to each
                                event&apos;s refund policy. You can request a
                                refund from your order history page.
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                Category: Refunds
                              </p>
                            </div>
                            <div className="border border-gray-200 rounded-md p-4">
                              <div className="flex justify-between">
                                <h5 className="text-sm font-medium text-gray-900">
                                  How do I create an event?
                                </h5>
                                <div>
                                  <button className="text-indigo-600 hover:text-indigo-900 text-sm mr-2">
                                    Edit
                                  </button>
                                  <button className="text-red-600 hover:text-red-900 text-sm">
                                    Delete
                                  </button>
                                </div>
                              </div>
                              <p className="mt-2 text-sm text-gray-500">
                                To create an event, you need to register as an
                                organizer. Once approved, you can create events
                                from your organizer dashboard.
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                Category: For Organizers
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Legal Documents */}
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Legal Documents
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Manage terms of service, privacy policy, and other
                          legal content.
                        </p>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="document-type"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Document Type
                            </label>
                            <select
                              id="document-type"
                              name="document-type"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                              <option value="terms">Terms of Service</option>
                              <option value="privacy">Privacy Policy</option>
                              <option value="refund">Refund Policy</option>
                              <option value="cookies">Cookie Policy</option>
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="document-content"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Content
                            </label>
                            <textarea
                              id="document-content"
                              name="document-content"
                              rows={10}
                              className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              placeholder="Enter document content"
                              defaultValue="Terms of Service for Event Platform

Last Updated: May 1, 2025

1. Introduction
Welcome to our event platform. By using our services, you agree to these Terms of Service.

2. User Accounts
You are responsible for maintaining the security of your account.

3. Events and Tickets
All events are subject to the organizer's terms and conditions."
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <label
                                htmlFor="effective-date"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Effective Date
                              </label>
                              <input
                                type="date"
                                name="effective-date"
                                id="effective-date"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Update Document
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-700">
                            Document History
                          </h4>
                          <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                  >
                                    Document
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                  >
                                    Last Updated
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                  >
                                    By
                                  </th>
                                  <th
                                    scope="col"
                                    className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                  >
                                    <span className="sr-only">Actions</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                <tr>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    Terms of Service
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    May 1, 2025
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    Admin User
                                  </td>
                                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <a
                                      href="#"
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      View
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    Privacy Policy
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    April 15, 2025
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    Admin User
                                  </td>
                                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <a
                                      href="#"
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      View
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    Refund Policy
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    March 20, 2025
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    Admin User
                                  </td>
                                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <a
                                      href="#"
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      View
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
