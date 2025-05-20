import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaTrash,
  FaPlus,
  FaTag,
  FaUsers,
  FaBox,
  FaExchangeAlt,
} from "react-icons/fa";
import RefundPolicyManager from "./organization/RefundPolicy";
import { useEventStore } from "../store/EventStore";
import { useCategoryStore } from "../store/CategoryStore";

const EditEvent = () => {
  const { eventID } = useParams();
  const navigate = useNavigate();
  const tagInputRef = useRef();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    date: "",
    startTime: "",
    endTime: "",
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
    limit: "",
    poster: null,
    tags: [],
  });

  const [previewImages, setPreviewImages] = useState([
    "https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_640.jpg",
  ]);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState("basic"); // basic, pricing, refund
  const [refundPolicies, setRefundPolicies] = useState([]);
  const [refundPoliciesEnabled, setRefundPoliciesEnabled] = useState(true);

  const { categories, fetchCategories } = useCategoryStore();
  const {
    selectedEvent,
    fetchEventById,
    updateEvent,
    loading: eventLoading,
  } = useEventStore();

  // Fetch event data when component mounts or eventID changes
  useEffect(() => {
    if (eventID) {
      fetchEventById(eventID);
    }
  }, [eventID, fetchEventById]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        name: selectedEvent.eventName,
        description: selectedEvent.description,
        category: selectedEvent.eventCategory?._id || "",
        date: selectedEvent.eventDate?.split("T")[0] || "",
        startTime: selectedEvent.startTime || "",
        endTime: selectedEvent.endTime || "",
        venue: {
          name: selectedEvent.venue?.name || "",
          address: {
            street: selectedEvent.venue?.address?.street || "",
            city: selectedEvent.venue?.address?.city || "",
            state: selectedEvent.venue?.address?.state || "",
            country: selectedEvent.venue?.address?.country || "",
            zipCode: selectedEvent.venue?.address?.zipCode || "",
          },
          coordinates: {
            latitude: selectedEvent.venue?.coordinates?.latitude || "",
            longitude: selectedEvent.venue?.coordinates?.longitude || "",
          },
          mapUrl: selectedEvent.venue?.mapUrl || "",
        },
        price:
          selectedEvent.ticketTiers?.map((tier) => ({
            label: tier.name,
            value: tier.price,
            quantity: tier.availableQuantity,
            maxPerOrder: tier.maxPerOrder,
          })) || [],
        limit: selectedEvent.totalCapacity || "",
        poster: null,
        tags: selectedEvent.tags || [],
      });

      // Set the preview images if available
      if (selectedEvent.eventImages && selectedEvent.eventImages.length > 0) {
        setPreviewImages(selectedEvent.eventImages);
      }

      // Set refund policies if available
      if (selectedEvent.refundPolicy) {
        setRefundPoliciesEnabled(
          selectedEvent.refundPolicy.type === "time-based"
        );
        setRefundPolicies(selectedEvent.refundPolicy.rules || []);
      }
    }
  }, [selectedEvent]);

  const handleAddPrice = () => {
    setFormData((prev) => ({
      ...prev,
      price: [
        ...prev.price,
        { label: "", value: "", quantity: "", maxPerOrder: "" },
      ],
    }));
  };

  const handleAddTag = () => {
    const input = tagInputRef.current;
    const trimmedValue = input?.value.trim();
    if (trimmedValue) {
      setFormData((prev) => {
        const updatedTags = [...prev.tags, trimmedValue];
        console.log("Updating tags with:", updatedTags);
        return {
          ...prev,
          tags: updatedTags,
        };
      });
      input.value = "";
    }
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
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages((prev) => [...prev, ...newImages]);

      // Store the actual files in formData
      setFormData((prev) => ({
        ...prev,
        poster: prev.poster
          ? [...prev.poster, ...Array.from(files)]
          : Array.from(files),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.venue.name.trim())
      newErrors.venueName = "Venue name is required";
    if (!formData.venue.address.street.trim())
      newErrors.street = "Street is required";
    if (!formData.venue.address.city.trim())
      newErrors.city = "City is required";
    if (!formData.venue.address.state.trim())
      newErrors.state = "State is required";
    if (!formData.venue.address.country.trim())
      newErrors.country = "Country is required";
    if (!formData.venue.address.zipCode.trim())
      newErrors.zipCode = "Zip code is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.limit || formData.limit <= 0)
      newErrors.limit = "Valid ticket limit is required";

    // Validate ticket types
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formDataObj = new FormData();

    formDataObj.append("eventName", formData.name);
    formDataObj.append("description", formData.description);
    formDataObj.append("eventCategory", formData.category);
    formDataObj.append("eventDate", formData.date);
    formDataObj.append("startTime", formData.startTime);
    formDataObj.append("endTime", formData.endTime);

    formDataObj.append("venue[name]", formData.venue.name);
    formDataObj.append("venue[address][street]", formData.venue.address.street);
    formDataObj.append("venue[address][city]", formData.venue.address.city);
    formDataObj.append("venue[address][state]", formData.venue.address.state);
    formDataObj.append(
      "venue[address][country]",
      formData.venue.address.country
    );
    formDataObj.append(
      "venue[address][zipCode]",
      formData.venue.address.zipCode
    );

    if (formData.venue.coordinates.latitude) {
      formDataObj.append(
        "venue[coordinates][latitude]",
        formData.venue.coordinates.latitude
      );
    }
    if (formData.venue.coordinates.longitude) {
      formDataObj.append(
        "venue[coordinates][longitude]",
        formData.venue.coordinates.longitude
      );
    }
    if (formData.venue.mapUrl) {
      formDataObj.append("venue[mapUrl]", formData.venue.mapUrl);
    }

    formData.price.forEach((price, index) => {
      formDataObj.append(`ticketTiers[${index}][name]`, price.label);
      formDataObj.append(`ticketTiers[${index}][price]`, price.value);
      formDataObj.append(
        `ticketTiers[${index}][availableQuantity]`,
        price.quantity
      );
      if (price.maxPerOrder) {
        formDataObj.append(
          `ticketTiers[${index}][maxPerOrder]`,
          price.maxPerOrder
        );
      }
    });

    formDataObj.append("totalCapacity", formData.limit);

    formData.tags.forEach((tag, index) => {
      formDataObj.append(`tags[${index}]`, tag);
    });

    if (refundPoliciesEnabled && refundPolicies.length > 0) {
      formDataObj.append("refundPolicy[type]", "time-based");
      refundPolicies.forEach((policy, index) => {
        formDataObj.append(
          `refundPolicy[rules][${index}][timeBeforeEvent]`,
          policy.timeBeforeEvent
        );
        formDataObj.append(
          `refundPolicy[rules][${index}][refundPercentage]`,
          policy.refundPercentage
        );
      });
    }

    if (formData.poster && formData.poster.length > 0) {
      formData.poster.forEach((file) => {
        formDataObj.append(`eventImages`, file);
      });
    }

    try {
      await updateEvent(eventID, formDataObj);
      navigate(`/app/eventDetails/${eventID}`);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-[#b81bdf] px-6 py-6">
            <h1 className="text-2xl font-bold text-white">Edit Event</h1>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
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
              Pricing & Inventory
              {activeSection === "pricing" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#b81bdf]"></span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("refund")}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeSection === "refund"
                  ? "text-[#b81bdf] border-b-2 border-[#b81bdf]"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Refund Policies
              {activeSection === "refund" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#b81bdf]"></span>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Info Section */}
            <div className={activeSection === "basic" ? "block" : "hidden"}>
              {/* Event Image */}
              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Event preview ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImages((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                          setFormData((prev) => ({
                            ...prev,
                            poster: prev.poster
                              ? prev.poster.filter((_, i) => i !== index)
                              : null,
                          }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="relative h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <label
                      htmlFor="poster-upload"
                      className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
                    >
                      <FaPlus className="text-gray-400 mb-2" size={24} />
                      <span className="text-gray-500">Add Image</span>
                      <input
                        id="poster-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        multiple
                      />
                    </label>
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

              {/* Category - New Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaTag className="mr-2 text-gray-500" />
                    Category
                  </div>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`block w-full px-4 py-3 rounded-lg border ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
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

                {/* Venue */}
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

              {/* Venue */}
              <div className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-[#E167FF]" />
                  Venue Details
                </h3>

                {/* Venue Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Name
                  </label>
                  <input
                    type="text"
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
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors"
                    placeholder="Enter venue name"
                  />
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors"
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
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors"
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
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors"
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
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors"
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
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Coordinates */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors"
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
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Map URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Map URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Google Maps or other map service URL"
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
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              {/* Total Capacity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaUsers className="mr-2 text-gray-500" />
                    Total Event Capacity
                  </div>
                </label>
                <input
                  type="number"
                  name="limit"
                  value={formData.limit}
                  onChange={handleInputChange}
                  min="1"
                  className={`block w-full px-4 py-3 rounded-lg border ${
                    errors.limit ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
                  placeholder="Maximum number of attendees"
                />
                {errors.limit && (
                  <p className="text-red-500 text-sm mt-1">{errors.limit}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  This is the maximum number of people who can attend your event
                  across all ticket types.
                </p>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <FaTag className="mr-2 text-gray-500" />
                    Tags
                  </div>
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
                        <FaTrash className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    ref={tagInputRef}
                    placeholder="Add tags (e.g., music, festival)"
                    className="flex-grow rounded-l-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="rounded-r-lg bg-[#E167FF] px-4 py-3 text-white hover:bg-[#C840E9]"
                  >
                    Add
                  </button>
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
                      Ticket Pricing & Inventory
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

                {errors.price && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {errors.price}
                  </div>
                )}

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
                        className="flex flex-col md:flex-row items-start md:items-center md:flex-wrap xl:flex-nowrap gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#E167FF] transition-colors"
                      >
                        <div className="w-full md:w-1/3">
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
                            className={`w-full px-3 py-2 rounded-md border ${
                              errors[`price_${index}_label`]
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent`}
                          />
                          {errors[`price_${index}_label`] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors[`price_${index}_label`]}
                            </p>
                          )}
                        </div>
                        <div className="w-full md:w-1/3">
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
                            className={`w-full px-3 py-2 rounded-md border ${
                              errors[`price_${index}_value`]
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent`}
                          />
                          {errors[`price_${index}_value`] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors[`price_${index}_value`]}
                            </p>
                          )}
                        </div>
                        <div className="w-full md:w-1/4">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Quantity
                          </label>
                          <div className="flex items-center">
                            <div className="flex-1">
                              <input
                                type="number"
                                placeholder="Available tickets"
                                value={priceItem.quantity}
                                onChange={(e) =>
                                  handlePriceChange(
                                    index,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                                min="1"
                                className={`w-full px-3 py-2 rounded-md border ${
                                  errors[`price_${index}_quantity`]
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent`}
                              />
                              {errors[`price_${index}_quantity`] && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors[`price_${index}_quantity`]}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="w-full md:w-1/4 xl:mt-5">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Max Per Order
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
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500">
                            Optional. Limit per customer.
                          </p>
                        </div>
                        <div className="w-full md:w-auto xl:mt-5">
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

                  {formData.price.length > 0 && (
                    <button
                      type="button"
                      onClick={handleAddPrice}
                      className="flex items-center justify-center w-full py-3 px-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-[#E167FF] hover:bg-gray-100 transition-colors"
                    >
                      <FaPlus className="mr-2" size={12} />
                      Add Another Ticket Type
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <FaBox className="mr-2 text-[#E167FF]" />
                  Inventory Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Event Capacity:</span>
                    <span className="font-semibold">{formData.limit || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Total Tickets Available:
                    </span>
                    <span className="font-semibold">
                      {formData.price.reduce(
                        (sum, item) =>
                          sum + (Number.parseInt(item.quantity) || 0),
                        0
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Refund Policy Section */}
            <div className={activeSection === "refund" ? "block" : "hidden"}>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-medium text-gray-800">
                    <div className="flex items-center">
                      <FaExchangeAlt className="mr-2 text-[#E167FF]" />
                      Refund Policies
                    </div>
                  </label>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-3">
                      {refundPoliciesEnabled ? "Enabled" : "Disabled"}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setRefundPoliciesEnabled(!refundPoliciesEnabled)
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:ring-offset-2 ${
                        refundPoliciesEnabled ? "bg-[#E167FF]" : "bg-gray-200"
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

                <div className="bg-white rounded-lg">
                  {refundPoliciesEnabled ? (
                    <RefundPolicyManager
                      eventId={eventID}
                      onSave={handleSaveRefundPolicies}
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
                  eventLoading
                    ? "bg-[#E167FF]/70 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-[#C840E9] active:scale-[0.98]"
                }`}
                disabled={eventLoading}
              >
                {eventLoading ? (
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
