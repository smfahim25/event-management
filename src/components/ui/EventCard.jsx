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
  id,
  name = "Untitled Event",
  description = "",
  date,
  organizer = { username: "Unknown" },
  price = 0,
  poster = "https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_640.jpg",
  location = "TBD",
  startTime,
  endTime,
}) => {
  const { defaultTexts } = useData();
  const navigate = useNavigate();

  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const renderLiveIndicator = () => {
    if (!startTime || !endTime || !date) return null;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const eventDate = new Date(date);
    const start = new Date(eventDate);
    const end = new Date(eventDate);

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
    if (Array.isArray(price)) {
      eventPrice = price[0]?.value ?? 0;
    } else if (typeof price === "number") {
      eventPrice = price;
    }

    return eventPrice === 0 ? "FREE" : `$${eventPrice}`;
  };

  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/app/eventDetails/${_id || id}`)}
      className="w-full sm:w-[320px] h-[400px] rounded-xl overflow-hidden bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
    >
      <div className="relative w-full h-[180px] min-h-[180px] overflow-hidden flex-shrink-0">
        <img
          src={poster || "/placeholder.svg"}
          alt="event poster"
          className="object-cover h-full w-full transition-transform duration-500 hover:scale-105"
        />
        {renderLiveIndicator()}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-gray-800 line-clamp-1 mb-1">
          {name}
        </h2>

        <div className="h-[40px] mb-2">
          <p className="text-gray-600 text-sm line-clamp-2">
            {truncateText(description, 45)}
          </p>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-1">
          <FaCalendarAlt className="mr-2 text-purple-500 flex-shrink-0" />
          <span className="truncate">
            {date &&
              new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </span>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-1">
          <FaMapMarkerAlt className="mr-2 text-purple-500 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        <div className="flex-grow"></div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center text-sm">
            <FaUser className="mr-2 text-purple-500 flex-shrink-0" />
            <span className="text-gray-700 truncate">
              {defaultTexts?.eventCard?.organizedBy || "Organized by"}{" "}
              <span className="text-[#E167FF]">{organizer.username}</span>
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
  name: PropTypes.string,
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
