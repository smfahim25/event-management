import { useState } from "react";
import Nav from "../../components/Nav";
import { useNavigate, useParams } from "react-router-dom";
import { VscOrganization } from "react-icons/vsc";
import {
  FaRegCalendar,
  FaRegClock,
  FaPlayCircle,
  FaShare,
  FaHeart,
  FaTicketAlt,
  FaChartBar,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import RegisterForm from "./RegisterEvent";
import { useData } from "../../context/DataContext";

const EventsDetails = () => {
  const { eventID } = useParams();
  const navigate = useNavigate();
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isBought /*setIsBought*/] = useState(false);
  const { defaultTexts } = useData();
  const [showMap, setShowMap] = useState(false);

  const scrollToSection = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const details = {
    name: "AI Summit 2025",
    description:
      "Join us to explore the latest trends in artificial intelligence and machine learning. This premier event brings together industry leaders, researchers, and enthusiasts for a day of insightful presentations, hands-on workshops, and networking opportunities. Learn about cutting-edge AI applications, ethical considerations, and future directions in this rapidly evolving field.",
    poster:
      "https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_640.jpg",
    organizer: {
      _id: localStorage.getItem("user_id"),
      username: "Tech Community",
      email: "organizer@example.com",
    },
    date: "2025-05-10",
    startTime: "10:00",
    endTime: "15:00",
    location: "Tech Park, San Francisco",
    limit: 100,
    tickets: new Array(37).fill({}), // 37 dummy tickets
    price: [
      { label: "General Admission", value: 50 },
      { label: "VIP", value: 100 },
    ],
  };

  const isEventLive = () => {
    if (!details || !details.startTime || !details.endTime || !details.date)
      return false;

    const [startHour, startMinute] = details.startTime.split(":");
    const [endHour, endMinute] = details.endTime.split(":");

    const eventDate = new Date(details.date);
    const startDate = new Date(eventDate);
    const endDate = new Date(eventDate);

    startDate.setHours(
      Number.parseInt(startHour),
      Number.parseInt(startMinute),
      0,
      0
    );
    endDate.setHours(
      Number.parseInt(endHour),
      Number.parseInt(endMinute),
      0,
      0
    );

    const currentTime = new Date();
    return currentTime >= startDate && currentTime <= endDate;
  };

  const calculateProgress = () => {
    return (details.tickets.length / details.limit) * 100;
  };

  return (
    <section className="min-h-screen bg-gray-50">
      <Nav />
      {details && (
        <div>
          <div className="relative h-[50vh] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10"></div>
            <img
              src={details.poster || "/placeholder.svg"}
              alt="Event Poster"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full flex items-center z-20">
              <div className="container mx-auto px-6">
                <div className="max-w-3xl">
                  {isEventLive() && (
                    <div className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-full mb-4 shadow-lg">
                      <FaPlayCircle size={18} className="mr-2" />
                      <span className="font-semibold">LIVE NOW</span>
                    </div>
                  )}
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
                    {details.name}
                  </h1>
                  <div className="flex items-center text-white/90 mb-2">
                    <FaRegCalendar className="mr-2" />
                    <span>
                      {new Date(details.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-white/90">
                    <IoLocationOutline size={20} className="mr-2" />
                    <span>{details.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md py-4 sticky top-16 z-30">
            <div className="container mx-auto px-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => scrollToSection("details")}
                    className="text-gray-700 hover:text-purple-600 font-medium"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => scrollToSection("tickets")}
                    className="text-gray-700 hover:text-purple-600 font-medium"
                  >
                    Tickets
                  </button>
                  <button
                    onClick={() => scrollToSection("organizer")}
                    className="text-gray-700 hover:text-purple-600 font-medium"
                  >
                    Organizer
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center text-gray-700 hover:text-purple-600">
                    <FaShare className="mr-2" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                  <button className="flex items-center text-gray-700 hover:text-purple-600">
                    <FaHeart className="mr-2" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-2/3" id="details">
                <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    About This Event
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {details.description}
                  </p>

                  <div className="mt-8">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 font-medium">
                        Tickets Remaining
                      </span>
                      <span className="text-gray-800 font-bold">
                        {details.limit - details.tickets.length} of{" "}
                        {details.limit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{ width: `${calculateProgress()}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {details.tickets.length} tickets sold
                    </p>
                  </div>
                </div>

                <div
                  className="bg-white rounded-xl shadow-sm p-8 mb-8"
                  id="organizer"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Event Details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Date & Time
                      </h3>
                      <div className="flex items-start mb-4">
                        <FaRegCalendar
                          size={22}
                          className="text-purple-500 mt-1 mr-4"
                        />
                        <div>
                          <p className="font-medium">
                            {new Date(details.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      {details.startTime && details.endTime && (
                        <div className="flex items-start">
                          <FaRegClock
                            size={22}
                            className="text-purple-500 mt-1 mr-4"
                          />
                          <div>
                            <p className="font-medium">
                              {(() => {
                                const startTime = details.startTime.split(" ");
                                const startDate = new Date();
                                const [startHour, startMinute] =
                                  startTime[0].split(":");
                                startDate.setHours(
                                  startHour,
                                  startMinute,
                                  0,
                                  0
                                );

                                const endTime = details.endTime.split(" ");
                                const endDate = new Date();
                                const [endHour, endMinute] =
                                  endTime[0].split(":");
                                endDate.setHours(endHour, endMinute, 0, 0);

                                return (
                                  <>
                                    {startDate.toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}{" "}
                                    -{" "}
                                    {endDate.toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </>
                                );
                              })()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {isEventLive()
                                ? "Event is happening now"
                                : "Local time"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Location
                      </h3>
                      <div className="flex items-start">
                        <IoLocationOutline
                          size={24}
                          className="text-purple-500 mt-1 mr-4"
                        />
                        <div>
                          <p className="font-medium">{details.location}</p>
                          <p className="text-sm text-gray-500">Venue</p>
                          <button
                            onClick={() => setShowMap(!showMap)}
                            className="mt-2 flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors"
                          >
                            {showMap ? (
                              <>
                                Hide Map <IoIosArrowUp className="ml-1" />
                              </>
                            ) : (
                              <>
                                Show Map <IoIosArrowDown className="ml-1" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`mt-4 rounded-lg overflow-hidden shadow-md transition-all duration-500 ease-in-out w-full ${
                      showMap
                        ? "h-[300px] opacity-100 mb-4 transform scale-100"
                        : "h-0 opacity-0 transform scale-95"
                    }`}
                    style={{
                      maxHeight: showMap ? "300px" : "0px",
                      transform: showMap
                        ? "translateY(0)"
                        : "translateY(-10px)",
                      transformOrigin: "top center",
                    }}
                  >
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50470.77791667087!2d-122.47606619235352!3d37.77492951404477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1651234567890!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Event Location"
                      className="rounded-lg"
                    ></iframe>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Organizer
                    </h3>
                    <div className="flex items-start">
                      <VscOrganization
                        size={24}
                        className="text-purple-500 mt-1 mr-4"
                      />
                      <div>
                        <p className="font-medium">
                          {details.organizer.username}
                        </p>
                        <a
                          href={`mailto:${details.organizer.email}`}
                          className="text-purple-600 hover:underline text-sm"
                        >
                          {details.organizer.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/3" id="tickets">
                {details.organizer._id === localStorage.getItem("user_id") ? (
                  <div className="bg-white rounded-xl shadow-sm p-8 sticky top-32">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                      <FaChartBar className="mr-3 text-purple-500" />
                      {defaultTexts.eventDetails.eventanalytics}
                    </h3>

                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <FaTicketAlt className="mr-2 text-purple-500" />
                          Ticket Overview
                        </h4>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {defaultTexts.eventDetails.totalTickets}
                            </span>
                            <span className="font-semibold">
                              {details.limit}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {defaultTexts.eventDetails.ticketsSold}
                            </span>
                            <span className="font-semibold">
                              {details.tickets.length}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              {defaultTexts.eventDetails.ticketsRemaining}
                            </span>
                            <span className="font-semibold">
                              {details.limit - details.tickets.length}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-purple-600 h-2.5 rounded-full"
                              style={{ width: `${calculateProgress()}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-2 text-right">
                            {Math.round(calculateProgress())}% sold
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          {defaultTexts.eventDetails.financialOverview}
                        </h4>

                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">
                            {defaultTexts.eventDetails.totalSales}
                          </span>
                          <span className="font-semibold text-green-600">
                            $
                            {Array.isArray(details.price)
                              ? details.price.reduce(
                                  (total, p) =>
                                    total + p.value * details.tickets.length,
                                  0
                                )
                              : details.price * details.tickets.length}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 mt-6">
                        <button
                          onClick={() => navigate("/app/edit-Event/" + eventID)}
                          className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
                        >
                          <FaEdit className="mr-2" />
                          {defaultTexts.eventDetails.editEventButton}
                        </button>

                        <button className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors duration-200">
                          <FaTrash className="mr-2" />
                          Delete Event
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="sticky top-32">
                    {isBought ? (
                      <div className="bg-white rounded-xl shadow-sm p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                          {defaultTexts.eventDetails.viewTicketButton}
                        </h3>
                      </div>
                    ) : (
                      <RegisterForm
                        details={details}
                        ticketQuantity={ticketQuantity}
                        setTicketQuantity={setTicketQuantity}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-5">
        <RegisterForm
          details={details}
          ticketQuantity={ticketQuantity}
          setTicketQuantity={setTicketQuantity}
        />
      </div>
    </section>
  );
};

export default EventsDetails;
