import { useEffect, useState } from "react";
import { useOrganizerStore } from "../../store/OrganizerStore";
// import { Trash } from "lucide-react";

export default function OrganizerApprovals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);

  const {
    getOrganizers,
    organizers,
    loading,
    error,
    approveOrganizer,
    rejectOrganizer,
    // deleteOrganizer,
  } = useOrganizerStore();

  useEffect(() => {
    getOrganizers();
  }, []);

  const handleApprove = async (organizerId) => {
    await approveOrganizer(organizerId);
    await getOrganizers();
  };

  const openRejectModal = (organizer) => {
    setSelectedOrganizer(organizer);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  const handleReject = async () => {
    if (selectedOrganizer && rejectionReason.trim()) {
      await rejectOrganizer(selectedOrganizer.userId?._id, rejectionReason);
      setIsRejectModalOpen(false);
      await getOrganizers();
      setSelectedOrganizer(null);
      setRejectionReason("");
    }
  };

  // const handleDelete = async (organizerId) => {
  //   if (window.confirm("Are you sure you want to delete this organizer?")) {
  //     await deleteOrganizer(organizerId);
  //   }
  // };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setSelectedOrganizer(null);
    setRejectionReason("");
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const verificationStatuses = [
    ...new Set(organizers.map((org) => org.verificationStatus)),
  ];

  const dates = [
    ...new Set(
      organizers.map((org) => {
        const date = new Date(org.createdAt);
        return date.toISOString().split("T")[0];
      })
    ),
  ];

  const filteredOrganizers = organizers.filter((organizer) => {
    const matchesSearch =
      searchTerm === "" ||
      organizer.organizationName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      organizer.userId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      organizer.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" || organizer.verificationStatus === statusFilter;

    const orgDate = new Date(organizer.createdAt).toISOString().split("T")[0];
    const matchesDate = dateFilter === "" || orgDate === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDateFilter("");
  };

  const hasActiveFilters = searchTerm || statusFilter || dateFilter;

  return (
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
            Review and approve organizer applications before they can create
            events.
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
                placeholder="Search organizers..."
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <div className="w-full md:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All Statuses</option>
                  {verificationStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-auto">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All Dates</option>
                  {dates.map((date) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg
                    className="mr-2 h-4 w-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Clear Filters
                </button>
              )}
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
                  {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
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
              {dateFilter && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Date: {new Date(dateFilter).toLocaleDateString()}
                  <button
                    onClick={() => setDateFilter("")}
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

        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent"></div>
            <p className="mt-2 text-sm text-gray-500">Loading organizers...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            <p>Error loading organizers: {error}</p>
          </div>
        ) : (
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
                    Organization Name
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
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrganizers.length > 0 ? (
                  filteredOrganizers.map((organizer) => (
                    <tr
                      key={organizer._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={organizer.logo || "/placeholder.svg"}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {organizer.userId?.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {organizer.userId?.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {organizer.organizationName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {organizer.website}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(organizer.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            organizer.verificationStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : organizer.verificationStatus === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {organizer.verificationStatus
                            .charAt(0)
                            .toUpperCase() +
                            organizer.verificationStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center gap-3">
                        {organizer.verificationStatus === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleApprove(organizer.userId?._id)
                              }
                              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium mr-1 hover:bg-green-200 transition-colors duration-150"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openRejectModal(organizer)}
                              className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-200 transition-colors duration-150"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {organizer.verificationStatus === "rejected" &&
                          organizer.rejectionReason && (
                            <div className="text-xs text-gray-500">
                              Reason: {organizer.rejectionReason}
                            </div>
                          )}
                        {/* <button
                          onClick={() => handleDelete(organizer.userId?._id)}
                          className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium mr-2 hover:bg-red-200 transition-colors duration-150"
                        >
                          <Trash />
                        </button> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No organizers found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rejection Reason Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
            <div className="bg-red-50 px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Reject Organization
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Please provide a reason for rejecting{" "}
                  {selectedOrganizer?.organizationName}. This reason will be
                  shared with the organizer.
                </p>
                <div className="mt-4">
                  <textarea
                    rows="4"
                    className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded- p-3"
                    placeholder="Enter rejection reason..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                  rejectionReason.trim()
                    ? "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    : "bg-red-300 cursor-not-allowed"
                }`}
              >
                Confirm Rejection
              </button>
              <button
                type="button"
                onClick={closeRejectModal}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
