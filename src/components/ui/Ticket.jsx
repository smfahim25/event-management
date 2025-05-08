import { useState } from "react";
import jsPDF from "jspdf";
import PropTypes from "prop-types";
import { FiCalendar, FiDownload, FiMapPin, FiUser, FiX } from "react-icons/fi";

const mockTicketData = {
  _id: "ticket123456",
  customer: {
    username: "JohnDoe",
    email: "john.doe@example.com",
  },
  event: {
    name: "Summer Music Festival",
    date: "2025-07-15T18:00:00Z",
    location: "Central Park",
    description:
      "Experience the ultimate summer music festival featuring top artists from around the world. Food, drinks, and memories that will last a lifetime.",
    price: 89.99,
    poster:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    organizer: {
      username: "EventMasters",
      contact: "contact@eventmasters.com",
    },
  },
};

const Ticket = ({ data }) => {
  console.log(data);
  const { _id, customer, event } = mockTicketData;

  const [showPreview, setShowPreview] = useState(false);
  const [pdfContent, setPdfContent] = useState(null);

  const generatePdfContent = (callback) => {
    const doc = new jsPDF();

    const loadImage = (url, callback) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => {
        callback(img);
      };
    };

    loadImage(event.poster, (img) => {
      const aspectRatio = img.width / img.height;
      const imgWidth = 160;
      const imgHeight = imgWidth / aspectRatio;

      doc.addImage(img, "JPEG", 25, 20, imgWidth, imgHeight);

      const yPosition = 20 + imgHeight + 10;
      doc.setFontSize(20);
      doc.text("Event Ticket", 105, yPosition, { align: "center" });

      doc.setFontSize(14);
      doc.text(`Event Name: ${event.name}`, 20, yPosition + 20);
      doc.text(
        `Event Date: ${new Date(event.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        20,
        yPosition + 30
      );
      doc.text(`Location: ${event.location}`, 20, yPosition + 40);
      doc.text(`Description: ${event.description}`, 20, yPosition + 50, {
        maxWidth: 170,
      });

      doc.text(`Organizer: ${event.organizer.username}`, 20, yPosition + 70);

      doc.text(`Customer: ${customer.username}`, 20, yPosition + 100);

      doc.setFontSize(12);
      doc.text(`Ticket ID: ${_id}`, 20, yPosition + 120);

      callback(doc.output("datauristring"));
    });
  };

  const handlePreview = () => {
    generatePdfContent((pdfUri) => {
      setPdfContent(pdfUri);
      setShowPreview(true);
    });
  };

  const downloadPdf = () => {
    generatePdfContent((pdfUri) => {
      const doc = new jsPDF();
      doc.loadFile(pdfUri);
      doc.save(`ticket-${_id}.pdf`);
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <div
        onClick={handlePreview}
        className="lg:w-[285px] cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-100 group"
      >
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={event?.poster || "/placeholder.svg"}
            alt="ticket poster"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <span className="absolute bottom-3 right-3 rounded-full bg-purple-600 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
            ${event?.price}
          </span>
        </div>

        <div className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
              {event?.name}
            </h3>
          </div>

          <div className="mb-3 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <FiCalendar className="mr-2 h-4 w-4 text-purple-500" />
              {formatDate(event?.date)}
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <FiMapPin className="mr-2 h-4 w-4 text-purple-500" />
              {event?.location}
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <FiUser className="mr-2 h-4 w-4 text-purple-500" />
              {customer?.username}
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {event?.description}
          </p>

          <div className="mt-3 flex justify-end">
            <button
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handlePreview();
              }}
            >
              View Ticket
            </button>
          </div>
        </div>
      </div>

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
                onClick={downloadPdf}
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

Ticket.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    customer: PropTypes.shape({
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }).isRequired,
    event: PropTypes.shape({
      name: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      poster: PropTypes.string.isRequired,
      organizer: PropTypes.shape({
        username: PropTypes.string.isRequired,
        contact: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }),
};

export default Ticket;
