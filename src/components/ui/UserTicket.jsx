import { useState } from "react";
import {
  FiCalendar,
  FiDownload,
  FiMapPin,
  FiRefreshCw,
  FiUser,
  FiX,
} from "react-icons/fi";
import jsPDF from "jspdf";
import PropTypes from "prop-types";
import { useBookingStore } from "../../store/BookingStore";
import toast from "react-hot-toast";

const UserTicket = ({ data, isRefundable = false }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfContent, setPdfContent] = useState(null);
  const { requestRefund } = useBookingStore();

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

  const generatePdfContent = (callback) => {
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
      data?.event?.poster ||
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

    doc.setProperties({
      title: `${data?.eventName} Ticket`,
      subject: "Event Ticket",
      author: data?.event?.organizer?.username || "Event Organizer",
      keywords: "ticket, event, " + data.eventName,
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
      doc.text(`${formatDate(data.eventDate)}`, 105, 30, { align: "center" });

      const aspectRatio = img.width / img.height;
      const imgWidth = 180;
      const imgHeight = imgWidth / aspectRatio;

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
      doc.text(data.eventName, 105, yPos - 1, { align: "center" });

      yPos += 10;
      doc.setDrawColor(...secondaryColor);
      doc.setLineWidth(0.5);
      doc.roundedRect(15, yPos, 180, 70, 3, 3);

      doc.setTextColor(...secondaryColor);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");

      doc.text("ORGANIZER", 25, yPos + 15);

      doc.text("LOCATION", 25, yPos + 25);

      doc.text("TIME", 25, yPos + 35);

      doc.text("TICKET TYPE", 25, yPos + 45);
      doc.text("PRICE", 25, yPos + 55);

      const formattedTimeRange = `${formatTime(data.startTime)} - ${formatTime(
        data.endTime
      )}`;
      doc.setFont("helvetica", "normal");
      doc.text(data.event.organizer.username, 75, yPos + 15);
      doc.text(data.location, 75, yPos + 25);
      doc.text(formattedTimeRange, 75, yPos + 35);
      doc.text(data.ticketType, 75, yPos + 45);
      doc.text(`$${data.price.toFixed(2)}`, 75, yPos + 55);

      if (data.qrCodeUrl) {
        const qrImg = new Image();
        qrImg.src = data.qrCodeUrl;

        qrImg.onload = () => {
          doc.setDrawColor(...secondaryColor);
          doc.setLineWidth(0.5);
          doc.roundedRect(130, yPos + 5, 55, 55, 3, 3);
          doc.addImage(qrImg, "PNG", 132.5, yPos + 7.5, 50, 50);

          doc.setFontSize(8);
          doc.setTextColor(...accentColor);
          doc.text("SCAN TO VERIFY", 157.5, yPos + 67, { align: "center" });

          finishPdf();
        };

        qrImg.onerror = () => {
          doc.setDrawColor(...secondaryColor);
          doc.setFillColor(240, 240, 240);
          doc.roundedRect(130, yPos + 5, 55, 55, 3, 3, "FD");
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text("QR Code", 157.5, yPos + 25, { align: "center" });
          doc.text("Failed to load", 157.5, yPos + 35, { align: "center" });

          finishPdf();
        };
      } else {
        doc.setDrawColor(...secondaryColor);
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(130, yPos + 5, 55, 55, 3, 3, "FD");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("No QR Code", 157.5, yPos + 30, { align: "center" });

        finishPdf();
      }

      function finishPdf() {
        yPos += 80;
        doc.setFillColor(...accentColor);
        doc.rect(15, yPos, 180, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`TICKET ID: ${data.ticketId || data._id}`, 105, yPos + 10, {
          align: "center",
        });

        if (data.event?.description) {
          yPos += 25;
          doc.setTextColor(...secondaryColor);
          doc.setFontSize(10);
          doc.setFont("helvetica", "italic");
          doc.text("EVENT DESCRIPTION", 15, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(data.event.description, 15, yPos + 10, {
            maxWidth: 180,
          });
        }

        if (data.event?.organizer) {
          yPos += 40;
          doc.setTextColor(...secondaryColor);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text("ORGANIZED BY", 15, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(
            data.event.organizer.username || "Event Organizer",
            15,
            yPos + 7
          );

          if (data.event.organizer.contact) {
            doc.text(`Contact: ${data.event.organizer.contact}`, 15, yPos + 14);
          }
        }

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

  // Handle ticket preview
  const handlePreview = () => {
    if (data.eventDate && new Date(data.eventDate) < new Date()) return;
    generatePdfContent((pdfUri) => {
      setPdfContent(pdfUri);
      setShowPreview(true);
    });
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    generatePdfContent((pdfUri) => {
      const link = document.createElement("a");
      link.href = pdfUri;
      link.download = `ticket-${data._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleRequestRefund = (e) => {
    e.stopPropagation();
    setShowRefundModal(true);
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();

    if (!refundReason.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await requestRefund(data.bookingId || data._id, refundReason.trim());

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
    <div className="relative mb-6">
      {/* Ticket Card */}
      <div
        onClick={handlePreview}
        className="w-[300px] overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-100 group cursor-pointer"
      >
        {/* Ticket Header with Image */}
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={
              data?.event?.poster ||
              "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            }
            alt={`${data?.eventName} ticket`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <span className="absolute bottom-3 right-3 rounded-full bg-purple-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
            ${data.price.toFixed(2)}
          </span>
        </div>

        {/* Ticket Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {data.eventName}
          </h3>

          <div className="space-y-2 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <FiCalendar className="mr-2 h-4 w-4 text-purple-500" />
              {formatDate(data.eventDate)}
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <FiMapPin className="mr-2 h-4 w-4 text-purple-500" />
              {data.location}
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <FiUser className="mr-2 h-4 w-4 text-purple-500" />
              {data.ticketType}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-3">
            {data.refundStatus === "none" &&
              data.eventDate &&
              new Date(data.eventDate) > new Date() && (
                <button
                  className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                  onClick={handleDownload}
                >
                  <FiDownload className="mr-2 h-4 w-4" />
                  Download
                </button>
              )}

            {data.refundStatus === "requested" && (
              <button
                className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                onClick={handleDownload}
              >
                Refund requested
              </button>
            )}
            {isRefundable && data.refundStatus === "none" && (
              <button
                className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                onClick={handleRequestRefund}
              >
                <FiRefreshCw className="mr-2 h-4 w-4" />
                Request Refund
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Refund Reason Modal */}
      {showRefundModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleRefundModalClose}
        >
          <div
            className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-2xl"
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

              <div className="flex justify-end gap-3">
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
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="relative mx-4 w-full max-w-4xl rounded-lg bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
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
                className="h-[500px] w-full rounded-md"
              ></iframe>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleDownload}
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

UserTicket.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    bookingId: PropTypes.string,
    refundStatus: PropTypes.string,
    eventId: PropTypes.string.isRequired,
    eventName: PropTypes.string.isRequired,
    eventDate: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    ticketType: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    qrCode: PropTypes.string,
    event: PropTypes.shape({
      description: PropTypes.string,
      poster: PropTypes.string,
      organizer: PropTypes.shape({
        username: PropTypes.string,
        contact: PropTypes.string,
      }),
    }),
  }).isRequired,
  isRefundable: PropTypes.bool,
  onRequestRefund: PropTypes.func,
};

export default UserTicket;
