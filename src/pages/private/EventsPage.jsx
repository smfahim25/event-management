import { useEffect, useState } from "react";
import EventCard from "../../components/ui/EventCard";
import Nav from "../../components/Nav";
import img from "../../assets/eventPage.jpg";
import { useData } from "../../context/DataContext";
import { FaSearch } from "react-icons/fa";

function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const { defaultTexts } = useData();

  const staticEvents = [
    {
      id: 1,
      name: "Summer Tech Conference",
      description: "Join industry leaders in discussing the future of AI.",
      date: "2025-08-01",
      organizer: { username: "admin1" },
      image: "", // Add image if needed
      location: "San Francisco, CA",
      category: "Conference",
      price: 299,
      startTime: "09:00",
      endTime: "17:00",
    },
    {
      id: 2,
      name: "Coding Bootcamp",
      description: "Intensive bootcamp for beginners in full-stack web dev.",
      date: "2025-07-15",
      organizer: { username: "devteam" },
      image: "",
      location: "New York, NY",
      category: "Workshop",
      price: 149,
      startTime: "10:00",
      endTime: "16:00",
    },
    {
      id: 3,
      name: "Past Tech Meetup",
      description: "Networking event for developers and tech enthusiasts.",
      date: "2025-03-10",
      organizer: { username: "techhub" },
      image: "",
      location: "Seattle, WA",
      category: "Meetup",
      price: 0,
      startTime: "19:00",
      endTime: "21:00",
    },
    {
      id: 4,
      name: "Startup Pitch Night",
      description:
        "Watch innovative startups pitch their ideas to investors. Great networking opportunity for entrepreneurs and investors alike.",
      date: "2025-05-10",
      organizer: { username: "VentureConnectjghjghghhg" },
      image: "",
      location: "Boston, MA",
      category: "Networking",
      price: 0,
      startTime: "18:00",
      endTime: "21:00",
    },
    {
      id: 5,
      name: "Past Tech Meetup",
      description:
        "Networking event for developers and tech enthusiasts. Share ideas, collaborate on projects, and make new connections.",
      date: "2025-03-10",
      organizer: { username: "TechHub" },
      image: "",
      location: "Seattle, WA",
      category: "Meetup",
      price: 0,
      startTime: "19:00",
      endTime: "21:00",
    },
    {
      id: 6,
      name: "Design Workshop",
      description:
        "Learn UI/UX design principles from industry experts. Hands-on workshop with practical exercises and portfolio reviews.",
      date: "2025-09-05",
      organizer: { username: "DesignLab" },
      image: "",
      location: "Chicago, IL",
      category: "Workshop",
      price: 79,
      startTime: "10:00",
      endTime: "15:00",
    },
  ];

  useEffect(() => {
    setUpcomingEvents(staticEvents);
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = upcomingEvents.filter((event) => {
      const nameMatch = event?.name
        ?.toLowerCase()
        .includes(query.toLowerCase());
      const descriptionMatch = event?.description
        ?.toLowerCase()
        .includes(query.toLowerCase());
      const organizerMatch = event?.organizer?.username
        ?.toLowerCase()
        .includes(query.toLowerCase());
      return nameMatch || descriptionMatch || organizerMatch;
    });

    setSearchResults(results);
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const debounceTimeout = setTimeout(() => handleSearch(query), 300);
    return () => clearTimeout(debounceTimeout);
  };

  const sortedEvents = upcomingEvents
    ? [
        ...upcomingEvents
          .filter((event) => new Date(event.date) > new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date)),
        ...upcomingEvents
          .filter((event) => new Date(event.date) <= new Date())
          .sort((a, b) => new Date(b.date) - new Date(a.date)),
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <div className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-purple-600/70 z-10"></div>
        <img
          src={img || "/placeholder.svg"}
          className="absolute inset-0 w-full h-full object-cover object-center"
          alt=""
        />
        <div className="relative z-20 text-center">
          <h1 className="qwigley-regular text-7xl sm:text-8xl md:text-9xl text-white font-bold">
            {defaultTexts.eventCard.title}
          </h1>
        </div>
      </div>

      <div className="px-4 py-8 -mt-6 relative z-20">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8 md:w-1/2 lg:w-1/3 mt-3">
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex-grow">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={
                  defaultTexts.eventCard.searchPlaceholder || "Search events..."
                }
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
            >
              {defaultTexts.eventCard.searchButton}
            </button>
          </form>
        </div>

        {/* Search Results */}
        {searchQuery.trim() && searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {defaultTexts.eventCard.searchResults}
            </h2>
            <div className="flex flex-col md:flex-row flex-wrap gap-5">
              {searchResults.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>
        )}

        {searchQuery.trim() && searchResults.length > 0 && (
          <hr className="my-8 border-gray-200" />
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {searchQuery.trim() && searchResults.length > 0
              ? "All Events"
              : "Events"}
          </h2>
          <div className="flex flex-col md:flex-row flex-wrap gap-5">
            {sortedEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsPage;
