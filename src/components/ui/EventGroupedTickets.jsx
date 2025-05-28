import { useState } from "react";
import {
  FiCalendar,
  FiDownload,
  FiMapPin,
  FiRefreshCw,
  FiUser,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiEye,
} from "react-icons/fi";
import jsPDF from "jspdf";
import { useBookingStore } from "../../store/BookingStore";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/AuthStore";

const EventGroupedTickets = ({ boughtTickets, isRefundable }) => {
  const [expandedEvents, setExpandedEvents] = useState(new Set());
  const [showPreview, setShowPreview] = useState(false);
  const [pdfContent, setPdfContent] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuthStore();
  const { requestRefund } = useBookingStore();

  const generatePdfContent = (ticket, callback) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const loadImage = (url, callback) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url || "/placeholder.svg?height=300&width=400";
      img.onload = () => callback(img);
    };

    const posterUrl =
      //   ticket?.event?.poster ||
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

    doc.setProperties({
      title: `${ticket?.eventName} Ticket`,
      subject: "Event Ticket",
      author: ticket?.event?.organizer?.username || "Event Organizer",
      keywords: "ticket, event, " + ticket.eventName,
      creator: "Ticket System",
    });

    loadImage(posterUrl, (img) => {
      const primaryColor = [41, 128, 185];
      const secondaryColor = [44, 62, 80];
      const accentColor = [231, 76, 60];

      doc.setFillColor(250, 250, 250);
      doc.rect(0, 0, 210, 297, "F");

      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text("EVENT TICKET", 105, 20, { align: "center" });

      doc.setFontSize(12);
      doc.text(`${formatDate(ticket.eventDate)}`, 105, 30, { align: "center" });

      const imgWidth = 180;
      const imgHeight = 80;

      doc.setDrawColor(...secondaryColor);
      doc.setLineWidth(0.5);
      doc.rect(15, 50, imgWidth, imgHeight);
      doc.addImage(img, "JPEG", 15, 50, imgWidth, imgHeight);

      let yPos = 50 + imgHeight + 15;

      doc.setFillColor(...secondaryColor);
      doc.rect(15, yPos - 10, 180, 15, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(ticket.eventName, 105, yPos - 1, { align: "center" });

      yPos += 10;
      doc.setDrawColor(...secondaryColor);
      doc.setLineWidth(0.5);
      // Increased height to accommodate new fields
      doc.roundedRect(15, yPos, 180, 90, 3, 3);

      doc.setTextColor(...secondaryColor);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");

      doc.text("ORGANIZER", 25, yPos + 15);
      doc.text("LOCATION", 25, yPos + 25);
      doc.text("TIME", 25, yPos + 35);
      doc.text("TICKET TYPE", 25, yPos + 45);
      doc.text("PRICE", 25, yPos + 55);
      doc.text("HOLDER NAME", 25, yPos + 65);
      doc.text("PHONE", 25, yPos + 75);

      const formattedTimeRange = `${formatTime(
        ticket.startTime
      )} - ${formatTime(ticket.endTime)}`;
      doc.setFont("helvetica", "normal");
      doc.text(
        ticket.event?.organizer?.username || "Event Organizer",
        85,
        yPos + 15
      );
      doc.text(ticket.location, 85, yPos + 25);
      doc.text(formattedTimeRange, 85, yPos + 35);
      doc.text(ticket.ticketType, 85, yPos + 45);
      doc.text(`${ticket.price.toFixed(2)}`, 85, yPos + 55);
      doc.text(user?.name || "N/A", 85, yPos + 65);
      doc.text(user?.phone || "N/A", 85, yPos + 75);

      if (ticket.qrCodeUrl) {
        const qrImg = new Image();
        qrImg.src = ticket.qrCodeUrl;

        qrImg.onload = () => {
          doc.setDrawColor(...secondaryColor);
          doc.setLineWidth(0.5);
          // Adjusted QR code position to account for increased height
          doc.roundedRect(130, yPos + 15, 55, 55, 3, 3);
          doc.addImage(qrImg, "PNG", 132.5, yPos + 17.5, 50, 50);

          doc.setFontSize(8);
          doc.setTextColor(...accentColor);
          doc.text("SCAN TO VERIFY", 157.5, yPos + 77, { align: "center" });

          finishPdf();
        };

        qrImg.onerror = () => {
          doc.setDrawColor(...secondaryColor);
          doc.setFillColor(240, 240, 240);
          doc.roundedRect(130, yPos + 15, 55, 55, 3, 3, "FD");
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text("QR Code", 157.5, yPos + 35, { align: "center" });
          doc.text("Failed to load", 157.5, yPos + 45, { align: "center" });

          finishPdf();
        };
      } else {
        doc.setDrawColor(...secondaryColor);
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(130, yPos + 15, 55, 55, 3, 3, "FD");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("No QR Code", 157.5, yPos + 40, { align: "center" });

        finishPdf();
      }

      function finishPdf() {
        yPos += 100; // Increased to account for new height
        doc.setFillColor(...accentColor);
        doc.rect(15, yPos, 180, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(
          `TICKET ID: ${ticket.ticketId || ticket._id}`,
          105,
          yPos + 10,
          {
            align: "center",
          }
        );

        doc.setFillColor(...primaryColor);
        doc.rect(0, 277, 210, 20, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text(
          "This ticket is valid only for the event and date specified. Non-transferable.",
          105,
          287,
          { align: "center" }
        );
        doc.text(`Generated on - ${new Date().toLocaleString()}`, 105, 292, {
          align: "center",
        });

        callback(doc.output("datauristring"));
      }
    });
  };

  const handlePreview = (ticket) => {
    if (ticket.eventDate && new Date(ticket.eventDate) < new Date()) return;
    setSelectedTicket(ticket);
    generatePdfContent(ticket, (pdfUri) => {
      setPdfContent(pdfUri);
      setShowPreview(true);
    });
  };

  const handleDownload = (ticket) => {
    generatePdfContent(ticket, (pdfUri) => {
      const link = document.createElement("a");
      link.href = pdfUri;
      link.download = `ticket-${ticket._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Group tickets by event
  const groupedTickets = boughtTickets.reduce((acc, ticket) => {
    const eventKey = ticket.eventId;
    if (!acc[eventKey]) {
      acc[eventKey] = {
        eventInfo: {
          id: ticket.eventId,
          name: ticket.eventName,
          date: ticket.eventDate,
          startTime: ticket.startTime,
          endTime: ticket.endTime,
          location: ticket.location,
          poster: ticket.event?.poster,
          description: ticket.event?.description,
          organizer: ticket.event?.organizer,
        },
        tickets: [],
        totalValue: 0,
      };
    }
    acc[eventKey].tickets.push(ticket);
    acc[eventKey].totalValue += ticket.price;
    return acc;
  }, {});

  const toggleEventExpansion = (eventId) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const getEventStatus = (eventDate) => {
    const now = new Date();
    const event = new Date(eventDate);
    const diffTime = event - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: "Past Event",
        color: "bg-gray-500",
        textColor: "text-gray-700",
      };
    } else if (diffDays === 0) {
      return { text: "Today", color: "bg-red-500", textColor: "text-red-700" };
    } else if (diffDays <= 7) {
      return {
        text: `In ${diffDays} days`,
        color: "bg-orange-500",
        textColor: "text-orange-700",
      };
    } else {
      return {
        text: `In ${diffDays} days`,
        color: "bg-green-500",
        textColor: "text-green-700",
      };
    }
  };

  const handleRequestRefund = (ticket) => {
    setSelectedTicket(ticket);
    setShowRefundModal(true);
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();

    if (!refundReason.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await requestRefund(
        selectedTicket.bookingId || selectedTicket._id,
        refundReason.trim()
      );

      setShowRefundModal(false);
      setRefundReason("");
    } catch (error) {
      console.error("Error submitting refund request:", error);
      toast.error("Failed to submit refund request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefundModalClose = () => {
    setShowRefundModal(false);
    setRefundReason("");
  };

  return (
    <div className="space-y-4 px-2 sm:px-0">
      {Object.entries(groupedTickets).map(([eventId, eventGroup]) => {
        const isExpanded = expandedEvents.has(eventId);
        const status = getEventStatus(eventGroup.eventInfo.date);
        const isPastEvent = new Date(eventGroup.eventInfo.date) < new Date();

        return (
          <div
            key={eventId}
            className="rounded-lg border bg-white shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            {/* Event Header */}
            <div
              className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleEventExpansion(eventId)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Event Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={
                        eventGroup.eventInfo.poster ||
                        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                      }
                      alt={eventGroup.eventInfo.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 space-y-1 sm:space-y-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {eventGroup.eventInfo.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color} text-white self-start sm:self-center`}
                      >
                        {status.text}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-sm text-gray-600 space-y-1 sm:space-y-0">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1.5 h-4 w-4 text-purple-500" />
                        {formatDate(eventGroup.eventInfo.date)}
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-1.5 h-4 w-4 text-purple-500" />
                        {formatTime(eventGroup.eventInfo.startTime)} -{" "}
                        {formatTime(eventGroup.eventInfo.endTime)}
                      </div>
                      <div className="flex items-center">
                        <FiMapPin className="mr-1.5 h-4 w-4 text-purple-500" />
                        {eventGroup.eventInfo.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Summary */}
                <div className="flex items-center justify-between sm:justify-end sm:space-x-6">
                  <div className="text-right sm:text-left">
                    <div className="text-sm text-gray-500">
                      {eventGroup.tickets.length} ticket
                      {eventGroup.tickets.length !== 1 ? "s" : ""}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      ${eventGroup.totalValue.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <FiChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Ticket Rows */}
            {isExpanded && (
              <div className="border-t bg-gray-50">
                <div className="p-4 sm:p-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wide">
                    Your Tickets
                  </h4>

                  <div className="space-y-3">
                    {eventGroup.tickets.map((ticket, index) => (
                      <div
                        key={ticket._id || index}
                        className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Ticket Info */}
                          <div className="flex items-center space-x-4">
                            <div className="w-2 h-16 bg-gradient-to-b from-purple-500 to-violet-600 rounded-full hidden sm:block"></div>

                            <div>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 space-y-1 sm:space-y-0">
                                <span className="text-sm font-medium text-gray-900">
                                  {ticket.ticketType}
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  <FiUser className="mr-1 h-3 w-3" />
                                  General
                                </span>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 space-y-1 sm:space-y-0">
                                <div className="flex items-center">
                                  <FiDollarSign className="mr-1 h-3 w-3" />$
                                  {ticket.price.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-end sm:justify-start space-x-2 flex-wrap gap-2">
                            {!isPastEvent && ticket.refundStatus === "none" && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreview(ticket);
                                  }}
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                >
                                  <FiEye className="mr-1.5 h-3 w-3" />
                                  Preview
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(ticket);
                                  }}
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                >
                                  <FiDownload className="mr-1.5 h-3 w-3" />
                                  Download
                                </button>
                              </>
                            )}

                            {isRefundable(ticket) &&
                              ticket.refundStatus === "none" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRequestRefund(ticket);
                                  }}
                                  className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-600 to-violet-600 text-xs font-medium rounded-md text-white hover:from-purple-700 hover:to-violet-700 transition-colors"
                                >
                                  <FiRefreshCw className="mr-1.5 h-3 w-3" />
                                  Request Refund
                                </button>
                              )}

                            {ticket.refundStatus === "requested" && (
                              <span className="inline-flex items-center px-3 py-1.5 bg-yellow-100 text-xs font-medium rounded-md text-yellow-800">
                                Refund Requested
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Event Description */}
                  {eventGroup.eventInfo.description && (
                    <div className="mt-6 pt-6 border-t">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        About This Event
                      </h5>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {eventGroup.eventInfo.description}
                      </p>
                    </div>
                  )}

                  {/* Organizer Info */}
                  {eventGroup.eventInfo.organizer && (
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 space-y-1 sm:space-y-0">
                      <span className="font-medium">Organized by:</span>
                      <span className="sm:ml-2">
                        {eventGroup.eventInfo.organizer.username}
                      </span>
                      {eventGroup.eventInfo.organizer.contact && (
                        <>
                          <span className="hidden sm:inline mx-2">•</span>
                          <span className="sm:ml-0">
                            {eventGroup.eventInfo.organizer.contact}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {Object.keys(groupedTickets).length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FiCalendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tickets found
          </h3>
          <p className="text-gray-600">
            You haven&#39;t purchased any tickets yet.
          </p>
        </div>
      )}

      {showRefundModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleRefundModalClose}
        >
          <div
            className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Request Refund
              </h2>
              <button
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={handleRefundModalClose}
                disabled={isSubmitting}
              >
                <FiX className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            <form onSubmit={handleRefundSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="refundReason"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Reason for refund request
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="refundReason"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Please explain why you want to request a refund..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={handleRefundModalClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-violet-600 rounded-md hover:from-purple-700 hover:to-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || !refundReason.trim()}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Preview Modal */}
      {showPreview && selectedTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="relative w-full max-w-4xl rounded-lg bg-white p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Ticket Preview
              </h2>
              <button
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={() => setShowPreview(false)}
              >
                <FiX className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            <div className="rounded-md border bg-gray-50">
              <iframe
                src={pdfContent}
                title="PDF Preview"
                className="h-[400px] sm:h-[500px] w-full rounded-md"
              ></iframe>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(selectedTicket);
                }}
                className="inline-flex items-center rounded-md bg-gradient-to-r from-purple-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-purple-700 hover:to-violet-700 transition-colors"
              >
                <FiDownload className="mr-2 h-4 w-4" />
                Download Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventGroupedTickets;
