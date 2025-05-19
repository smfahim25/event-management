import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EventPreferences() {
  const [selectedEvents, setSelectedEvents] = useState({
    concerts: false,
    sports: false,
    theater: false,
    festivals: false,
    conferences: false,
    art: false,
    food: false,
    outdoor: false,
  });

  const navigate = useNavigate();

  // Handler for checkbox changes
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedEvents({
      ...selectedEvents,
      [name]: checked,
    });
  };

  const hasSelections = Object.values(selectedEvents).some((value) => value);

  const eventIcons = {
    concerts: "🎵",
    sports: "🏆",
    theater: "🎭",
    festivals: "🎪",
    conferences: "💼",
    art: "🎨",
    food: "🍽️",
    outdoor: "🏞️",
  };

  return (
    <div className="max-w-3xl lg:mt-10 xl:mt-20 mx-auto p-8 bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg border border-blue-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-800">
          Event Preferences
        </h2>
        <p className="text-purple-600 mt-2 text-lg">
          What types of events do you enjoy?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.keys(selectedEvents).map((eventType) => (
          <div
            key={eventType}
            className={`flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              selectedEvents[eventType]
                ? "bg-blue-100 border-2 border-blue-400 shadow-md transform scale-105"
                : "bg-white border-2 border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => {
              setSelectedEvents({
                ...selectedEvents,
                [eventType]: !selectedEvents[eventType],
              });
            }}
          >
            <div
              className={`flex items-center justify-center h-8 w-8 rounded-full mr-3 text-lg ${
                selectedEvents[eventType]
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {eventIcons[eventType]}
            </div>
            <div className="flex-1">
              <label
                htmlFor={eventType}
                className={`select-none font-medium ${
                  selectedEvents[eventType] ? "text-blue-700" : "text-gray-700"
                }`}
              >
                {eventType === "art"
                  ? "Art Exhibits"
                  : eventType === "food"
                  ? "Food & Drink"
                  : eventType === "outdoor"
                  ? "Outdoor Activities"
                  : eventType.charAt(0).toUpperCase() + eventType.slice(1)}
              </label>
            </div>
            <input
              type="checkbox"
              id={eventType}
              name={eventType}
              checked={selectedEvents[eventType]}
              onChange={handleCheckboxChange}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ))}
      </div>

      {hasSelections && (
        <div className="mt-6 p-5 bg-blue-100 rounded-lg border-l-4 border-blue-500 animate-fadeIn">
          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <span className="mr-2">✓</span> Your selections:
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedEvents)
              .filter(([, isSelected]) => isSelected)
              .map(([eventType]) => (
                <span
                  key={eventType}
                  className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium flex items-center"
                >
                  <span className="mr-1">{eventIcons[eventType]}</span>
                  {eventType === "art"
                    ? "Art Exhibits"
                    : eventType === "food"
                    ? "Food & Drink"
                    : eventType === "outdoor"
                    ? "Outdoor Activities"
                    : eventType.charAt(0).toUpperCase() + eventType.slice(1)}
                </span>
              ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row sm:justify-between gap-3">
        <button
          className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            hasSelections
              ? "bg-purple-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-1"
              : "bg-purple-300 text-white cursor-not-allowed"
          }`}
          onClick={() => {
            if (hasSelections) {
              // Handle submit logic here
              window.location.href = "/";
            }
          }}
          disabled={!hasSelections}
        >
          Submit Preferences
        </button>
        <button
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          onClick={() => {
            // Handle skip logic here
            navigate("/");
            setSelectedEvents({
              concerts: false,
              sports: false,
              theater: false,
              festivals: false,
              conferences: false,
              art: false,
              food: false,
              outdoor: false,
            });
          }}
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}
