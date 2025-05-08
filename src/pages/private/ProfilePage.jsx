import React, { useState, useEffect } from "react";
import EventCard from "../../components/ui/EventCard";
import CreateEventForm from "../../components/CreateEventForm";
import Modal from "../../components/ui/Modal";
import Nav from "../../components/Nav";
import Ticket from "../../components/ui/Ticket";
import { useData } from "../../context/DataContext";
import StripeDashboard from "../../components/StripeDashboard";
import { FiCalendar, FiCreditCard, FiPlus } from "react-icons/fi";
import { PiTicket } from "react-icons/pi";

const mockProfile = {
  _id: "user123",
  isOrganizer: true,
};

const mockCreatedEvents = [
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
];

const mockBoughtTickets = [
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
];

function ProfilePage() {
  const { defaultTexts, setLoading } = useData();
  const { profilePage } = defaultTexts;

  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [boughtTickets, setBoughtTickets] = useState(null);
  const [activeTab, setActiveTab] = useState("events");
  const [profile, setProfile] = useState(null);

  const user = {
    id: "user123",
    fullName: "Jane Doe",
    imageUrl: "https://randomuser.me/api/portraits/women/12.jpg",
    primaryEmailAddress: { emailAddress: "jane.doe@example.com" },
    emailAddresses: [{ emailAddress: "jane.doe@example.com" }],
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);

      setTimeout(() => {
        setProfile(mockProfile);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const fetchCreatedEvents = async () => {
    try {
      setLoading(true);

      setTimeout(() => {
        setCreatedEvents(mockCreatedEvents);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching created events:", error);
      setLoading(false);
    }
  };

  const fetchBoughtTickets = async () => {
    try {
      setLoading(true);

      setTimeout(() => {
        setBoughtTickets(mockBoughtTickets);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching bought tickets:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchCreatedEvents();
    fetchBoughtTickets();
  }, []);

  const handleCreateStripeAccount = async () => {
    setLoading(true);

    setTimeout(() => {
      alert("Stripe account link generated successfully. Redirecting...");

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Nav />

      <div className="container mx-auto px-4 py-8 pt-[15vh]">
        <div className="mb-8 overflow-hidden rounded-xl bg-white p-6 shadow-md relative">
          <div className="flex flex-col items-center md:flex-row">
            <div className="flex flex-col items-center md:flex-row md:items-center">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-purple-100 shadow-md md:h-28 md:w-28">
                <img
                  src={user.imageUrl || "/placeholder.svg"}
                  alt={user.fullName}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-4 text-center md:ml-6 md:text-left">
                <h1 className="text-2xl font-bold md:text-3xl">
                  {user.fullName}
                </h1>
                <p className="text-gray-500">
                  {user.emailAddresses[0].emailAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons positioned at bottom right corner */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 sm:flex-row">
            {profile && !profile.isOrganizer && (
              <button
                onClick={handleCreateStripeAccount}
                className="inline-flex items-center rounded-md bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:from-purple-700 hover:to-violet-700"
              >
                <FiCreditCard className="mr-2 h-4 w-4" />
                Create Seller Account
              </button>
            )}

            {profile && profile.isOrganizer && (
              <button
                onClick={() => setIsCreatingEvent(true)}
                className="inline-flex items-center rounded-md bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:from-purple-700 hover:to-violet-700"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                {profilePage.createEventButton}
              </button>
            )}
          </div>
        </div>

        <Modal
          isOpen={isCreatingEvent}
          onClose={() => setIsCreatingEvent(false)}
        >
          <CreateEventForm onCancel={() => setIsCreatingEvent(false)} />
        </Modal>

        {/* Tabs */}
        <div className="overflow-hidden rounded-xl bg-white shadow-md">
          <div className="grid grid-cols-3 border-b">
            <button
              onClick={() => setActiveTab("events")}
              className={`flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "events"
                  ? "border-b-2 border-purple-600 bg-purple-50 text-purple-700"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <FiCalendar className="mr-2 h-4 w-4" />
              {profilePage.tabs.events}
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className={`flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "tickets"
                  ? "border-b-2 border-purple-600 bg-purple-50 text-purple-700"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <PiTicket className="mr-2 h-4 w-4" />
              {profilePage.tabs.tickets}
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "dashboard"
                  ? "border-b-2 border-purple-600 bg-purple-50 text-purple-700"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <FiCreditCard className="mr-2 h-4 w-4" />
              {defaultTexts.stripeDashboard.title}
            </button>
          </div>

          <div className="p-6">
            {activeTab === "events" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profilePage.eventsSection.title}
                  </h2>
                </div>

                {Array.isArray(createdEvents) && createdEvents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {createdEvents.map((event) => (
                      <EventCard key={event.id} {...event} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-lg bg-gray-50">
                    <p className="text-center text-gray-500">
                      {profilePage.eventsSection.noEvents}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "tickets" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profilePage.ticketsSection.title}
                  </h2>
                </div>

                {boughtTickets && boughtTickets.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {boughtTickets.map((ticket) => (
                      <React.Fragment key={ticket.id}>
                        <Ticket data={ticket} />
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-lg bg-gray-50">
                    <p className="text-center text-gray-500">
                      {profilePage.ticketsSection.noTickets}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "dashboard" && (
              <div>
                <StripeDashboard />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
