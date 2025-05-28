import { Clock, MapPin, Calendar, User, PlayCircle, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";

export default function EventCard({
  _id,
  eventName = "Untitled Event",
  description = "",
  eventDate,
  ticketTiers,
  eventImages = [],
  venue,
  startTime,
  endTime,
  organizerId,
  tags = [],
  status,
}) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const defaultTexts = { eventCard: { organizedBy: "Organized by" } };

  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const renderLiveIndicator = () => {
    if (!startTime || !endTime || !eventDate) return null;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const eventDates = new Date(eventDate);
    const start = new Date(eventDates);
    const end = new Date(eventDates);

    start.setHours(startHour, startMinute, 0, 0);
    end.setHours(endHour, endMinute, 0, 0);

    const now = new Date();

    if (now >= start && now <= end) {
      return (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center shadow-lg">
          <PlayCircle size={16} className="mr-2" />
          <p className="font-medium text-sm">Live</p>
        </div>
      );
    }

    return null;
  };

  const renderStatusBadge = () => {
    if (!status) return null;

    const statusColors = {
      upcoming: "bg-blue-100 text-blue-800",
      live: "bg-green-100 text-green-800",
      approved: "bg-green-300 text-black",
      rejected: "bg-red-100 text-red-800",
      postponed: "bg-yellow-100 text-yellow-800",
    };

    const colorClass =
      statusColors[status.toLowerCase()] || "bg-purple-100 text-purple-800";

    return (
      <div
        className={`absolute top-4 left-4 ${colorClass} px-3 py-1 rounded-full shadow-md`}
      >
        <p className="font-medium text-sm capitalize">{status}</p>
      </div>
    );
  };

  const formatPrice = () => {
    let eventPrice = 0;
    if (Array.isArray(ticketTiers) && ticketTiers.length > 0) {
      eventPrice = ticketTiers[0]?.price ?? 0;
    }

    return eventPrice === 0 ? "FREE" : `$${eventPrice}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div
      onClick={() => navigate(`/app/eventDetails/${_id}`)}
      className="w-full md:w-[285px] lg:w-[285px] h-[450px] rounded-xl overflow-hidden bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col cursor-pointer"
    >
      <div className="relative w-full h-[180px] min-h-[180px] overflow-hidden flex-shrink-0">
        <img
          src={eventImages[0] || "/placeholder.svg?height=180&width=285"}
          alt="event poster"
          className="object-cover h-full w-full transition-transform duration-500 hover:scale-105"
        />
        {renderLiveIndicator()}
        {user?.role === "organizer" && renderStatusBadge()}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-gray-800 line-clamp-1 mb-1">
          {eventName}
        </h2>

        <div className="h-[40px] mb-2">
          <p className="text-gray-600 text-sm line-clamp-2">
            {truncateText(description, 45)}
          </p>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-1">
          <Calendar className="mr-2 text-purple-500 h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {eventDate &&
              new Date(eventDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </span>
        </div>

        {/* Added time display */}
        <div className="flex items-center text-gray-600 text-sm mb-1">
          <Clock className="mr-2 text-purple-500 h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {formatTime(startTime)} - {formatTime(endTime)}
          </span>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-1">
          <MapPin className="mr-2 text-purple-500 h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {venue?.address?.street}, {venue?.address?.city},{" "}
            {venue?.address?.country} - {venue?.address?.zipCode}
          </span>
        </div>

        {/* Added tags display with plain HTML/Tailwind instead of Badge component */}
        {tags && tags.length > 0 && (
          <div className="flex items-start gap-1 mt-2 mb-1 flex-wrap">
            <Tag className="text-purple-500 h-4 w-4 flex-shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex-grow"></div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center text-sm">
            <User className="mr-2 text-purple-500 h-4 w-4 flex-shrink-0" />
            <span className="text-gray-700">
              {defaultTexts?.eventCard?.organizedBy || "Organized by"}{" "}
              <span
                className="text-[#E167FF] inline-block max-w-[100px] truncate align-bottom"
                title={organizerId?.organizerProfile?.organizationName}
              >
                {organizerId?.organizerProfile?.organizationName}
              </span>
            </span>
          </div>

          <div className="text-xl font-bold text-[#E167FF]">
            {formatPrice()}
          </div>
        </div>
      </div>
    </div>
  );
}
