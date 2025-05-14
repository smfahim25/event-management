import { useState, useEffect } from "react";
import { FiCreditCard, FiMail } from "react-icons/fi";
import { PiTicket } from "react-icons/pi";
import { useData } from "../context/DataContext";
import Modal from "./ui/Modal";
import UserTicket from "./ui/UserTicket";
import { FaEdit, FaSave } from "react-icons/fa";
import { FileText, MapPin, Phone, User, X } from "phosphor-react";
import { FaUserCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

// Mock data for testing
const mockOrders = [
  {
    id: "order1",
    date: "2025-04-15",
    total: 149.99,
    status: "Completed",
    items: [
      {
        id: "ticket1",
        eventName: "Jazz Night",
        quantity: 2,
        price: 75.0,
      },
    ],
  },
  {
    id: "order2",
    date: "2025-03-22",
    total: 50.0,
    status: "Completed",
    items: [
      {
        id: "ticket2",
        eventName: "Business Workshop",
        quantity: 1,
        price: 50.0,
      },
    ],
  },
];

const mockRefundPolicies = {
  event101: { policy: "Non-refundable", deadline: null },
  event102: {
    policy: "Refundable up to 3 days before event",
    deadline: "2025-06-07",
  },
};

export default function UserProfileComponent({ profile: initialProfile }) {
  const { defaultTexts, setLoading } = useData();
  const { profilePage } = defaultTexts;

  const [profile, setProfile] = useState(initialProfile);
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
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();

  // Initialize form data when profile changes or edit mode is activated
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile, editMode]);

  // Fetch tickets purchased by user
  const fetchBoughtTickets = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setBoughtTickets([
          {
            id: "ticket1",
            eventId: "event101",
            eventName: "Jazz Night",
            date: "2025-05-20",
            location: "Chicago Jazz Club",
            ticketType: "VIP",
            price: 75.0,
            qrCode: "qr12345",
          },
          {
            id: "ticket2",
            eventId: "event102",
            eventName: "Business Workshop",
            date: "2025-06-10",
            location: "Downtown Conference Center",
            ticketType: "Standard",
            price: 50.0,
            qrCode: "qr67890",
          },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching bought tickets:", error);
      setLoading(false);
    }
  };

  // Fetch order history
  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setOrders(mockOrders);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoughtTickets();
    fetchOrders();
  }, []);

  const handleRequestRefund = (ticket) => {
    setSelectedTicket(ticket);
    setIsRefundModalOpen(true);
  };

  const submitRefundRequest = () => {
    // Simulate refund request submission
    alert(`Refund request submitted for ${selectedTicket.eventName}`);
    setIsRefundModalOpen(false);
    setSelectedTicket(null);
  };

  const isRefundable = (ticket) => {
    const policy = mockRefundPolicies[ticket.eventId];
    if (!policy) return false;

    if (policy.policy === "Non-refundable") return false;

    if (policy.deadline) {
      const deadlineDate = new Date(policy.deadline);
      const today = new Date();
      return today <= deadlineDate;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    // Simulate API call to update profile
    setTimeout(() => {
      setProfile({
        ...profile,
        ...formData,
      });
      setEditMode(false);
      setLoading(false);
      alert("Profile updated successfully!");
    }, 800);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    // Reset form data to current profile values
    setFormData({
      fullName: profile.fullName || "",
      email: profile.email || "",
      phone: profile.phone || "",
      address: profile.address || "",
    });
  };

  return (
    <>
      {/* Profile Card */}
      <div className="mb-8 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
            <div className="flex flex-col items-center sm:flex-row sm:items-center">
              <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 overflow-hidden rounded-full border-4 border-purple-100 shadow-md flex-shrink-0">
                <img
                  src={
                    profile.imageUrl || "/placeholder.svg?height=112&width=112"
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
                  User
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center sm:justify-end mt-6 sm:mt-0">
              <button
                onClick={() => navigate("/app/create-organizer")}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white h-10 px-4 py-2"
              >
                <FiCreditCard className="mr-2 h-4 w-4" />
                Become an Organizer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Request Modal */}
      <Modal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Request Refund</h2>
          <p className="mb-4">
            You are requesting a refund for:{" "}
            <strong>{selectedTicket?.eventName}</strong>
          </p>
          <p className="mb-4">
            Refund Policy:{" "}
            <strong>
              {selectedTicket &&
                mockRefundPolicies[selectedTicket.eventId]?.policy}
            </strong>
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              onClick={() => setIsRefundModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              onClick={submitRefundRequest}
            >
              Submit Request
            </button>
          </div>
        </div>
      </Modal>

      {/* Main Content Tabs */}
      <div className="w-full">
        <div className="flex space-x-1 rounded-md bg-muted p-1 mb-4">
          <button
            className={`flex-1 justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "profile"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`flex-1 justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "tickets"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("tickets")}
          >
            <PiTicket className="mr-2 h-4 w-4 inline" />
            My Tickets
          </button>
          <button
            className={`flex-1 justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "orders"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <FiCreditCard className="mr-2 h-4 w-4 inline" />
            Order History
          </button>
        </div>

        {/* Profile Tab Content */}
        <div className={activeTab === "profile" ? "block" : "hidden"}>
          <div className="rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between space-y-1.5 p-6">
              {" "}
              {/* Header */}
              <div className="p-6 text-black">
                <h3 className="text-xl font-semibold leading-none tracking-tight">
                  Personal Information
                </h3>
                <p className="text-sm text-black mt-1.5">
                  View and update your account details
                </p>
              </div>
              {/* Footer with action buttons */}
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
                      className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 bg-purple-600 hover:bg-purple-700 text-white h-10 px-4 py-2 shadow-sm"
                    >
                      <FaSave className="mr-2 h-4 w-4" />
                      Save Changes
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

            {/* Content */}
            <div className="p-6 space-y-6">
              {editMode ? (
                // Edit Mode - Show Form
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
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 shadow-sm"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label
                      htmlFor="bio"
                      className="text-sm font-medium flex items-center gap-2 text-gray-700"
                    >
                      <FileText size={16} className="text-purple-500" />
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 shadow-sm resize-none"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1 flex items-start gap-1.5">
                      Write a short bio that describes you or your organization.
                    </p>
                  </div>
                </div>
              ) : (
                // View Mode - Show Information
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
                        {profile.accountType || "User"}
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

        {/* Tickets Tab Content */}
        <div className={activeTab === "tickets" ? "block" : "hidden"}>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                {profilePage.ticketsSection?.title || "My Tickets"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Access your purchased tickets
              </p>
            </div>
            <div className="p-6 pt-0">
              {boughtTickets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {boughtTickets.map((ticket) => (
                    <div key={ticket.id} className="relative">
                      <UserTicket
                        key={ticket.id}
                        data={ticket}
                        isRefundable={isRefundable(ticket)}
                        onRequestRefund={handleRequestRefund}
                      />
                    </div>
                  ))}
                </div>
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

        {/* Order History Tab Content */}
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
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-6 pt-0">
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center"
                            >
                              <div>
                                <p className="font-medium">{item.eventName}</p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="font-medium">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between">
                          <p className="font-bold">Total</p>
                          <p className="font-bold">${order.total.toFixed(2)}</p>
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
