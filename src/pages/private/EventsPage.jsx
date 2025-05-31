import { useEffect, useState } from "react";
import EventCard from "../../components/ui/EventCard";
import Nav from "../../components/Nav";
import img from "../../assets/eventPage.jpg";
import { useData } from "../../context/DataContext";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiTag, FiCalendar, FiMapPin } from "react-icons/fi";
import { useEventStore } from "../../store/EventStore";
import { useCategoryStore } from "../../store/CategoryStore";
import { FileSearch2 } from "lucide-react";

const europeanCities = [
  "Amsterdam",
  "Athens",
  "Barcelona",
  "Berlin",
  "Bern",
  "Bratislava",
  "Brussels",
  "Bucharest",
  "Budapest",
  "Copenhagen",
  "Dublin",
  "Edinburgh",
  "Helsinki",
  "Lisbon",
  "Ljubljana",
  "London",
  "Luxembourg",
  "Madrid",
  "Oslo",
  "Paris",
  "Prague",
  "Reykjavik",
  "Riga",
  "Rome",
  "Stockholm",
  "Tallinn",
  "Vienna",
  "Vilnius",
  "Warsaw",
  "Zagreb",
  "Zurich",
  "Milan",
  "Florence",
  "Venice",
  "Naples",
  "Munich",
  "Hamburg",
  "Cologne",
  "Frankfurt",
  "Stuttgart",
  "Manchester",
  "Birmingham",
  "Liverpool",
  "Glasgow",
  "Bristol",
  "Lyon",
  "Marseille",
  "Nice",
  "Toulouse",
  "Bordeaux",
  "Seville",
  "Valencia",
  "Bilbao",
  "Porto",
  "Krakow",
  "Gdansk",
  "Wroclaw",
  "Poznan",
  "Antwerp",
  "Ghent",
  "Rotterdam",
  "The Hague",
  "Utrecht",
  "Gothenburg",
  "Malmo",
].sort();

function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [page, setPage] = useState(1);
  const [limit /*setLimit*/] = useState(10);
  const { defaultTexts } = useData();

  const {
    events,
    fetchAllEvents,
    loading: eventsLoading,
    error: eventsError,
    total,
  } = useEventStore();

  const {
    categories,
    fetchCategories,
    loading: categoriesLoading,
  } = useCategoryStore();

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    fetchCategories();
    fetchAllEvents({
      searchTerm: "",
      eventCategory: "",
      city: "",
      page,
      limit,
    });
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchAllEvents({
        searchTerm: searchQuery,
        eventCategory: selectedCategory,
        city: selectedCity,
        today: timeFilter === "today",
        thisWeek: timeFilter === "thisWeek",
        thisMonth: timeFilter === "thisMonth",
        page,
        limit,
      });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [
    searchQuery,
    selectedCategory,
    selectedCity,
    timeFilter,
    page,
    limit,
    fetchAllEvents,
  ]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
    setPage(1);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setPage(1);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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

      <div className="px-6 py-8 -mt-6 relative z-20 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <form
            className="flex flex-col lg:flex-row items-center gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex-grow w-full lg:w-64">
              <label
                htmlFor="eventSearch"
                className="mb-2 flex items-center text-sm font-medium text-gray-700"
              >
                <FileSearch2 className="mr-2 h-4 w-4 text-purple-500" />
                {defaultTexts.events.find}
              </label>

              <div className="relative">
                <FaSearch className="absolute left-4 top-6 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="eventSearch"
                  placeholder={
                    defaultTexts.eventCard.searchPlaceholder ||
                    "Search events..."
                  }
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="w-full lg:w-56">
              <label
                htmlFor="eventCategory"
                className="mb-2 flex items-center text-sm font-medium text-gray-700"
              >
                <FiTag className="mr-2 h-4 w-4 text-purple-500" />
                {defaultTexts.events.category}
              </label>
              <select
                id="eventCategory"
                name="eventCategory"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                disabled={categoriesLoading}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full lg:w-56">
              <label
                htmlFor="cityFilter"
                className="mb-2 flex items-center text-sm font-medium text-gray-700"
              >
                <FiMapPin className="mr-2 h-4 w-4 text-purple-500" />
                {defaultTexts.events.city}
              </label>
              <select
                id="cityFilter"
                name="cityFilter"
                value={selectedCity}
                onChange={handleCityChange}
                className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
              >
                <option value="">All Cities</option>
                {europeanCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full lg:w-56">
              <label
                htmlFor="timeFilter"
                className="mb-2 flex items-center text-sm font-medium text-gray-700"
              >
                <FiCalendar className="mr-2 h-4 w-4 text-purple-500" />
                {defaultTexts.events.time}
              </label>
              <select
                id="timeFilter"
                name="timeFilter"
                value={timeFilter}
                onChange={handleTimeFilterChange}
                className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
              </select>
            </div>
          </form>
        </div>

        {eventsLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        )}

        {eventsError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error loading events: {eventsError}</p>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {searchQuery || selectedCategory || selectedCity || timeFilter
              ? "Search Results"
              : "All Events"}
            {total > 0 && (
              <span className="text-sm text-gray-500 ml-2">
                (Page {page} of {totalPages} - {total} total events)
              </span>
            )}
          </h2>

          {events.length === 0 && !eventsLoading ? (
            <div className="text-center py-8 text-gray-500">
              No events found. Try adjusting your search criteria.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-5">
                {events.map((event) => (
                  <EventCard key={event._id} {...event} />
                ))}
              </div>

              {/* Enhanced Pagination */}
              {total > limit && (
                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      page === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    <FaChevronLeft className="mr-2" />
                    Previous
                  </button>

                  <span className="text-gray-700">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      page === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    Next
                    <FaChevronRight className="ml-2" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventsPage;
