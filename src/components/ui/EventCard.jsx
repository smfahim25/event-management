import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import {
  FaPlayCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";
import PropTypes from "prop-types";

const EventCard = ({
  _id,
  eventName = "Untitled Event",
  description = "",
  eventDate,
  ticketTiers,
  eventImages,
  venue,
  startTime,
  endTime,
  organizerId,
  tags,
  status,
}) => {
  const { defaultTexts } = useData();
  const navigate = useNavigate();

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
          <FaPlayCircle size={16} className="mr-2" />
          <p className="font-medium text-sm">Live</p>
        </div>
      );
    }

    return null;
  };

  const formatPrice = () => {
    let eventPrice = 0;
    if (Array.isArray(ticketTiers)) {
      eventPrice = ticketTiers[0]?.price ?? 0;
    } else if (typeof price === "number") {
      eventPrice = ticketTiers[0]?.price;
    }

    return eventPrice === 0 ? "FREE" : `$${eventPrice}`;
  };

  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/app/eventDetails/${_id}`)}
      className="w-full md:w-[285px] lg:w-[285px] h-[400px] rounded-xl overflow-hidden bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
    >
      <div className="relative w-full h-[180px] min-h-[180px] overflow-hidden flex-shrink-0">
        <img
          src={eventImages[0] || "/placeholder.svg"}
          alt="event poster"
          className="object-cover h-full w-full transition-transform duration-500 hover:scale-105"
        />
        {renderLiveIndicator()}
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
          <FaCalendarAlt className="mr-2 text-purple-500 flex-shrink-0" />
          <span className="truncate">
            {eventDate &&
              new Date(eventDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </span>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-1">
          <FaMapMarkerAlt className="mr-2 text-purple-500 flex-shrink-0" />
          <span className="truncate">
            {venue?.address?.street}, {venue?.address?.city},
            {venue?.address?.country}- {venue?.address?.zipCode}
          </span>
        </div>

        <div className="flex-grow"></div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center text-sm">
            <FaUser className="mr-2 text-purple-500 flex-shrink-0" />
            <span className="text-gray-700">
              {defaultTexts?.eventCard?.organizedBy || "Organized by"}{" "}
              <span
                className="text-[#E167FF] inline-block max-w-[100px] truncate align-bottom"
                title={organizerId?.name}
              >
                {organizerId?.name}
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
};

EventCard.propTypes = {
  eventName: PropTypes.string,
  _id: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  description: PropTypes.string,
  date: PropTypes.string,
  organizer: PropTypes.shape({
    username: PropTypes.string,
  }),
  price: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.number,
      })
    ),
  ]),
  poster: PropTypes.string,
  location: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
};

export default EventCard;
