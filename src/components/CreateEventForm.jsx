"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiImage,
  FiInfo,
  FiMapPin,
  FiPlus,
  FiTrash2,
  FiX,
  FiAlertCircle,
  FiTag,
  FiUsers,
  FiPackage,
  FiArrowLeft,
  // FiExchangeAlt,
} from "react-icons/fi";
import RefundPolicyManager from "./organization/RefundPolicy";
import { RiRefund2Line } from "react-icons/ri";

// Event categories
const EVENT_CATEGORIES = [
  { id: "music", name: "Music" },
  { id: "conference", name: "Conference" },
  { id: "workshop", name: "Workshop" },
  { id: "sports", name: "Sports" },
  { id: "art", name: "Art & Culture" },
  { id: "food", name: "Food & Drink" },
  { id: "business", name: "Business" },
  { id: "health", name: "Health & Wellness" },
  { id: "education", name: "Education" },
  { id: "other", name: "Other" },
];

function CreateEventPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    date: "",
    startTime: "",
    endTime: "",
    limit: "",
    venue: {
      name: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
      coordinates: {
        latitude: "",
        longitude: "",
      },
      mapUrl: "",
    },
    price: [],
    tags: [],
    organizer: localStorage.getItem("user_id")?.toString() || "",
  });

  const [refundPolicies, setRefundPolicies] = useState([]);
  const [refundPoliciesEnabled, setRefundPoliciesEnabled] = useState(false);

  const [errors, setErrors] = useState({});
  const [posterPreview, setPosterPreview] = useState(null);
  const [activeSection, setActiveSection] = useState("basic"); // basic, datetime, pricing, refund, summary
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPrice = () => {
    setFormData((prev) => ({
      ...prev,
      price: [
        ...prev.price,
        { label: "", value: "", quantity: "", maxPerOrder: "" },
      ],
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

  const handleSaveRefundPolicies = (policies) => {
    setRefundPolicies(policies);
    console.log("Refund policies saved:", policies);
  };

  const validateSection = (section) => {
    const newErrors = {};

    if (section === "basic") {
      if (!formData.name) newErrors.name = "Event name is required";
      if (!formData.description)
        newErrors.description = "Description is required";
      if (!formData.venue.name) newErrors.venueName = "Venue name is required";
      if (!formData.venue.address.street)
        newErrors.street = "Street is required";
      if (!formData.venue.address.city) newErrors.city = "City is required";
      if (!formData.venue.address.state) newErrors.state = "State is required";
      if (!formData.venue.address.country)
        newErrors.country = "Country is required";
      if (!formData.venue.address.zipCode)
        newErrors.zipCode = "Zip code is required";
      if (!formData.category) newErrors.category = "Category is required";
    } else if (section === "datetime") {
      if (!formData.date) newErrors.date = "Date is required";
      if (!formData.startTime) newErrors.startTime = "Start time is required";
      if (!formData.endTime) newErrors.endTime = "End time is required";
      if (!formData.limit) newErrors.limit = "Attendee limit is required";
    } else if (section === "pricing") {
      if (formData.price.length === 0) {
        newErrors.price = "At least one ticket type is required";
      } else {
        formData.price.forEach((price, index) => {
          if (!price.label) {
            newErrors[`price_${index}_label`] = "Ticket name is required";
          }
          if (!price.value) {
            newErrors[`price_${index}_value`] = "Price is required";
          }
          if (!price.quantity) {
            newErrors[`price_${index}_quantity`] = "Quantity is required";
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all sections before submitting
    const basicValid = validateSection("basic");
    const datetimeValid = validateSection("datetime");
    const pricingValid = validateSection("pricing");

    if (!basicValid || !datetimeValid || !pricingValid) {
      // Show error message
      alert("Please fill in all required fields before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the final form data to submit
      const finalFormData = {
        ...formData,
        refundPolicies: refundPoliciesEnabled ? refundPolicies : [],
      };

      console.log("Form submitted with data:", finalFormData);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/app/profile");
      }, 1000);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/app/profile");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={handleCancel}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Events
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 px-6 py-6">
            <h1 className="text-2xl font-bold text-white">Create New Event</h1>
            <p className="mt-1 text-purple-100">
              Fill in the details to create your event
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveSection("basic")}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeSection === "basic"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Basic Info
              {activeSection === "basic" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600"></span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                if (validateSection("basic")) setActiveSection("datetime");
              }}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeSection === "datetime"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Date & Time
              {activeSection === "datetime" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600"></span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                if (validateSection("basic") && validateSection("datetime"))
                  setActiveSection("pricing");
              }}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeSection === "pricing"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pricing
              {activeSection === "pricing" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600"></span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                if (
                  validateSection("basic") &&
                  validateSection("datetime") &&
                  validateSection("pricing")
                )
                  setActiveSection("refund");
              }}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeSection === "refund"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Refund Policies
              {activeSection === "refund" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600"></span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                if (
                  validateSection("basic") &&
                  validateSection("datetime") &&
                  validateSection("pricing")
                )
                  setActiveSection("summary");
              }}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeSection === "summary"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Summary
              {activeSection === "summary" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600"></span>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Info Section */}
            <div className={activeSection === "basic" ? "block" : "hidden"}>
              <div className="space-y-6">
                <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
                  <h2 className="mb-4 text-lg font-semibold text-purple-800">
                    Basic Information
                  </h2>

                  {/* Event Name */}
                  <div className="mb-5">
                    <label
                      htmlFor="name"
                      className="mb-2 flex items-center text-sm font-medium text-gray-700"
                    >
                      <FiInfo className="mr-2 h-4 w-4 text-purple-500" />
                      Event Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter a catchy name for your event"
                        className={`w-full rounded-lg border ${
                          errors.name
                            ? "border-red-300 bg-red-50"
                            : "border-purple-200 bg-white"
                        } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                      />
                      {errors.name && (
                        <div className="mt-1 flex items-center text-sm text-red-600">
                          <FiAlertCircle className="mr-1 h-4 w-4" />
                          {errors.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Event Category */}
                  <div className="mb-5">
                    <label
                      htmlFor="category"
                      className="mb-2 flex items-center text-sm font-medium text-gray-700"
                    >
                      <FiTag className="mr-2 h-4 w-4 text-purple-500" />
                      Event Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${
                        errors.category
                          ? "border-red-300 bg-red-50"
                          : "border-purple-200 bg-white"
                      } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                    >
                      <option value="">Select a category</option>
                      {EVENT_CATEGORIES.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <FiAlertCircle className="mr-1 h-4 w-4" />
                        {errors.category}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-5">
                    <label
                      htmlFor="description"
                      className="mb-2 flex items-center text-sm font-medium text-gray-700"
                    >
                      <FiInfo className="mr-2 h-4 w-4 text-purple-500" />
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your event in detail - what can attendees expect?"
                      className={`w-full rounded-lg border ${
                        errors.description
                          ? "border-red-300 bg-red-50"
                          : "border-purple-200 bg-white"
                      } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                    ></textarea>
                    {errors.description && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <FiAlertCircle className="mr-1 h-4 w-4" />
                        {errors.description}
                      </div>
                    )}
                  </div>

                  {/* Venue */}
                  <div className="rounded-lg border border-purple-100 bg-purple-50 p-4 mb-5">
                    <h3 className="mb-3 text-md font-semibold text-purple-800">
                      Venue Details
                    </h3>

                    {/* Venue Name */}
                    <div className="mb-4">
                      <label
                        htmlFor="venueName"
                        className="mb-2 flex items-center text-sm font-medium text-gray-700"
                      >
                        <FiMapPin className="mr-2 h-4 w-4 text-purple-500" />
                        Venue Name
                      </label>
                      <input
                        type="text"
                        id="venueName"
                        name="venueName"
                        value={formData.venue.name}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            venue: {
                              ...prev.venue,
                              name: e.target.value,
                            },
                          }));
                        }}
                        placeholder="Enter venue name"
                        className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                      />
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Street"
                            value={formData.venue.address.street}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                venue: {
                                  ...prev.venue,
                                  address: {
                                    ...prev.venue.address,
                                    street: e.target.value,
                                  },
                                },
                              }));
                            }}
                            className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="City"
                            value={formData.venue.address.city}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                venue: {
                                  ...prev.venue,
                                  address: {
                                    ...prev.venue.address,
                                    city: e.target.value,
                                  },
                                },
                              }));
                            }}
                            className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="State/Province"
                            value={formData.venue.address.state}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                venue: {
                                  ...prev.venue,
                                  address: {
                                    ...prev.venue.address,
                                    state: e.target.value,
                                  },
                                },
                              }));
                            }}
                            className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Zip/Postal Code"
                            value={formData.venue.address.zipCode}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                venue: {
                                  ...prev.venue,
                                  address: {
                                    ...prev.venue.address,
                                    zipCode: e.target.value,
                                  },
                                },
                              }));
                            }}
                            className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            placeholder="Country"
                            value={formData.venue.address.country}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                venue: {
                                  ...prev.venue,
                                  address: {
                                    ...prev.venue.address,
                                    country: e.target.value,
                                  },
                                },
                              }));
                            }}
                            className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Coordinates */}
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Coordinates (Optional)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Latitude"
                            value={formData.venue.coordinates.latitude}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                venue: {
                                  ...prev.venue,
                                  coordinates: {
                                    ...prev.venue.coordinates,
                                    latitude: e.target.value,
                                  },
                                },
                              }));
                            }}
                            className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Longitude"
                            value={formData.venue.coordinates.longitude}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                venue: {
                                  ...prev.venue,
                                  coordinates: {
                                    ...prev.venue.coordinates,
                                    longitude: e.target.value,
                                  },
                                },
                              }));
                            }}
                            className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Map URL */}
                    <div>
                      <label
                        htmlFor="mapUrl"
                        className="mb-2 flex items-center text-sm font-medium text-gray-700"
                      >
                        Map URL (Optional)
                      </label>
                      <input
                        type="text"
                        id="mapUrl"
                        name="mapUrl"
                        value={formData.venue.mapUrl}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            venue: {
                              ...prev.venue,
                              mapUrl: e.target.value,
                            },
                          }));
                        }}
                        placeholder="Google Maps or other map service URL"
                        className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-5">
                    <label
                      htmlFor="tags"
                      className="mb-2 flex items-center text-sm font-medium text-gray-700"
                    >
                      <FiTag className="mr-2 h-4 w-4 text-purple-500" />
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                tags: prev.tags.filter((_, i) => i !== index),
                              }));
                            }}
                            className="ml-2 text-purple-600 hover:text-purple-800"
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        id="tagInput"
                        placeholder="Add tags (e.g., music, festival)"
                        className="flex-grow rounded-l-lg border border-purple-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.target.value.trim()) {
                            e.preventDefault();
                            setFormData((prev) => ({
                              ...prev,
                              tags: [...prev.tags, e.target.value.trim()],
                            }));
                            e.target.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("tagInput");
                          if (input.value.trim()) {
                            setFormData((prev) => ({
                              ...prev,
                              tags: [...prev.tags, input.value.trim()],
                            }));
                            input.value = "";
                          }
                        }}
                        className="rounded-r-lg bg-purple-600 px-4 py-3 text-white hover:bg-purple-700"
                      >
                        Add
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Press Enter or click Add to add a tag
                    </p>
                  </div>
                </div>

                {/* Event Poster */}
                <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
                  <h2 className="mb-4 text-lg font-semibold text-purple-800">
                    Event Media
                  </h2>

                  <div className="overflow-hidden rounded-lg border-2 border-dashed border-purple-200 bg-white">
                    <div className="relative">
                      <input
                        type="file"
                        id="poster"
                        name="poster"
                        className="absolute inset-0 cursor-pointer opacity-0 z-10"
                        accept="image/*"
                        onChange={handlePosterChange}
                      />

                      {posterPreview ? (
                        <div className="relative aspect-video w-full">
                          <img
                            src={posterPreview || "/placeholder.svg"}
                            alt="Event poster preview"
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPosterPreview(null);
                            }}
                            className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                            <p className="text-sm font-medium">
                              Poster uploaded successfully
                            </p>
                            <p className="text-xs opacity-80">
                              Click to change image
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="mb-3 rounded-full bg-purple-100 p-3">
                            <FiImage className="h-8 w-8 text-purple-600" />
                          </div>
                          <p className="mb-1 text-base font-medium text-gray-700">
                            Drag and drop your event poster here
                          </p>
                          <p className="mb-4 text-sm text-gray-500">
                            or click to browse files
                          </p>
                          <p className="text-xs text-gray-400">
                            Recommended size: 1200 x 630 pixels (16:9)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (validateSection("basic")) setActiveSection("datetime");
                  }}
                  className="flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Date & Time Section */}
            <div className={activeSection === "datetime" ? "block" : "hidden"}>
              <div className="space-y-6">
                <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
                  <h2 className="mb-4 text-lg font-semibold text-purple-800">
                    Date & Time
                  </h2>

                  {/* Date */}
                  <div className="mb-5">
                    <label
                      htmlFor="date"
                      className="mb-2 flex items-center text-sm font-medium text-gray-700"
                    >
                      <FiCalendar className="mr-2 h-4 w-4 text-purple-500" />
                      Event Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${
                        errors.date
                          ? "border-red-300 bg-red-50"
                          : "border-purple-200 bg-white"
                      } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                    />
                    {errors.date && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <FiAlertCircle className="mr-1 h-4 w-4" />
                        {errors.date}
                      </div>
                    )}
                  </div>

                  {/* Time */}
                  <div className="mb-5 grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="startTime"
                        className="mb-2 flex items-center text-sm font-medium text-gray-700"
                      >
                        <FiClock className="mr-2 h-4 w-4 text-purple-500" />
                        Start Time
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${
                          errors.startTime
                            ? "border-red-300 bg-red-50"
                            : "border-purple-200 bg-white"
                        } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                      />
                      {errors.startTime && (
                        <div className="mt-1 flex items-center text-sm text-red-600">
                          <FiAlertCircle className="mr-1 h-4 w-4" />
                          {errors.startTime}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="endTime"
                        className="mb-2 flex items-center text-sm font-medium text-gray-700"
                      >
                        <FiClock className="mr-2 h-4 w-4 text-purple-500" />
                        End Time
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className={`w-full rounded-lg border ${
                          errors.endTime
                            ? "border-red-300 bg-red-50"
                            : "border-purple-200 bg-white"
                        } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                      />
                      {errors.endTime && (
                        <div className="mt-1 flex items-center text-sm text-red-600">
                          <FiAlertCircle className="mr-1 h-4 w-4" />
                          {errors.endTime}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attendee Limit */}
                  <div>
                    <label
                      htmlFor="limit"
                      className="mb-2 flex items-center text-sm font-medium text-gray-700"
                    >
                      <FiUsers className="mr-2 h-4 w-4 text-purple-500" />
                      Total Event Capacity
                    </label>
                    <input
                      type="number"
                      id="limit"
                      name="limit"
                      value={formData.limit}
                      onChange={handleChange}
                      min="1"
                      placeholder="Maximum number of attendees"
                      className={`w-full rounded-lg border ${
                        errors.limit
                          ? "border-red-300 bg-red-50"
                          : "border-purple-200 bg-white"
                      } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                    />
                    {errors.limit && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <FiAlertCircle className="mr-1 h-4 w-4" />
                        {errors.limit}
                      </div>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      This is the maximum number of people who can attend your
                      event across all ticket types.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveSection("basic")}
                  className="flex items-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateSection("datetime"))
                      setActiveSection("pricing");
                  }}
                  className="flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Pricing Section */}
            <div className={activeSection === "pricing" ? "block" : "hidden"}>
              <div className="space-y-6">
                <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-purple-800">
                      Ticket Pricing & Inventory
                    </h2>
                    <button
                      type="button"
                      onClick={handleAddPrice}
                      className="flex items-center rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-purple-700"
                    >
                      <FiPlus className="mr-1.5 h-3.5 w-3.5" />
                      Add Ticket Type
                    </button>
                  </div>

                  {errors.price && (
                    <div className="mb-4 flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                      <FiAlertCircle className="mr-2 h-4 w-4" />
                      {errors.price}
                    </div>
                  )}

                  {formData.price.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-200 bg-white py-10">
                      <div className="mb-3 rounded-full bg-purple-100 p-3">
                        <FiDollarSign className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="mb-1 text-base font-medium text-gray-700">
                        No ticket types added yet
                      </p>
                      <p className="mb-4 text-sm text-gray-500">
                        Add at least one ticket type for your event
                      </p>
                      <button
                        type="button"
                        onClick={handleAddPrice}
                        className="flex items-center rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-purple-700"
                      >
                        <FiPlus className="mr-1.5 h-3.5 w-3.5" />
                        Add Ticket Type
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.price.map((priceItem, index) => (
                        <div
                          key={index}
                          className="group relative overflow-hidden rounded-lg border border-purple-200 bg-white p-4 shadow-sm transition-all hover:border-purple-300 hover:shadow-md"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-700">
                              Ticket Type {index + 1}
                            </h3>
                            <button
                              type="button"
                              onClick={() => handleRemovePrice(index)}
                              className="rounded-full bg-red-50 p-1.5 text-red-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                              <label className="mb-1 block text-xs font-medium text-gray-500">
                                Ticket Name
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. VIP, Early Bird, General"
                                value={priceItem.label}
                                onChange={(e) =>
                                  handlePriceChange(
                                    index,
                                    "label",
                                    e.target.value
                                  )
                                }
                                className={`w-full rounded-lg border ${
                                  errors[`price_${index}_label`]
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-200 bg-gray-50"
                                } px-3 py-2.5 text-gray-900 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                              />
                              {errors[`price_${index}_label`] && (
                                <div className="mt-1 text-xs text-red-600">
                                  {errors[`price_${index}_label`]}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-gray-500">
                                Price ($)
                              </label>
                              <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                  <FiDollarSign className="h-4 w-4 text-gray-500" />
                                </div>
                                <input
                                  type="number"
                                  placeholder="0.00"
                                  value={priceItem.value}
                                  onChange={(e) =>
                                    handlePriceChange(
                                      index,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                  min="0"
                                  step="0.01"
                                  className={`w-full rounded-lg border ${
                                    errors[`price_${index}_value`]
                                      ? "border-red-300 bg-red-50"
                                      : "border-gray-200 bg-gray-50"
                                  } pl-8 pr-3 py-2.5 text-gray-900 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                                />
                                {errors[`price_${index}_value`] && (
                                  <div className="mt-1 text-xs text-red-600">
                                    {errors[`price_${index}_value`]}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-gray-500">
                                Quantity Available
                              </label>
                              <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                  <FiPackage className="h-4 w-4 text-gray-500" />
                                </div>
                                <input
                                  type="number"
                                  placeholder="Number of tickets"
                                  value={priceItem.quantity}
                                  onChange={(e) =>
                                    handlePriceChange(
                                      index,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  min="1"
                                  className={`w-full rounded-lg border ${
                                    errors[`price_${index}_quantity`]
                                      ? "border-red-300 bg-red-50"
                                      : "border-gray-200 bg-gray-50"
                                  } pl-8 pr-3 py-2.5 text-gray-900 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                                />
                                {errors[`price_${index}_quantity`] && (
                                  <div className="mt-1 text-xs text-red-600">
                                    {errors[`price_${index}_quantity`]}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="md:col-span-3">
                              <label className="mb-1 block text-xs font-medium text-gray-500">
                                Max Per Order (Optional)
                              </label>
                              <input
                                type="number"
                                placeholder="Leave blank for no limit"
                                value={priceItem.maxPerOrder || ""}
                                onChange={(e) =>
                                  handlePriceChange(
                                    index,
                                    "maxPerOrder",
                                    e.target.value
                                  )
                                }
                                min="1"
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Limit how many tickets of this type a single
                                customer can purchase. Leave blank for no limit.
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={handleAddPrice}
                        className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-purple-200 bg-white py-3 text-sm font-medium text-purple-600 transition-all hover:border-purple-300 hover:bg-purple-50"
                      >
                        <FiPlus className="mr-1.5 h-4 w-4" />
                        Add Another Ticket Type
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveSection("datetime")}
                  className="flex items-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateSection("pricing")) setActiveSection("refund");
                  }}
                  className="flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Refund Policies Section */}
            <div className={activeSection === "refund" ? "block" : "hidden"}>
              <div className="space-y-6">
                <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-purple-800">
                      <div className="flex items-center">
                        <RiRefund2Line className="mr-2 text-purple-600" />
                        Refund Policies
                      </div>
                    </h2>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-3">
                        {refundPoliciesEnabled ? "Enabled" : "Disabled"}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setRefundPoliciesEnabled(!refundPoliciesEnabled)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                          refundPoliciesEnabled
                            ? "bg-purple-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            refundPoliciesEnabled
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-gray-600">
                    {refundPoliciesEnabled
                      ? "Set up refund policies for your event. These will be displayed to attendees during checkout."
                      : "Enable refund policies to allow attendees to request refunds under specific conditions."}
                  </p>

                  {refundPoliciesEnabled ? (
                    <RefundPolicyManager
                      eventId="new_event"
                      onSave={handleSaveRefundPolicies}
                      initialPolicies={[
                        {
                          type: "time-based",
                          rules: [
                            {
                              daysBeforeEvent: 7,
                              refundPercentage: 50,
                              description:
                                "50% refund up to 7 days before the event",
                            },
                          ],
                        },
                      ]}
                    />
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <p className="text-gray-500">
                        Refund policies are currently disabled. Enable them to
                        configure refund options for your attendees.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveSection("pricing")}
                  className="flex items-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection("summary")}
                  className="flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Summary Section */}
            <div className={activeSection === "summary" ? "block" : "hidden"}>
              <div className="space-y-6">
                <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                  <h2 className="mb-4 text-lg font-semibold text-green-800">
                    Event Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FiInfo className="mr-2 mt-0.5 h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Event Name
                        </p>
                        <p className="text-sm text-gray-600">
                          {formData.name || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FiTag className="mr-2 mt-0.5 h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Category
                        </p>
                        <p className="text-sm text-gray-600">
                          {EVENT_CATEGORIES.find(
                            (c) => c.id === formData.category
                          )?.name || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FiMapPin className="mr-2 mt-0.5 h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Venue
                        </p>
                        <p className="text-sm text-gray-600">
                          {formData.venue.name || "Not specified"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formData.venue.address.street},{" "}
                          {formData.venue.address.city},{" "}
                          {formData.venue.address.state},{" "}
                          {formData.venue.address.zipCode},{" "}
                          {formData.venue.address.country}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FiCalendar className="mr-2 mt-0.5 h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Date & Time
                        </p>
                        <p className="text-sm text-gray-600">
                          {formData.date
                            ? `${formData.date} from ${
                                formData.startTime || "?"
                              } to ${formData.endTime || "?"}`
                            : "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FiUsers className="mr-2 mt-0.5 h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Total Capacity
                        </p>
                        <p className="text-sm text-gray-600">
                          {formData.limit
                            ? `${formData.limit} attendees`
                            : "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FiDollarSign className="mr-2 mt-0.5 h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Ticket Types
                        </p>
                        {formData.price.length > 0 ? (
                          <ul className="mt-1 space-y-1">
                            {formData.price.map((price, index) => (
                              <li key={index} className="text-sm text-gray-600">
                                {price.label || `Ticket ${index + 1}`}: $
                                {price.value || "0.00"} (Qty:{" "}
                                {price.quantity || "0"})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-600">
                            No ticket types added
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FiDollarSign className="mr-2 mt-0.5 h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Refund Policies
                        </p>
                        {refundPoliciesEnabled ? (
                          refundPolicies.length > 0 ? (
                            <ul className="mt-1 space-y-1">
                              {refundPolicies.map((policy, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-600"
                                >
                                  {policy.isDefault && (
                                    <span className="text-green-600 font-medium">
                                      (Default){" "}
                                    </span>
                                  )}
                                  {policy.description}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-600">
                              No refund policies added
                            </p>
                          )
                        ) : (
                          <p className="text-sm text-gray-600">
                            Refund policies disabled
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FiImage className="mr-2 mt-0.5 h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Event Image
                        </p>
                        <p className="text-sm text-gray-600">
                          {posterPreview ? "Uploaded" : "Not uploaded"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FiTag className="mr-2 mt-0.5 h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Tags
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.tags.length > 0 ? (
                            formData.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <p className="text-sm text-gray-600">
                              No tags added
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveSection("refund")}
                  className="flex items-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateEventPage;
