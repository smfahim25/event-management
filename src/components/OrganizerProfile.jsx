import { useState, useEffect } from "react";
import { FiCalendar, FiCreditCard, FiPlus, FiSave, FiX } from "react-icons/fi";
import EventCard from "./ui/EventCard";
import { useData } from "../context/DataContext";
import Modal from "./ui/Modal";
import CreateEventForm from "./CreateEventForm";
import StripeDashboard from "./StripeDashboard";

export default function OrganizerProfileComponent({ profile: initialProfile }) {
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
                onClick={() => setIsCreatingEvent(true)}
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
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Organizer Information
              </h3>
              <p className="text-sm text-muted-foreground">
                View and update your organizer details
              </p>
            </div>
            <div className="p-6 pt-0 space-y-4">
              {editMode ? (
                // Edit Mode - Show Form
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="text-sm font-medium block mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium block mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium block mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="organization"
                      className="text-sm font-medium block mb-1"
                    >
                      Organization
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="bio"
                      className="text-sm font-medium block mb-1"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Tell attendees about yourself or your organization..."
                    ></textarea>
                  </div>
                </div>
              ) : (
                // View Mode - Show Information
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="mt-1">{profile.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="mt-1">{profile.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <p className="mt-1">{profile.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Organization</label>
                    <p className="mt-1">
                      {profile.organization || "Not provided"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Bio</label>
                    <p className="mt-1">{profile.bio || "No bio provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Account Type</label>
                    <p className="mt-1">Event Organizer</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center p-6 pt-0">
              {editMode ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 hover:bg-purple-700 text-white h-10 px-4 py-2"
                  >
                    <FiSave className="mr-2 h-4 w-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    <FiX className="mr-2 h-4 w-4" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  Edit Profile
                </button>
              )}
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
}
