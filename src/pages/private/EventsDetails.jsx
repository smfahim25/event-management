import { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import { useNavigate, useParams } from "react-router-dom";
import { VscOrganization } from "react-icons/vsc";
import {
  FaRegCalendar,
  FaRegClock,
  FaPlayCircle,
  FaTicketAlt,
  FaChartBar,
  FaEdit,
  FaTrash,
  FaTag,
  FaUsers,
  FaExclamationTriangle,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import RegisterForm from "./RegisterEvent";
import { useData } from "../../context/DataContext";
import { useEventStore } from "../../store/EventStore";
import { useAuthStore } from "../../store/AuthStore";

const EventsDetails = () => {
  const { eventID } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { defaultTexts } = useData();
  const [showMap, setShowMap] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    selectedEvent,
    fetchEventById,
    deleteEvent,
    loading: eventLoading,
    error: eventError,
  } = useEventStore();

  useEffect(() => {
    if (eventID) {
      fetchEventById(eventID);
    }
  }, [eventID, fetchEventById]);

  const scrollToSection = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isEventLive = () => {
    if (
      !selectedEvent ||
      !selectedEvent.startTime ||
      !selectedEvent.endTime ||
      !selectedEvent.eventDate
    )
      return false;

    const [startHour, startMinute] = selectedEvent.startTime.split(":");
    const [endHour, endMinute] = selectedEvent.endTime.split(":");

    const eventDate = new Date(selectedEvent.eventDate);
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

  const handleTicketTypeSelect = (ticketType) => {
    setSelectedTicketType(ticketType);
    scrollToSection("register-form");
  };

  const calculateProgress = () => {
    if (!selectedEvent) return 0;
    const totalSold = selectedEvent.ticketTiers.reduce(
      (sum, tier) => sum + tier.sold,
      0
    );
    return (totalSold / selectedEvent.totalTickets) * 100;
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await deleteEvent(eventID);
      // Navigate back to events list or dashboard after successful deletion
      navigate("/app/events");
    } catch (error) {
      console.error("Error deleting event:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="container mx-auto px-6 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error loading event: {eventError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="container mx-auto px-6 py-12 text-center">
          <p>Event not found</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <Nav />
      <div>
        <div className="relative h-[50vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10 "></div>
          <img
            src={selectedEvent.eventImages?.[0] || "/placeholder.svg"}
            alt="Event Poster"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full flex items-center z-20 bg-black/50">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center bg-purple-600 text-white px-3 py-1 rounded-full mb-3 shadow-lg">
                  <FaTag size={14} className="mr-1.5" />
                  <span className="font-medium text-sm">
                    {selectedEvent.eventCategory?.name || "Event"}
                  </span>
                </div>

                {isEventLive() && (
                  <div className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-full mb-4 shadow-lg ml-2">
                    <FaPlayCircle size={18} className="mr-2" />
                    <span className="font-semibold">LIVE NOW</span>
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
                  {selectedEvent.eventName}
                </h1>
                <div className="flex items-center text-white/90 mb-2">
                  <FaRegCalendar className="mr-2" />
                  <span>
                    {new Date(selectedEvent.eventDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center text-white/90">
                  <IoLocationOutline size={20} className="mr-2" />
                  <span>
                    {selectedEvent.venue?.name ||
                      selectedEvent.venue?.address?.city ||
                      "Location not specified"}
                  </span>
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
                  {defaultTexts.eventDetails.details}
                </button>
                <button
                  onClick={() => scrollToSection("tickets")}
                  className="text-gray-700 hover:text-purple-600 font-medium"
                >
                  {defaultTexts.eventDetails.tickets}
                </button>
                <button
                  onClick={() => scrollToSection("organizer")}
                  className="text-gray-700 hover:text-purple-600 font-medium"
                >
                  {defaultTexts.eventDetails.organizer}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3 mx-auto" id="details">
              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    <FaTag size={12} className="mr-1.5" />
                    {selectedEvent.eventCategory?.name || "Event"}
                  </span>
                  {isEventLive() && (
                    <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      <FaPlayCircle size={12} className="mr-1.5" />
                      Live Now
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {defaultTexts.eventDetails.aboutevent}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {selectedEvent.description}
                </p>
              </div>

              {user?.role === "user" && (
                <div
                  className="bg-white rounded-xl shadow-sm p-8 mb-8"
                  id="tickets"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {defaultTexts.eventDetails.ticketType}
                  </h2>

                  <div className="space-y-4">
                    {selectedEvent.ticketTiers.map((ticket, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 transition-all ${
                          selectedTicketType === ticket
                            ? "border-purple-500 bg-purple-50 shadow-md"
                            : "border-gray-200 hover:border-purple-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-3 md:mb-0">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {ticket.name}
                            </h3>
                            <div className="flex items-center mt-1 text-sm text-gray-600">
                              <FaUsers
                                className="mr-1.5 text-gray-400"
                                size={14}
                              />
                              <span>
                                {ticket.availableQuantity} remaining (
                                {ticket.sold} sold)
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-4">
                            <span className="text-xl font-bold text-purple-600">
                              ${ticket.price.toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleTicketTypeSelect(ticket)}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                            >
                              Select
                            </button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-purple-600 h-1.5 rounded-full"
                              style={{
                                width: `${
                                  (ticket.sold / ticket.availableQuantity) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="bg-white rounded-xl shadow-sm p-8 mb-8"
                id="organizer"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {defaultTexts.eventDetails.eventDetails}
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      {defaultTexts.eventDetails.datetime}
                    </h3>
                    <div className="flex items-start mb-4">
                      <FaRegCalendar
                        size={22}
                        className="text-purple-500 mt-1 mr-4"
                      />
                      <div>
                        <p className="font-medium">
                          {new Date(selectedEvent.eventDate).toLocaleDateString(
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

                    {selectedEvent.startTime && selectedEvent.endTime && (
                      <div className="flex items-start">
                        <FaRegClock
                          size={22}
                          className="text-purple-500 mt-1 mr-4"
                        />
                        <div>
                          <p className="font-medium">
                            {selectedEvent.startTime} - {selectedEvent.endTime}
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
                      {defaultTexts.eventDetails.location}
                    </h3>
                    <div className="flex items-start">
                      <IoLocationOutline
                        size={24}
                        className="text-purple-500 mt-1 mr-4"
                      />
                      <div>
                        <p className="font-medium">
                          {selectedEvent.venue?.name || "Venue not specified"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedEvent.venue?.address?.street &&
                            `${selectedEvent.venue.address.street}, `}
                          {selectedEvent.venue?.address?.city &&
                            `${selectedEvent.venue.address.city}, `}
                          {selectedEvent.venue?.address?.state &&
                            `${selectedEvent.venue.address.state}, `}
                          {selectedEvent.venue?.address?.zipCode &&
                            `${selectedEvent.venue.address.zipCode}`}
                        </p>
                        {selectedEvent?.venue?.mapUrl && (
                          <button
                            onClick={() => setShowMap(!showMap)}
                            className="mt-2 flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors"
                          >
                            {showMap ? (
                              <>
                                {defaultTexts.eventDetails.hidemap}{" "}
                                <IoIosArrowUp className="ml-1" />
                              </>
                            ) : (
                              <>
                                {defaultTexts.eventDetails.showmap}{" "}
                                <IoIosArrowDown className="ml-1" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {showMap && (
                  <div className="mt-4 rounded-lg overflow-hidden shadow-md w-full h-[300px]">
                    <iframe
                      src={selectedEvent.venue?.mapUrl}
                      width="600"
                      height="450"
                      loading="lazy"
                      className="w-full"
                    ></iframe>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2 mt-8">
                    {defaultTexts.eventDetails.refund}
                  </h3>
                  {selectedEvent?.refundPolicy?.rules.length > 0 ? (
                    <div className="text-gray-500">
                      {selectedEvent?.refundPolicy?.rules[0]?.description}
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      No refund policy for this event
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    {defaultTexts.eventDetails.organizer}
                  </h3>
                  <div className="flex items-start">
                    <VscOrganization
                      size={24}
                      className="text-purple-500 mt-1 mr-4"
                    />
                    <div>
                      <p className="font-medium">
                        {selectedEvent.organizerId?.name}
                      </p>
                      <a
                        href={`mailto:${selectedEvent.organizerId?.email}`}
                        className="text-purple-600 hover:underline text-sm"
                      >
                        {selectedEvent.organizerId?.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selectedEvent.organizerId?._id === user._id && (
              <div className="lg:w-1/3">
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
                            {selectedEvent.totalTickets}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {defaultTexts.eventDetails.ticketsSold}
                          </span>
                          <span className="font-semibold">
                            {selectedEvent.ticketTiers.reduce(
                              (sum, tier) => sum + tier.sold,
                              0
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {defaultTexts.eventDetails.ticketsRemaining}
                          </span>
                          <span className="font-semibold">
                            {selectedEvent.totalTickets -
                              selectedEvent.ticketTiers.reduce(
                                (sum, tier) => sum + tier.sold,
                                0
                              )}
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
                        {defaultTexts.eventDetails.ticketBreak}
                      </h4>
                      <div className="space-y-4">
                        {selectedEvent.ticketTiers.map((ticket, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">
                                {ticket.name}
                              </span>
                              <span className="font-semibold">
                                {ticket.sold} / {ticket.availableQuantity}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-purple-600 h-1.5 rounded-full"
                                style={{
                                  width: `${
                                    (ticket.sold / ticket.availableQuantity) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
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
                          {selectedEvent.ticketTiers
                            .reduce((total, p) => total + p.price * p.sold, 0)
                            .toFixed(2)}
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

                      <button
                        onClick={handleDeleteClick}
                        className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors duration-200"
                      >
                        <FaTrash className="mr-2" />
                        {defaultTexts.eventDetails.delete}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <FaExclamationTriangle className="text-red-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Event
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete {selectedEvent.eventName}? This
              will permanently remove the event and all associated data.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash className="mr-2" />
                    {defaultTexts.eventDetails.delete}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {user.role === "user" && (
        <div id="register-form">
          <RegisterForm
            event={selectedEvent}
            selectedTicketType={selectedTicketType}
            onClose={() => setSelectedTicketType(null)}
          />
        </div>
      )}
    </section>
  );
};

export default EventsDetails;
