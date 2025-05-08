"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaImage,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

const EditEvent = () => {
  const { eventID } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    price: [],
    limit: "",
    poster: null,
  });

  const [previewImage, setPreviewImage] = useState(
    "https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_640.jpg"
  );
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState("basic"); // basic, pricing

  const handleAddPrice = () => {
    setFormData((prev) => ({
      ...prev,
      price: [...prev.price, { label: "", value: "" }],
    }));
  };

  const handleRemovePrice = (index) => {
    setFormData((prev) => ({
      ...prev,
      price: prev.price.filter((_, i) => i !== index),
    }));
  };

  const handlePriceChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedPrices = prev.price.map((price, i) =>
        i === index ? { ...price, [field]: value } : price
      );
      return { ...prev, price: updatedPrices };
    });
  };

  // Mock fetch event details
  const fetchEventDetails = () => {
    setLoading(true);
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock data
      const mockEvent = {
        name: "AI Summit 2025",
        description:
          "Join us to explore the latest trends in artificial intelligence and machine learning.",
        date: new Date().toISOString().split("T")[0],
        startTime: "10:00",
        endTime: "15:00",
        location: "Tech Park, San Francisco",
        price: [
          { label: "Regular", value: "50" },
          { label: "VIP", value: "100" },
        ],
        limit: "100",
      };

      setFormData({
        name: mockEvent.name,
        description: mockEvent.description,
        date: mockEvent.date,
        startTime: mockEvent.startTime,
        endTime: mockEvent.endTime,
        location: mockEvent.location,
        price: mockEvent.price,
        limit: mockEvent.limit,
        poster: null,
      });

      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for price to ensure valid input
    if (name === "price") {
      const price = Number.parseFloat(value);
      if (price >= 0 || value === "") {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Just set the local preview - no actual file handling
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.limit || formData.limit <= 0)
      newErrors.limit = "Valid ticket limit is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Simulate processing
    setTimeout(() => {
      console.log("Event updated with data:", formData);
      alert("Event updated successfully!");
      navigate(`/app/eventDetails/${eventID}`);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-[#b81bdf] px-6 py-6">
            <h1 className="text-2xl font-bold text-white">Edit Event</h1>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveSection("basic")}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeSection === "basic"
                  ? "text-[#b81bdf] border-b-2 border-[#b81bdf]"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Basic Info
              {activeSection === "basic" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#b81bdf]"></span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("pricing")}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeSection === "pricing"
                  ? "text-[#b81bdf] border-b-2 border-[#b81bdf]"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pricing
              {activeSection === "pricing" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#b81bdf]"></span>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Info Section */}
            <div className={activeSection === "basic" ? "block" : "hidden"}>
              {/* Event Image */}
              <div className="mb-8">
                <div className="relative">
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Event preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <label
                      htmlFor="poster-upload"
                      className="bg-white text-purple-600 px-4 py-2 rounded-lg cursor-pointer flex items-center"
                    >
                      <FaImage className="mr-2" />
                      Change Image
                    </label>
                    <input
                      id="poster-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Recommended image size: 1200 x 600 pixels (16:9 ratio)
                </p>
              </div>

              {/* Event Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full px-4 py-3 rounded-lg border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
                  placeholder="Enter event name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`block w-full px-4 py-3 rounded-lg border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
                  placeholder="Describe your event"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Date and Location */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-gray-500" />
                      Date
                    </div>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`block w-full px-4 py-3 rounded-lg border ${
                      errors.date ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-gray-500" />
                      Location
                    </div>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`block w-full px-4 py-3 rounded-lg border ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
                    placeholder="Enter venue or address"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Time */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className={activeSection === "pricing" ? "block" : "hidden"}>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-medium text-gray-800">
                    <div className="flex items-center">
                      <FaTicketAlt className="mr-2 text-[#E167FF]" />
                      Ticket Pricing
                    </div>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPrice}
                    className="flex items-center px-4 py-2 bg-[#E167FF] text-white rounded-lg hover:bg-[#C840E9] transition-colors"
                  >
                    <FaPlus className="mr-2" size={12} />
                    Add Ticket Type
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.price.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <p className="text-gray-500">
                        No ticket types added yet. Click &quot;Add Ticket
                        Type&quot; to get started.
                      </p>
                    </div>
                  ) : (
                    formData.price.map((priceItem, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#E167FF] transition-colors"
                      >
                        <div className="w-full md:w-2/5">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Ticket Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. General Admission, VIP, Early Bird"
                            value={priceItem.label}
                            onChange={(e) =>
                              handlePriceChange(index, "label", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent"
                          />
                        </div>
                        <div className="w-full md:w-2/5">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Price ($)
                          </label>
                          <input
                            type="number"
                            placeholder="0.00"
                            value={priceItem.value}
                            onChange={(e) =>
                              handlePriceChange(index, "value", e.target.value)
                            }
                            min="0"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent"
                          />
                        </div>
                        <div className="w-full md:w-1/5 md:self-end">
                          <button
                            type="button"
                            onClick={() => handleRemovePrice(index)}
                            className="w-full flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                          >
                            <FaTrash className="mr-2" size={12} />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Limit
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="limit"
                    value={formData.limit}
                    onChange={handleInputChange}
                    min="1"
                    className={`block w-full px-4 py-3 rounded-lg border ${
                      errors.limit ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
                    placeholder="Maximum number of tickets available"
                  />
                </div>
                {errors.limit && (
                  <p className="text-red-500 text-sm mt-1">{errors.limit}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Set the maximum number of tickets that can be sold for this
                  event.
                </p>
              </div>
            </div>

            {/* Action Buttons - Always visible */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(`/app/eventDetails/${eventID}`)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-3 rounded-lg text-white transition-colors ${
                  loading
                    ? "bg-[#E167FF]/70 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-[#C840E9] active:scale-[0.98]"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Event"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
