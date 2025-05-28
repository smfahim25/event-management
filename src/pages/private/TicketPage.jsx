import { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";
import { useBookingStore } from "../../store/BookingStore";
import EventGroupedTickets from "../../components/ui/EventGroupedTickets";
import Nav from "../../components/Nav";

const TicketPage = () => {
  const { defaultTexts } = useData();
  const { profilePage } = defaultTexts;
  const { getMyBookings } = useBookingStore();

  const [boughtTickets, setBoughtTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  useEffect(() => {
    fetchBoughtTickets();
  }, []);

  const fetchBoughtTickets = async (page = 1, limit = 50) => {
    try {
      setLoading(true);
      const response = await getMyBookings({ page, limit });

      if (response && response.bookings) {
        const tickets = response.bookings.flatMap((booking) =>
          booking?.ticketDetails?.map((ticket) => ({
            ...ticket,
            bookingId: booking?._id,
            eventId: booking?.eventId._id,
            eventName: booking?.eventId.eventName,
            eventDate: booking?.eventId.eventDate,
            startTime: booking?.eventId.startTime,
            refund: booking?.eventId.refundPolicy,
            refundStatus: booking?.refundDetails.status,
            endTime: booking?.eventId.endTime,
            location: booking?.eventId.venue.name,
            ticketType: ticket?.tierName,
            price:
              booking?.tickets.find((t) => t.tierName === ticket.tierName)
                ?.price || 0,
            event: {
              poster: booking?.eventId.eventImages[0],
              description: booking?.eventId.description,
              organizer: {
                username: booking?.organizerId.name,
                contact: booking?.organizerId.phone,
              },
            },
          }))
        );

        setBoughtTickets(tickets);
        setPagination({
          page: response.meta.page,
          limit: response.meta.limit,
          total: response.meta.total,
          totalPages: response.meta.totalPage,
          hasNextPage: response.meta.hasNextPage,
          hasPreviousPage: response.meta.hasPreviousPage,
        });
      }
    } catch (error) {
      console.error("Error fetching bought tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const isRefundable = (ticket) => {
    if (!ticket?.eventDate || !ticket?.refund?.rules?.length) return false;

    const eventDate = new Date(ticket.eventDate);
    const rule = ticket?.refund?.rules[0];
    const daysBeforeEvent = rule.daysBeforeEvent;

    const now = new Date();
    const latestRefundDate = new Date(eventDate);
    latestRefundDate.setDate(eventDate.getDate() - daysBeforeEvent);

    return now <= latestRefundDate;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchBoughtTickets(newPage, pagination.limit);
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse"
        >
          <div className="flex space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="w-32 h-32 mb-8 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <svg
          className="w-16 h-16 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">
        No Tickets Yet
      </h3>
      <p className="text-gray-500 text-center max-w-md leading-relaxed">
        {profilePage.ticketsSection?.noTickets ||
          "You haven't purchased any tickets yet. Start exploring events and book your first ticket!"}
      </p>
      <button className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
        Browse Events
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <Nav />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              My{" "}
              <span className="bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent">
                Tickets
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access and manage all your purchased tickets in one place
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {/* Stats Bar */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">{pagination.total}</div>
                  <div className="text-blue-100 text-sm">Total Tickets</div>
                </div>
                <div className="w-px h-12 bg-blue-400/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.ceil(boughtTickets.length / 3) || 0}
                  </div>
                  <div className="text-blue-100 text-sm">Events</div>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-blue-100">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Updated just now</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {loading && boughtTickets.length === 0 ? (
              <LoadingSkeleton />
            ) : boughtTickets.length > 0 ? (
              <div className="space-y-8">
                <EventGroupedTickets
                  boughtTickets={boughtTickets}
                  isRefundable={isRefundable}
                />

                {/* Enhanced Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPreviousPage || loading}
                      className={`group flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        !pagination.hasPreviousPage || loading
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                      }`}
                    >
                      <svg
                        className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        Page{" "}
                        <span className="font-semibold text-blue-600">
                          {pagination.page}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold">
                          {pagination.totalPages}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {[...Array(Math.min(5, pagination.totalPages))].map(
                          (_, i) => {
                            const pageNum = i + 1;
                            const isActive = pageNum === pagination.page;
                            return (
                              <button
                                key={i}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  isActive
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNextPage || loading}
                      className={`group flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        !pagination.hasNextPage || loading
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                      }`}
                    >
                      <span>Next</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
