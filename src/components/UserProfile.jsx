import { useState, useEffect } from "react";
import { FiCreditCard, FiMail } from "react-icons/fi";
import { PiTicket } from "react-icons/pi";
import { useData } from "../context/DataContext";
import { FaEdit, FaSave } from "react-icons/fa";
import { FileText, MapPin, Phone, User, X } from "phosphor-react";
import { FaUserCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { useBookingStore } from "../store/BookingStore";
import EventGroupedTickets from "./ui/EventGroupedTickets";

export default function UserProfileComponent() {
  const { defaultTexts } = useData();
  const { profilePage } = defaultTexts;
  const { user, updateUser, fetchUser: getUser } = useAuthStore();
  const { getMyBookings } = useBookingStore();

  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [boughtTickets, setBoughtTickets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      if (!user.name) return;

      try {
        setLoading(true);
        if (user) {
          setProfile({
            fullName: user.name || user.fullName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
          });

          setFormData({
            fullName: user.name || user.fullName || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
          });
          setDataFetched(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [user, getUser]);

  useEffect(() => {
    if (!dataFetched && user) {
      fetchBoughtTickets();
    }
  }, [dataFetched, user]);

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

        // Transform booking data to orders format
        const transformedOrders = response.bookings.map((booking) => ({
          id: booking.orderNumber,
          status: booking.paymentDetails.status,
          date: booking.createdAt,
          eventName: booking.eventId.eventName,
          eventDate: booking.eventId.eventDate,
          venue: booking.eventId.venue.name,
          items: booking.tickets.map((ticket) => ({
            id: ticket._id,
            eventName: booking.eventId.eventName,
            tierName: ticket.tierName,
            quantity: ticket.quantity,
            price: ticket.price,
            totalPrice: ticket.totalPrice,
          })),
          paymentDetails: {
            method: booking.paymentDetails.method,
            status: booking.paymentDetails.status,
            totalAmount: booking.paymentDetails.totalAmount,
            platformFee: booking.paymentDetails.platformFee,
            organizerRevenue: booking.paymentDetails.organizerRevenue,
            currency: booking.paymentDetails.currency,
          },
          refundDetails: booking.refundDetails,
          total: booking.paymentDetails.totalAmount,
        }));

        setOrders(transformedOrders);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveProfile = async () => {
    const updateData = {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    };

    try {
      setLoading(true);
      await updateUser(updateData);
      await getUser();

      setEditMode(false);
      setLoading(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({
      fullName: profile.fullName || "",
      email: profile.email || "",
      phone: profile.phone || "",
      address: profile.address || "",
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchBoughtTickets(newPage, pagination.limit);
    }
  };

  return (
    <>
      <div className="mb-8 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
            <div className="flex flex-col items-center sm:flex-row sm:items-center">
              <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 overflow-hidden rounded-full border-4 border-purple-100 shadow-md flex-shrink-0">
                <img
                  src={
                    "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
                  }
                  alt={profile.fullName}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-4 sm:mt-0 text-center sm:text-left sm:ml-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {profile.fullName}
                </h1>
                <p className="text-gray-500 text-sm sm:text-base truncate max-w-[250px] sm:max-w-none">
                  {profile.email}
                </p>
                <span className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  {profile.role || "User"}
                </span>
              </div>
            </div>

            {user?.role === "user" && (
              <div className="flex justify-center sm:justify-end mt-6 sm:mt-0">
                <button
                  onClick={() => navigate("/app/create-organizer")}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white h-10 px-4 py-2"
                >
                  <FiCreditCard className="mr-2 h-4 w-4" />
                  Become an Organizer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex space-x-1 rounded-md bg-muted p-1 mb-4">
          <button
            className={`flex-1 justify-center rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "profile"
                ? "bg-purple-200 text-foreground shadow-lg"
                : "text-muted-foreground shadow-md"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`flex-1 justify-center rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "tickets"
                ? "bg-purple-200 text-foreground shadow-lg"
                : "text-muted-foreground shadow-md"
            }`}
            onClick={() => setActiveTab("tickets")}
          >
            <PiTicket className="mr-2 h-4 w-4 inline" />
            My Tickets
          </button>
          <button
            className={`flex-1 justify-center rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "orders"
                ? "bg-purple-200 text-foreground shadow-lg"
                : "text-muted-foreground shadow-md"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <FiCreditCard className="mr-2 h-4 w-4 inline" />
            Order History
          </button>
        </div>

        <div className={activeTab === "profile" ? "block" : "hidden"}>
          <div className="rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between space-y-1.5 p-6">
              <div className="p-6 text-black">
                <h3 className="text-xl font-semibold leading-none tracking-tight">
                  Personal Information
                </h3>
                <p className="text-sm text-black mt-1.5">
                  View and update your account details
                </p>
              </div>

              <div className="flex items-center justify-end p-6">
                {editMode ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelEdit}
                      className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 h-10 px-4 py-2 shadow-sm"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 bg-purple-600 hover:bg-purple-700 text-white h-10 px-4 py-2 shadow-sm"
                    >
                      <FaSave className="mr-2 h-4 w-4" />
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 bg-purple-600 hover:bg-purple-700 text-white h-10 px-4 py-2 shadow-sm"
                  >
                    <FaEdit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {editMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="fullName"
                      className="text-sm font-medium flex items-center gap-2 text-gray-700"
                    >
                      <User size={16} className="text-purple-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      disabled={loading}
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium flex items-center gap-2 text-gray-700"
                    >
                      <FiMail size={16} className="text-purple-500" />
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      disabled={loading}
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium flex items-center gap-2 text-gray-700"
                    >
                      <Phone size={16} className="text-purple-500" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      disabled={loading}
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="address"
                      className="text-sm font-medium flex items-center gap-2 text-gray-700"
                    >
                      <MapPin size={16} className="text-purple-500" />
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      disabled={loading}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 shadow-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                      <User size={16} className="text-purple-500" />
                      <span>Full Name</span>
                    </div>
                    <p className="text-base font-medium text-gray-800">
                      {profile.fullName}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                      <FiMail size={16} className="text-purple-500" />
                      <span>Email</span>
                    </div>
                    <p className="text-base text-gray-800">{profile.email}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                      <Phone size={16} className="text-purple-500" />
                      <span>Phone Number</span>
                    </div>
                    <p className="text-base text-gray-800">
                      {profile.phone || (
                        <span className="text-gray-400 italic">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                      <MapPin size={16} className="text-purple-500" />
                      <span>Address</span>
                    </div>
                    <p className="text-base text-gray-800">
                      {profile.address || (
                        <span className="text-gray-400 italic">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                      <FaUserCheck size={16} className="text-purple-500" />
                      <span>Account Type</span>
                    </div>
                    <p className="text-base text-gray-800">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        {profile.role || "User"}
                      </span>
                    </p>
                  </div>

                  {profile.bio && (
                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                        <FileText size={16} className="text-purple-500" />
                        <span>Bio</span>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <p className="text-base text-gray-800 whitespace-pre-line">
                          {profile.bio}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={activeTab === "tickets" ? "block" : "hidden"}>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                {profilePage.ticketsSection?.title || "My Tickets"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Access your purchased tickets organized by event
              </p>
            </div>
            <div className="p-6 pt-0">
              {loading && boughtTickets.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-lg bg-gray-50">
                  <p className="text-center text-gray-500">
                    Loading tickets...
                  </p>
                </div>
              ) : boughtTickets.length > 0 ? (
                <>
                  <EventGroupedTickets
                    boughtTickets={boughtTickets}
                    isRefundable={isRefundable}
                  />

                  {/* Pagination controls */}
                  <div className="mt-6 flex items-center justify-between">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPreviousPage || loading}
                      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${
                        !pagination.hasPreviousPage || loading
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Previous
                    </button>

                    <span className="text-sm text-gray-600">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNextPage || loading}
                      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ${
                        !pagination.hasNextPage || loading
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg bg-gray-50">
                  <p className="text-center text-gray-500">
                    {profilePage.ticketsSection?.noTickets ||
                      "You haven't purchased any tickets yet."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={activeTab === "orders" ? "block" : "hidden"}>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Order History
              </h3>
              <p className="text-sm text-muted-foreground">
                View your past orders and purchases
              </p>
            </div>
            <div className="p-6 pt-0">
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-lg border bg-card text-card-foreground shadow-sm"
                    >
                      <div className="flex flex-col space-y-1.5 p-6 pb-2">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold leading-none tracking-tight">
                            Order #{order.id}
                          </h3>
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                              order.status === "success"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : order.status === "pending"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : order.status === "failed"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="p-6 pt-0">
                        {/* Event Details */}
                        <div className="mb-4 p-3 bg-purple-50 rounded-md">
                          <h4 className="font-medium text-gray-900">
                            {order.eventName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Event Date:{" "}
                            {new Date(order.eventDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Venue: {order.venue}
                          </p>
                        </div>

                        {/* Ticket Items */}
                        <div className="space-y-2 mb-4">
                          <h5 className="font-medium text-gray-900">
                            Tickets:
                          </h5>
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                            >
                              <div>
                                <p className="font-medium">{item.tierName}</p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity} × $
                                  {item?.price?.toFixed(2)}
                                </p>
                              </div>
                              <p className="font-medium">
                                ${item?.totalPrice?.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Refund Status */}
                        {order.refundDetails.status !== "none" && (
                          <div className="mb-4 p-3 bg-orange-50 rounded-md">
                            <h5 className="font-medium text-orange-900">
                              Refund Status:
                            </h5>
                            <p className="text-sm text-orange-700 capitalize">
                              {order?.refundDetails?.status}
                            </p>
                          </div>
                        )}

                        {/* Total */}
                        <div className="pt-4 border-t flex justify-between">
                          <p className="font-bold">Total Amount</p>
                          <p className="font-bold text-lg">
                            ${order?.total?.toFixed(2)}{" "}
                            {order?.paymentDetails?.currency}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg bg-gray-50">
                  <p className="text-center text-gray-500">
                    You don&#39;t have any orders yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
