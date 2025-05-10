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

const UserTicket = ({ data, isRefundable = false, onRequestRefund }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [pdfContent, setPdfContent] = useState(null);

  // Format date to a readable string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate PDF content for the ticket
  const generatePdfContent = (callback) => {
    const doc = new jsPDF();

    const loadImage = (url, callback) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url || "/placeholder.svg?height=300&width=400";
      img.onload = () => {
        callback(img);
      };
    };

    // Use event poster or placeholder
    const posterUrl =
      data.event?.poster ||
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

    loadImage(posterUrl, (img) => {
      const aspectRatio = img.width / img.height;
      const imgWidth = 160;
      const imgHeight = imgWidth / aspectRatio;

      doc.addImage(img, "JPEG", 25, 20, imgWidth, imgHeight);

      const yPosition = 20 + imgHeight + 10;
      doc.setFontSize(20);
      doc.text("Event Ticket", 105, yPosition, { align: "center" });

      doc.setFontSize(14);
      doc.text(`Event Name: ${data.eventName}`, 20, yPosition + 20);
      doc.text(`Event Date: ${formatDate(data.date)}`, 20, yPosition + 30);
      doc.text(`Location: ${data.location}`, 20, yPosition + 40);
      doc.text(`Ticket Type: ${data.ticketType}`, 20, yPosition + 50);
      doc.text(`Price: $${data.price.toFixed(2)}`, 20, yPosition + 60);

      if (data.event?.description) {
        doc.text(`Description: ${data.event.description}`, 20, yPosition + 70, {
          maxWidth: 170,
        });
      }

      // Add QR code placeholder
      doc.setDrawColor(0);
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(140, yPosition + 70, 50, 50, 3, 3, "FD");
      doc.setFontSize(8);
      doc.text("QR Code", 165, yPosition + 95, { align: "center" });
      doc.text(data.qrCode || "qr12345", 165, yPosition + 100, {
        align: "center",
      });

      doc.setFontSize(12);
      doc.text(`Ticket ID: ${data.id}`, 20, yPosition + 130);

      callback(doc.output("datauristring"));
    });
  };

  // Handle ticket preview
  const handlePreview = () => {
    generatePdfContent((pdfUri) => {
      setPdfContent(pdfUri);
      setShowPreview(true);
    });
  };

  // Handle ticket download
  const handleDownload = (e) => {
    e.stopPropagation();
    generatePdfContent((pdfUri) => {
      const doc = new jsPDF();
      doc.loadFile(pdfUri);
      doc.save(`ticket-${data.id}.pdf`);
    });
  };

  // Handle refund request
  const handleRequestRefund = (e) => {
    e.stopPropagation();
    if (onRequestRefund) {
      onRequestRefund(data);
    }
  };

  return (
    <div className="relative mb-6">
      {/* Ticket Card */}
      <div
        onClick={handlePreview}
        className="w-full overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-100 group cursor-pointer"
      >
        {/* Ticket Header with Image */}
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={
              data.event?.poster ||
              "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            }
            alt={`${data.eventName} ticket`}
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
              {formatDate(data.date)}
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
            <button
              className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
              onClick={handleDownload}
            >
              <FiDownload className="mr-2 h-4 w-4" />
              Download
            </button>

            {isRefundable && (
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
    id: PropTypes.string.isRequired,
    eventId: PropTypes.string.isRequired,
    eventName: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
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
