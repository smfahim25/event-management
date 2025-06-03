import { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiCreditCard,
  FiDownload,
  FiMenu,
  FiX,
  FiPlus,
} from "react-icons/fi";
import StripeDashboard from "../../components/organization/StripeDashboard";
import EarningsSummary from "../../components/organization/OrganizationSummary";
import EventCard from "../../components/ui/EventCard";
import { useData } from "../../context/DataContext";
import { useEventStore } from "../../store/EventStore";
import AttendeeTable from "../../components/organization/AttendeeList";
import Nav from "../../components/Nav";
import { useBookingStore } from "../../store/BookingStore";
import RefundTable from "../../components/organization/RefundTable";
import { useNavigate } from "react-router-dom";

const OrganizerDashboard = () => {
  const { defaultTexts } = useData();
  const { profilePage } = defaultTexts;
  const [activeTab, setActiveTab] = useState("overview");
  const [isExporting, setIsExporting] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { events, fetchOrganizerEvents } = useEventStore();
  const { exportBookings, getOrganizerDashboard } = useBookingStore();

  const fetchCreatedEvents = async () => {
    try {
      await fetchOrganizerEvents();
    } catch (error) {
      console.error("Error fetching created events:", error);
    }
  };
  const fetchDashboardData = async () => {
    try {
      const data = await getOrganizerDashboard();
      setDashboardData(data?.data);
    } catch (error) {
      console.error("Error fetching created events:", error);
    }
  };

  useEffect(() => {
    fetchCreatedEvents();
    fetchDashboardData();
  }, []);

  const handleExportAttendees = async () => {
    setIsExporting(true);

    try {
      const blob = await exportBookings(
        selectedEvent === "all" ? "" : selectedEvent
      );

      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        a.download = "bookings.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="animate-pulse space-y-6 sm:space-y-8">
          <div className="h-8 bg-gray-200 rounded w-full sm:w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
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
    <div className="min-h-screen bg-gray-50 pb-8 sm:pb-12">
      {/* Dashboard Header */}
      <Nav />
      <div className="bg-white border-b mt-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Organizer Dashboard
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile menu button */}
              <button
                type="button"
                className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <FiX className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <FiMenu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>

              <div className="hidden sm:flex items-center space-x-4">
                <div className="relative">
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="all">All Events</option>
                    {events.map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.eventName}
                      </option>
                    ))}
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
                <div className="flex justify-center sm:justify-end mt-6 sm:mt-0">
                  <button
                    onClick={() => navigate("/app/create-event")}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white h-10 px-4 py-2"
                  >
                    <FiPlus className="mr-2 h-4 w-4" />
                    {profilePage.createEventButton || "Create Event"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filters */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b px-4 py-3 space-y-3">
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-medium text-gray-500">Event</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="all">All Events</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.eventName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportAttendees}
            disabled={isExporting}
            className={`w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm ${
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
          <div className="flex justify-center sm:justify-end mt-6 sm:mt-0">
            <button
              onClick={() => navigate("/app/create-event")}
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium shadow-sm  bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white h-10 px-4 py-2"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              {profilePage.createEventButton || "Create Event"}
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Tabs */}
      <div className="border-b bg-white overflow-x-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 sm:space-x-8">
            <button
              onClick={() => handleTabChange("overview")}
              className={`border-b-2 px-1 py-4 text-xs sm:text-sm font-medium whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => handleTabChange("payouts")}
              className={`border-b-2 px-1 py-4 text-xs sm:text-sm font-medium whitespace-nowrap ${
                activeTab === "payouts"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Payouts
            </button>
            <button
              onClick={() => handleTabChange("mytickets")}
              className={`border-b-2 px-1 py-4 text-xs sm:text-sm font-medium whitespace-nowrap ${
                activeTab === "mytickets"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              My Events
            </button>
            <button
              onClick={() => handleTabChange("attendee")}
              className={`border-b-2 px-1 py-4 text-xs sm:text-sm font-medium whitespace-nowrap ${
                activeTab === "attendee"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Attendees
            </button>
            <button
              onClick={() => handleTabChange("refund")}
              className={`border-b-2 px-1 py-4 text-xs sm:text-sm font-medium whitespace-nowrap ${
                activeTab === "refund"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Refund requests
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {activeTab === "overview" && (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-4 sm:p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiDollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                    </div>
                    <div className="ml-3 sm:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                          Total Revenue
                        </dt>
                        <dd>
                          <div className="text-base sm:text-lg font-medium text-gray-900">
                            ${dashboardData?.grossRevenue}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 sm:px-5 py-2 sm:py-3">
                  <div className="text-xs sm:text-sm">
                    <span className="font-medium text-gray-500">
                      Net: ${dashboardData?.netEarnings?.toFixed(2)} (after
                      fees)
                    </span>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-4 sm:p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiCalendar className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                    </div>
                    <div className="ml-3 sm:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                          Tickets Sold
                        </dt>
                        <dd>
                          <div className="text-base sm:text-lg font-medium text-gray-900">
                            {dashboardData?.totalTicketsSold}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-4 sm:p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiTrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                    </div>
                    <div className="ml-3 sm:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                          Total Bookings
                        </dt>
                        <dd>
                          <div className="text-base sm:text-lg font-medium text-gray-900">
                            {dashboardData.totalBookings}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 sm:px-5 py-2 sm:py-3">
                  <div className="text-xs sm:text-sm">
                    <span className="font-medium text-gray-500">
                      page visitors who purchased
                    </span>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-4 sm:p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiCreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                    </div>
                    <div className="ml-3 sm:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                          Refund Rate
                        </dt>
                        <dd>
                          <div className="text-base sm:text-lg font-medium text-gray-900">
                            {dashboardData?.refundRate}%
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 sm:px-5 py-4 sm:py-3">
                  <div className="text-xs sm:text-sm">
                    <button className="font-medium text-gray-500 ">
                      Of refund policies
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Summary */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-medium leading-6 text-gray-900">
                  Earnings Summary
                </h3>
              </div>
              <div className="p-4 sm:p-6">
                <EarningsSummary data={dashboardData} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "payouts" && (
          <div className="space-y-6 sm:space-y-8">
            <StripeDashboard />
          </div>
        )}

        {activeTab === "mytickets" && (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <p className="text-sm text-muted-foreground">
                Events you have created
              </p>
            </div>
            <div className="p-6 pt-0">
              {events.length > 0 ? (
                <div className="flex flex-wrap gap-5 items-center">
                  {events.map((event) => (
                    <EventCard key={event._id} {...event} />
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg bg-gray-50">
                  <p className="text-center text-gray-500">
                    {profilePage.eventsSection?.noEvents ||
                      "You haven't created any events yet."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "attendee" && (
          <div className="space-y-6 sm:space-y-8">
            <AttendeeTable eventId={selectedEvent} />
          </div>
        )}
        {activeTab === "refund" && (
          <div className="space-y-6 sm:space-y-8">
            <RefundTable eventId={selectedEvent} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
