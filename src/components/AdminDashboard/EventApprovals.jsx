import { useState, useEffect } from "react";
import { useEventStore } from "../../store/EventStore";
import EventApprovalModal from "./EventApprovalModal";
import EventDetailsModal from "./EventDetailsModal";
import { useNavigate } from "react-router-dom";

export default function EventApprovals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [organizerFilter, setOrganizerFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isSpecialCommissionFilter, setIsSpecialCommissionFilter] =
    useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [sort] = useState("eventDate");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [initialStatus, setInitialStatus] = useState("approved");

  const navigate = useNavigate();

  const { events, loading, fetchAdminEvents, updateEventStatus } =
    useEventStore();

  useEffect(() => {
    fetchAdminEvents({
      searchTerm,
      page,
      limit,
      sort,
      status: statusFilter,
      isSpecialCommision:
        isSpecialCommissionFilter === ""
          ? undefined
          : isSpecialCommissionFilter === "true",
    });
  }, [
    searchTerm,
    statusFilter,
    page,
    limit,
    sort,
    isSpecialCommissionFilter,
    fetchAdminEvents,
  ]);

  const organizers = [
    ...new Set(events.map((event) => event?.organizerId?.name || "")),
  ].filter(Boolean);

  const locations = [
    ...new Set(events.map((event) => event.venue?.address?.city || "")),
  ].filter(Boolean);

  const dateRanges = [
    ...new Set(
      events.map((event) => {
        if (!event.eventDate) return "";
        const date = new Date(event.eventDate);
        return date.toLocaleDateString();
      })
    ),
  ].filter(Boolean);

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending-approval", label: "Pending Approval" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const specialCommissionOptions = [
    { value: "", label: "All Commission Types" },
    { value: "true", label: "Special Commission" },
    { value: "false", label: "Standard Commission" },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchTerm === "" ||
      event.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue?.address?.city
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesOrganizer =
      organizerFilter === "" || event.organizer?.name === organizerFilter;

    const matchesLocation =
      locationFilter === "" || event.venue?.address?.city === locationFilter;

    const matchesDateRange = (() => {
      if (dateRangeFilter === "") return true;
      if (!event.eventDate) return false;
      const eventDate = new Date(event.eventDate).toLocaleDateString();
      return eventDate === dateRangeFilter;
    })();

    const matchesStatus = statusFilter === "" || event.status === statusFilter;

    // const matchesSpecialCommission = (() => {
    //   if (isSpecialCommissionFilter === "") return true;
    //   if (isSpecialCommissionFilter === "true")
    //     return event.isSpecialCommission === true;
    //   if (isSpecialCommissionFilter === "false")
    //     return event.isSpecialCommission === false;
    //   return true;
    // })();

    return (
      matchesSearch &&
      matchesOrganizer &&
      matchesLocation &&
      matchesDateRange &&
      matchesStatus
      //  &&
      // matchesSpecialCommission
    );
  });

  const openModal = (event, status) => {
    setSelectedEvent(event);
    setInitialStatus(status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const openEventDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleApprove = async (eventId) => {
    await updateEventStatus(eventId, { status: "approved" });
  };

  const handleReject = async (eventId, rejectionReason) => {
    await updateEventStatus(eventId, {
      status: "rejected",
      rejectionReason: rejectionReason,
    });
  };

  const hasActiveFilters =
    searchTerm ||
    organizerFilter ||
    locationFilter ||
    dateRangeFilter ||
    statusFilter ||
    isSpecialCommissionFilter;

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending-approval":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Event Approvals</h1>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Event Management
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Review and manage events with their current approval status.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                placeholder="Search events..."
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {/* Status Filter */}
              <div className="w-full md:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Commission Type Filter */}
              <div className="w-full md:w-auto">
                <select
                  value={isSpecialCommissionFilter}
                  onChange={(e) => setIsSpecialCommissionFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {specialCommissionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-auto">
                <select
                  value={organizerFilter}
                  onChange={(e) => setOrganizerFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All Organizers</option>
                  {organizers.map((organizer) => (
                    <option key={organizer} value={organizer}>
                      {organizer}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-auto">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-auto">
                <select
                  value={dateRangeFilter}
                  onChange={(e) => setDateRangeFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All Dates</option>
                  {dateRanges.map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active filters display */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                  >
                    <span className="sr-only">Remove search filter</span>
                    <svg
                      className="h-2 w-2"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 8 8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth="1.5"
                        d="M1 1l6 6m0-6L1 7"
                      />
                    </svg>
                  </button>
                </span>
              )}
              {statusFilter && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Status:{" "}
                  {
                    statusOptions.find((opt) => opt.value === statusFilter)
                      ?.label
                  }
                  <button
                    onClick={() => setStatusFilter("")}
                    className="ml-1 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                  >
                    <span className="sr-only">Remove status filter</span>
                    <svg
                      className="h-2 w-2"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 8 8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth="1.5"
                        d="M1 1l6 6m0-6L1 7"
                      />
                    </svg>
                  </button>
                </span>
              )}
              {isSpecialCommissionFilter && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Commission:{" "}
                  {
                    specialCommissionOptions.find(
                      (opt) => opt.value === isSpecialCommissionFilter
                    )?.label
                  }
                  <button
                    onClick={() => setIsSpecialCommissionFilter("")}
                    className="ml-1 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                  >
                    <span className="sr-only">Remove commission filter</span>
                    <svg
                      className="h-2 w-2"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 8 8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth="1.5"
                        d="M1 1l6 6m0-6L1 7"
                      />
                    </svg>
                  </button>
                </span>
              )}
              {organizerFilter && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Organizer: {organizerFilter}
                  <button
                    onClick={() => setOrganizerFilter("")}
                    className="ml-1 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                  >
                    <span className="sr-only">Remove organizer filter</span>
                    <svg
                      className="h-2 w-2"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 8 8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth="1.5"
                        d="M1 1l6 6m0-6L1 7"
                      />
                    </svg>
                  </button>
                </span>
              )}
              {locationFilter && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Location: {locationFilter}
                  <button
                    onClick={() => setLocationFilter("")}
                    className="ml-1 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                  >
                    <span className="sr-only">Remove location filter</span>
                    <svg
                      className="h-2 w-2"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 8 8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth="1.5"
                        d="M1 1l6 6m0-6L1 7"
                      />
                    </svg>
                  </button>
                </span>
              )}
              {dateRangeFilter && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Date: {dateRangeFilter}
                  <button
                    onClick={() => setDateRangeFilter("")}
                    className="ml-1 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                  >
                    <span className="sr-only">Remove date filter</span>
                    <svg
                      className="h-2 w-2"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 8 8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth="1.5"
                        d="M1 1l6 6m0-6L1 7"
                      />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          )}
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
                  Commission
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
                  Submitted
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <tr
                    key={event._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-24">
                          <img
                            className="h-16 w-24 rounded object-cover"
                            src={event.eventImages[0] || "/placeholder.svg"}
                            alt={event.eventName}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {event.eventName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {event.organizerId?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {event.eventDate
                          ? new Date(event.eventDate).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {event.venue?.address?.city || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          event.isSpecialCommission
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {event.isSpecialCommision
                          ? "Special Commission"
                          : "Standard Commission"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          event.status
                        )}`}
                      >
                        {event.status === "pending-approval"
                          ? "Pending"
                          : event.status?.charAt(0).toUpperCase() +
                              event.status?.slice(1) || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.createdAt
                        ? new Date(event.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center items-center space-x-3">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 font-medium border-2 p-1 rounded-lg"
                          onClick={() => openEventDetails(event)}
                        >
                          View Details
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-900 font-medium border-2 p-1 rounded-lg"
                          onClick={() =>
                            navigate(`/app/edit-Event/${event?._id}`)
                          }
                        >
                          Edit
                        </button>

                        {event?.status !== "approved" &&
                          event?.status !== "rejected" && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openModal(event, "approved")}
                                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-green-200 transition-colors duration-150"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => openModal(event, "rejected")}
                                className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-200 transition-colors duration-150"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No events found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(page * limit, events.length)}
                </span>{" "}
                of <span className="font-medium">{events.length}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {Array.from({ length: Math.ceil(events.length / limit) }).map(
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === i + 1
                          ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * limit >= events.length}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* Approval Modal */}
      <EventApprovalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        event={selectedEvent}
        onApprove={handleApprove}
        onReject={handleReject}
        initialStatus={initialStatus}
      />
      {showModal && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
