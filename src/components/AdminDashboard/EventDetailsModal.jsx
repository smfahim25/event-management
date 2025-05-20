import { Calendar, Clock, MapPin, Tag, Ticket, Users } from "lucide-react";

export default function EventDetailsModal({ event, onClose }) {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {event.eventName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Event Images */}
          <div className="mb-8">
            {event.eventImages && event.eventImages.length > 0 ? (
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/api/placeholder/800/400"
                  alt={event.eventName}
                  className="w-full object-cover h-52"
                />
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden bg-gray-200 h-64 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{event.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-blue-600" />
                    <span>
                      {formatTime(event.startTime)} -{" "}
                      {formatTime(event.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                    <span>
                      {event.venue.name}, {event.venue.address.street},{" "}
                      {event.venue.address.city}, {event.venue.address.state},{" "}
                      {event.venue.address.country},{" "}
                      {event.venue.address.zipCode}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3 text-blue-600" />
                    <span>Capacity: {event.totalCapacity}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-gray-200 rounded-full flex items-center"
                    >
                      <Tag className="w-4 h-4 mr-1 text-gray-600" />
                      <span className="text-sm text-gray-700">{tag}</span>
                    </div>
                  ))}
                  <div className="px-3 py-1 bg-blue-100 rounded-full flex items-center">
                    <span className="text-sm text-blue-700">
                      {event.eventCategory.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Ticket Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Ticket Information</h3>
              <div className="space-y-6">
                {event.ticketTiers.map((tier, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-white"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-lg">{tier.name}</h4>
                      <span className="font-bold text-lg">${tier.price}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Ticket className="w-4 h-4 mr-1" />
                      <span>
                        {tier.availableQuantity - tier.sold} tickets available
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      Max {tier.maxPerOrder} tickets per order
                    </div>
                  </div>
                ))}

                {/* Status Badge */}
                <div className="mt-4">
                  <span className="text-md text-gray-600 font-semibold mb-2 mr-2">
                    Status:
                  </span>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      event.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : event.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {event.status === "approved"
                      ? event.status
                      : event.status === "rejected"
                      ? event.status
                      : event.status}
                  </div>
                </div>

                {/* Organizer Info */}
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Organized by:</h4>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-2">
                      {event.organizerId.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{event.organizerId.name}</p>
                      <p className="text-sm text-gray-600">
                        {event.organizerId.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1 border border-gray-300 rounded-lg text-gray-700 mr-2 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
