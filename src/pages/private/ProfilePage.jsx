import React, { useState, useEffect } from "react";
import EventCard from "../../components/ui/EventCard";
import CreateEventForm from "../../components/CreateEventForm";
import Modal from "../../components/ui/Modal";
import Nav from "../../components/Nav";
import Ticket from "../../components/ui/Ticket";
import { useData } from "../../context/DataContext";
import StripeDashboard from "../../components/StripeDashboard";

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
    <div className="container overflow-clip w-screen mx-auto px-4 py-8 pt-[15vh]">
      <Nav />
      <div className="flex flex-col md:flex-col md:justify-center items-center md:items-center mb-8">
        <img
          src={user.imageUrl}
          alt={user.fullName}
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
          <p className="text-gray-600 mb-1">
            {user.emailAddresses[0].emailAddress}
          </p>
          <button
            onClick={() => {
              profile && profile.isOrganizer
                ? setIsCreatingEvent(true)
                : alert("Please create a seller stripe account");
            }}
            className="px-4 py-2 mt-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            {profilePage.createEventButton}
          </button>

          {profile && (
            <>
              {profile.isOrganizer === false ? (
                <>
                  <button
                    onClick={handleCreateStripeAccount}
                    className="px-4 py-2 mt-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Create Seller stripe account
                  </button>
                </>
              ) : null}
            </>
          )}
        </div>
      </div>

      <Modal isOpen={isCreatingEvent} onClose={() => setIsCreatingEvent(false)}>
        <CreateEventForm onCancel={() => setIsCreatingEvent(false)} />
      </Modal>

      <div className="flex justify-center space-x-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab("events")}
          className={`px-4 py-2 ${
            activeTab === "events"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-600"
          }`}
        >
          {profilePage.tabs.events}
        </button>
        <button
          onClick={() => setActiveTab("tickets")}
          className={`px-4 py-2 ${
            activeTab === "tickets"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-600"
          }`}
        >
          {profilePage.tabs.tickets}
        </button>
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 ${
            activeTab === "dashboard"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-600"
          }`}
        >
          {/* {profilePage.tabs.dashboard} */}
          {defaultTexts.stripeDashboard.title}
        </button>
      </div>

      <div>
        {activeTab === "events" && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {profilePage.eventsSection.title}
            </h2>
            <div className="flex flex-wrap gap-6">
              {Array.isArray(createdEvents) && createdEvents.length > 0 ? (
                createdEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))
              ) : (
                <p>{profilePage.eventsSection.noEvents}</p>
              )}
            </div>
          </div>
        )}
        {activeTab === "tickets" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {profilePage.ticketsSection.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              {boughtTickets ? (
                boughtTickets.map((ticket) => (
                  <React.Fragment key={ticket.id}>
                    <Ticket data={ticket} />
                  </React.Fragment>
                ))
              ) : (
                <p>{profilePage.ticketsSection.noTickets}</p>
              )}
            </div>
          </div>
        )}
        {activeTab === "dashboard" && <StripeDashboard />}
      </div>
    </div>
  );
}

export default ProfilePage;
