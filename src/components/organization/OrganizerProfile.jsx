import { useState, useEffect } from "react";
import {
  FiAward,
  FiCalendar,
  FiCreditCard,
  FiEdit2,
  FiFileText,
  FiMail,
  FiPlus,
} from "react-icons/fi";
import { useData } from "../../context/DataContext";
import Modal from "../ui/Modal";
import StripeDashboard from "./StripeDashboard";
import EventCard from "../ui/EventCard";
import { useNavigate } from "react-router-dom";
import CreateEventForm from "../CreateEventForm";
import PropTypes from "prop-types";
import { FaAward, FaBuilding } from "react-icons/fa6";
import { Buildings, FileText, Phone, User, X } from "phosphor-react";
import { IoMail } from "react-icons/io5";
import { FaSave } from "react-icons/fa";

const OrganizerProfile = ({ profile: initialProfile }) => {
  const { defaultTexts, setLoading } = useData();
  const { profilePage } = defaultTexts;

  const [profile, setProfile] = useState(initialProfile);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    bio: "",
  });
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  // Initialize form data when profile changes or edit mode is activated
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        organization: profile.organization || "",
        bio: profile.bio || "",
      });
    }
  }, [profile, editMode]);

  // Fetch events created by organizer
  const fetchCreatedEvents = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setCreatedEvents([
          {
            id: "event1",
            title: "Tech Conference 2025",
            date: "2025-06-15",
            location: "San Francisco, CA",
            imageUrl: "/images/event1.jpg",
            description:
              "Annual technology conference featuring the latest innovations",
            price: 99.99,
          },
          {
            id: "event2",
            title: "Music Festival",
            date: "2025-07-22",
            location: "Austin, TX",
            imageUrl: "/images/event2.jpg",
            description: "Three-day music festival with top artists",
            price: 149.99,
          },
          {
            id: "event3",
            title: "Art Exhibition",
            date: "2025-05-30",
            location: "New York, NY",
            imageUrl: "/images/event3.jpg",
            description: "Contemporary art exhibition featuring local artists",
            price: 25.0,
          },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching created events:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatedEvents();
  }, []);

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
      alert("Organizer profile updated successfully!");
    }, 800);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    // Reset form data to current profile values
    setFormData({
      fullName: profile.fullName || "",
      email: profile.email || "",
      phone: profile.phone || "",
      organization: profile.organization || "",
      bio: profile.bio || "",
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
                <span className="mt-2 inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                  Event Organizer
                </span>
              </div>
            </div>

            {/* Action Buttons */}
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

      {/* Create Event Modal */}
      <Modal isOpen={isCreatingEvent} onClose={() => setIsCreatingEvent(false)}>
        <CreateEventForm onCancel={() => setIsCreatingEvent(false)} />
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
              activeTab === "events"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("events")}
          >
            <FiCalendar className="mr-2 h-4 w-4 inline" />
            My Events
          </button>
          <button
            className={`flex-1 justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "dashboard"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FiCreditCard className="mr-2 h-4 w-4 inline" />
            Dashboard
          </button>
        </div>

        {/* Profile Tab Content */}
        <div className={activeTab === "profile" ? "block" : "hidden"}>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header with action buttons */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                {/* Header with action buttons */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Organizer Information
                  </h2>
                  <div>
                    {editMode ? (
                      <div className="flex gap-3">
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          <X size={16} />
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                        >
                          <FaSave size={16} />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors shadow-sm"
                      >
                        <FiEdit2 size={16} />
                        <span>Edit Profile</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile content */}
                <div className="p-8 space-y-8">
                  {editMode ? (
                    // Edit Mode - Show Form
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label
                          htmlFor="fullName"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
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
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <IoMail size={16} className="text-purple-500" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                          placeholder="Enter your email address"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="phone"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
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
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="organization"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <Buildings size={16} className="text-purple-500" />
                          Organization
                        </label>
                        <input
                          type="text"
                          id="organization"
                          name="organization"
                          value={formData.organization}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                          placeholder="Enter your organization name"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label
                          htmlFor="bio"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <FileText size={16} className="text-purple-500" />
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={5}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none shadow-sm"
                          placeholder="Tell attendees about yourself or your organization..."
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-1 flex items-start gap-1.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Write a short bio that describes you or your
                          organization to event attendees. This will be visible
                          on your public profile.
                        </p>
                      </div>
                    </div>
                  ) : (
                    // View Mode - Show Information
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                          <User size={16} className="text-purple-500" />
                          <span>Full Name</span>
                        </div>
                        <p className="text-base font-medium text-gray-800">
                          {profile.fullName}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                          <IoMail size={16} className="text-purple-500" />
                          <span>Email Address</span>
                        </div>
                        <p className="text-base text-gray-800">
                          {profile.email}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
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

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                          <Buildings size={16} className="text-purple-500" />
                          <span>Organization</span>
                        </div>
                        <p className="text-base text-gray-800">
                          {profile.organization || (
                            <span className="text-gray-400 italic">
                              Not provided
                            </span>
                          )}
                        </p>
                      </div>

                      <div className=" bg-gray-50 rounded-lg p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
                          <FileText size={16} className="text-purple-500" />
                          <span>Bio</span>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-100">
                          {profile.bio ? (
                            <p className="text-base text-gray-800 whitespace-pre-line leading-relaxed">
                              {profile.bio}
                            </p>
                          ) : (
                            <p className="text-gray-400 italic">
                              No bio provided
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                          <FiAward size={16} className="text-purple-500" />
                          <span>Account Type</span>
                        </div>
                        <p className="text-base text-gray-800">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                            Event Organizer
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Tab Content */}
        <div className={activeTab === "events" ? "block" : "hidden"}>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                {profilePage.eventsSection?.title || "My Events"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Events you have created
              </p>
            </div>
            <div className="p-6 pt-0">
              {createdEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {createdEvents.map((event) => (
                    <EventCard key={event.id} {...event} />
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
            <div className="flex items-center p-6 pt-0">
              <button
                onClick={() => setIsCreatingEvent(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Create New Event
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Tab Content */}
        <div className={activeTab === "dashboard" ? "block" : "hidden"}>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                {defaultTexts.stripeDashboard?.title || "Financial Dashboard"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage your earnings and payouts
              </p>
            </div>
            <div className="p-6 pt-0">
              <StripeDashboard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
OrganizerProfile.propTypes = {
  profile: PropTypes.shape({
    fullName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    organization: PropTypes.string,
    bio: PropTypes.string,
    imageUrl: PropTypes.string,
  }),
};

export default OrganizerProfile;
