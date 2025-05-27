import { useState, useEffect, useRef } from "react";
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
} from "react-icons/fi";
import { RiRefund2Line } from "react-icons/ri";
import RefundPolicyManager from "./organization/RefundPolicy";
import { useEventStore } from "../store/EventStore";
import { useCategoryStore } from "../store/CategoryStore";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

function CreateEventPage() {
  const navigate = useNavigate();
  const { createEvent } = useEventStore();
  const { categories, fetchCategories } = useCategoryStore();
  const tagInputRef = useRef();

  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    eventCategory: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    totalCapacity: "",
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
    ticketTiers: [],
    tags: [],
  });

  const [refundPolicies, setRefundPolicies] = useState({});
  const [refundPoliciesEnabled, setRefundPoliciesEnabled] = useState(false);
  const [errors, setErrors] = useState({});
  const [eventImages, setEventImages] = useState([]);
  const [activeSection, setActiveSection] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const validateStringInput = (value, fieldName) => {
    if (!value || value.trim() === "") {
      return `${fieldName} is required`;
    }

    if (/^\d+$/.test(value.trim())) {
      return `${fieldName} cannot contain only numbers`;
    }
    return null;
  };

  const validateNumberInput = (value, fieldName, min = 0) => {
    if (!value || value === "") {
      return `${fieldName} is required`;
    }

    if (isNaN(value) || isNaN(Number.parseFloat(value))) {
      return `${fieldName} must be a valid number`;
    }
    const numValue = Number.parseFloat(value);
    if (numValue < min) {
      return `${fieldName} must be at least ${min}`;
    }
    return null;
  };

  const validateFutureDate = (dateValue) => {
    if (!dateValue) {
      return "Date is required";
    }
    const selectedDate = new Date(dateValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return "Event date must be in the future";
    }
    return null;
  };

  const validateTimeRange = (startTime, endTime) => {
    const errors = {};

    if (!startTime) {
      errors.startTime = "Start time is required";
    }
    if (!endTime) {
      errors.endTime = "End time is required";
    }

    if (startTime && endTime) {
      if (startTime === endTime) {
        errors.endTime = "End time cannot be the same as start time";
      } else if (startTime >= endTime) {
        errors.endTime = "End time must be after start time";
      }
    }

    return errors;
  };

  const validateTicketCapacity = (ticketTiers, totalCapacity) => {
    const errors = {};
    const totalTickets = ticketTiers.reduce((sum, tier) => {
      const quantity = Number.parseInt(tier.availableQuantity) || 0;
      return sum + quantity;
    }, 0);

    const maxCapacity = Number.parseInt(totalCapacity) || 0;

    if (totalTickets > maxCapacity) {
      errors.ticketCapacity = `Total ticket quantity (${totalTickets}) cannot exceed event capacity (${maxCapacity})`;
    }

    return errors;
  };

  const validateZipCode = (zipCode) => {
    if (!zipCode || zipCode.trim() === "") {
      return "Zip code is required";
    }
    // Allow alphanumeric zip codes (for international support)
    if (!/^[a-zA-Z0-9\s-]{3,10}$/.test(zipCode.trim())) {
      return "Please enter a valid zip code";
    }
    return null;
  };

  const validateCoordinates = (latitude, longitude) => {
    const errors = {};

    if (latitude && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
      errors.latitude = "Latitude must be between -90 and 90";
    }

    if (
      longitude &&
      (isNaN(longitude) || longitude < -180 || longitude > 180)
    ) {
      errors.longitude = "Longitude must be between -180 and 180";
    }

    return errors;
  };

  const extractSrcFromIframe = (htmlString) => {
    const srcMatch = htmlString.match(/src=["']([^"']+)["']/i);
    return srcMatch ? srcMatch[1] : htmlString;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNumberInputChange = (e, fieldName) => {
    const { value } = e.target;

    if (value === "") {
      setFormData((prev) => ({ ...prev, [fieldName]: "" }));
      return;
    }

    if (/^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));

      if (errors[fieldName]) {
        setErrors((prev) => ({ ...prev, [fieldName]: null }));
      }
    }
  };

  const handleStringInputChange = (e, fieldName) => {
    const { value } = e.target;

    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleAddTag = () => {
    const input = tagInputRef.current;
    const trimmedValue = input?.value.trim();
    if (trimmedValue) {
      if (/^\d+$/.test(trimmedValue)) {
        toast.error("Tags cannot contain only numbers");
        return;
      }

      setFormData((prev) => {
        const updatedTags = [...prev.tags, trimmedValue];
        return {
          ...prev,
          tags: updatedTags,
        };
      });
      input.value = "";
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setEventImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(eventImages[index].preview);
    setEventImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTicketTier = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTiers: [
        ...prev.ticketTiers,
        { name: "", price: "", availableQuantity: "", maxPerOrder: "" },
      ],
    }));
  };

  const handleRemoveTicketTier = (index) => {
    setFormData((prev) => ({
      ...prev,
      ticketTiers: prev.ticketTiers.filter((_, i) => i !== index),
    }));
  };

  const handleTicketTierChange = (index, field, value) => {
    const errorKey = `ticketTiers_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: null }));
    }
    if (errors.ticketCapacity) {
      setErrors((prev) => ({ ...prev, ticketCapacity: null }));
    }

    setFormData((prev) => {
      const updatedTiers = prev.ticketTiers.map((tier, i) =>
        i === index ? { ...tier, [field]: value } : tier
      );
      return { ...prev, ticketTiers: updatedTiers };
    });
  };

  const handleSaveRefundPolicies = (policies) => {
    setRefundPolicies(policies);
  };

  const validateSection = (section) => {
    const newErrors = {};

    if (section === "basic") {
      const eventNameError = validateStringInput(
        formData.eventName,
        "Event name"
      );
      if (eventNameError) newErrors.eventName = eventNameError;

      const descriptionError = validateStringInput(
        formData.description,
        "Description"
      );
      if (descriptionError) newErrors.description = descriptionError;

      const venueNameError = validateStringInput(
        formData.venue.name,
        "Venue name"
      );
      if (venueNameError) newErrors.venueName = venueNameError;

      const streetError = validateStringInput(
        formData.venue.address.street,
        "Street"
      );
      if (streetError) newErrors.street = streetError;

      const cityError = validateStringInput(
        formData.venue.address.city,
        "City"
      );
      if (cityError) newErrors.city = cityError;

      const stateError = validateStringInput(
        formData.venue.address.state,
        "State"
      );
      if (stateError) newErrors.state = stateError;

      const countryError = validateStringInput(
        formData.venue.address.country,
        "Country"
      );
      if (countryError) newErrors.country = countryError;

      const zipError = validateZipCode(formData.venue.address.zipCode);
      if (zipError) newErrors.zipCode = zipError;

      const coordErrors = validateCoordinates(
        formData.venue.coordinates.latitude,
        formData.venue.coordinates.longitude
      );
      Object.assign(newErrors, coordErrors);

      if (!formData.eventCategory) {
        newErrors.eventCategory = "Category is required";
      }
    } else if (section === "datetime") {
      const dateError = validateFutureDate(formData.eventDate);
      if (dateError) newErrors.eventDate = dateError;

      const timeErrors = validateTimeRange(
        formData.startTime,
        formData.endTime
      );
      Object.assign(newErrors, timeErrors);

      const capacityError = validateNumberInput(
        formData.totalCapacity,
        "Total capacity",
        1
      );
      if (capacityError) newErrors.totalCapacity = capacityError;
      if (eventImages.length === 0) {
        newErrors.eventImages = "At least one event image is required";
      }
    } else if (section === "pricing") {
      if (formData.ticketTiers.length === 0) {
        newErrors.ticketTiers = "At least one ticket type is required";
      } else {
        formData.ticketTiers.forEach((tier, index) => {
          const nameError = validateStringInput(tier.name, "Ticket name");
          if (nameError) {
            newErrors[`ticketTiers_${index}_name`] = nameError;
          }

          const priceError = validateNumberInput(tier.price, "Price", 0);
          if (priceError) {
            newErrors[`ticketTiers_${index}_price`] = priceError;
          }

          const quantityError = validateNumberInput(
            tier.availableQuantity,
            "Quantity",
            1
          );
          if (quantityError) {
            newErrors[`ticketTiers_${index}_availableQuantity`] = quantityError;
          }

          if (tier.maxPerOrder && tier.maxPerOrder !== "") {
            const maxPerOrderError = validateNumberInput(
              tier.maxPerOrder,
              "Max per order",
              1
            );
            if (maxPerOrderError) {
              newErrors[`ticketTiers_${index}_maxPerOrder`] = maxPerOrderError;
            }

            const maxOrder = Number.parseInt(tier.maxPerOrder);
            const available = Number.parseInt(tier.availableQuantity);
            if (!isNaN(maxOrder) && !isNaN(available) && maxOrder > available) {
              newErrors[`ticketTiers_${index}_maxPerOrder`] =
                "Max per order cannot exceed available quantity";
            }
          }
        });

        const capacityErrors = validateTicketCapacity(
          formData.ticketTiers,
          formData.totalCapacity
        );
        Object.assign(newErrors, capacityErrors);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const basicValid = validateSection("basic");
    const datetimeValid = validateSection("datetime");
    const pricingValid = validateSection("pricing");

    if (!basicValid || !datetimeValid || !pricingValid) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("eventName", formData.eventName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("eventCategory", formData.eventCategory);

      eventImages.forEach((image) => {
        formDataToSend.append("eventImages", image.file);
      });

      formDataToSend.append("eventDate", formData.eventDate);
      formDataToSend.append("startTime", formData.startTime);
      formDataToSend.append("endTime", formData.endTime);
      formDataToSend.append("totalCapacity", formData.totalCapacity);

      formDataToSend.append("venue[name]", formData.venue.name);
      formDataToSend.append(
        "venue[address][street]",
        formData.venue.address.street
      );
      formDataToSend.append(
        "venue[address][city]",
        formData.venue.address.city
      );
      formDataToSend.append(
        "venue[address][state]",
        formData.venue.address.state
      );
      formDataToSend.append(
        "venue[address][country]",
        formData.venue.address.country
      );
      formDataToSend.append(
        "venue[address][zipCode]",
        formData.venue.address.zipCode
      );

      if (
        formData.venue.coordinates.latitude &&
        formData.venue.coordinates.longitude
      ) {
        formDataToSend.append(
          "venue[coordinates][latitude]",
          formData.venue.coordinates.latitude
        );
        formDataToSend.append(
          "venue[coordinates][longitude]",
          formData.venue.coordinates.longitude
        );
      }

      if (formData.venue.mapUrl) {
        formDataToSend.append("venue[mapUrl]", formData.venue.mapUrl);
      }

      formData.ticketTiers.forEach((tier, index) => {
        formDataToSend.append(`ticketTiers[${index}][name]`, tier.name);
        formDataToSend.append(`ticketTiers[${index}][price]`, tier.price);
        formDataToSend.append(
          `ticketTiers[${index}][availableQuantity]`,
          tier.availableQuantity
        );
        if (tier.maxPerOrder) {
          formDataToSend.append(
            `ticketTiers[${index}][maxPerOrder]`,
            tier.maxPerOrder
          );
        }
      });

      if (
        refundPoliciesEnabled &&
        refundPolicies &&
        refundPolicies.daysBeforeEvent
      ) {
        formDataToSend.append("refundPolicy[type]", "time-based");
        formDataToSend.append(
          `refundPolicy[rules][daysBeforeEvent]`,
          refundPolicies.daysBeforeEvent
        );
        formDataToSend.append(
          `refundPolicy[rules][refundPercentage]`,
          refundPolicies.refundPercentage
        );
        formDataToSend.append(
          `refundPolicy[rules][description]`,
          refundPolicies.description
        );
      }

      formData.tags.forEach((tag, index) => {
        formDataToSend.append(`tags[${index}]`, tag);
      });

      await createEvent(formDataToSend);

      navigate("/app/profile");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    eventImages.forEach((image) => {
      URL.revokeObjectURL(image.preview);
    });
    navigate("/app/profile");
  };

  useEffect(() => {
    return () => {
      eventImages.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [eventImages]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleCancel}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Events
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                      htmlFor="eventName"
                      className="mb-2 flex items-center text-sm font-medium text-gray-700"
                    >
                      <FiInfo className="mr-2 h-4 w-4 text-purple-500" />
                      Event Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="eventName"
                        name="eventName"
                        value={formData.eventName}
                        onChange={(e) =>
                          handleStringInputChange(e, "eventName")
                        }
                        placeholder="Enter a catchy name for your event"
                        className={`w-full rounded-lg border ${
                          errors.eventName
                            ? "border-red-300 bg-red-50"
                            : "border-purple-200 bg-white"
                        } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                      />
                      {errors.eventName && (
                        <div className="mt-1 flex items-center text-sm text-red-600">
                          <FiAlertCircle className="mr-1 h-4 w-4" />
                          {errors.eventName}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Event Category */}
                  <div className="mb-5">
                    <label
                      htmlFor="eventCategory"
                      className="mb-2 flex items-center text-sm font-medium text-gray-700"
                    >
                      <FiTag className="mr-2 h-4 w-4 text-purple-500" />
                      Event Category
                    </label>
                    <select
                      id="eventCategory"
                      name="eventCategory"
                      value={formData.eventCategory}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${
                        errors.eventCategory
                          ? "border-red-300 bg-red-50"
                          : "border-purple-200 bg-white"
                      } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.eventCategory && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <FiAlertCircle className="mr-1 h-4 w-4" />
                        {errors.eventCategory}
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
                      onChange={(e) =>
                        handleStringInputChange(e, "description")
                      }
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
                          const error = validateStringInput(
                            e.target.value,
                            "Venue name"
                          );
                          if (error && e.target.value) {
                            setErrors((prev) => ({
                              ...prev,
                              venueName: error,
                            }));
                          } else {
                            setErrors((prev) => ({ ...prev, venueName: null }));
                          }
                          setFormData((prev) => ({
                            ...prev,
                            venue: {
                              ...prev.venue,
                              name: e.target.value,
                            },
                          }));
                        }}
                        placeholder="Enter venue name"
                        className={`w-full rounded-lg border ${
                          errors.venueName
                            ? "border-red-300 bg-red-50"
                            : "border-purple-200 bg-white"
                        } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                      />
                      {errors.venueName && (
                        <div className="mt-1 flex items-center text-sm text-red-600">
                          <FiAlertCircle className="mr-1 h-4 w-4" />
                          {errors.venueName}
                        </div>
                      )}
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
                              const error = validateStringInput(
                                e.target.value,
                                "Street"
                              );
                              if (error && e.target.value) {
                                setErrors((prev) => ({
                                  ...prev,
                                  street: error,
                                }));
                              } else {
                                setErrors((prev) => ({
                                  ...prev,
                                  street: null,
                                }));
                              }
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
                            className={`w-full rounded-lg border ${
                              errors.street
                                ? "border-red-300 bg-red-50"
                                : "border-purple-200 bg-white"
                            } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                          />
                          {errors.street && (
                            <div className="mt-1 text-xs text-red-600">
                              {errors.street}
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="City"
                            value={formData.venue.address.city}
                            onChange={(e) => {
                              const error = validateStringInput(
                                e.target.value,
                                "City"
                              );
                              if (error && e.target.value) {
                                setErrors((prev) => ({ ...prev, city: error }));
                              } else {
                                setErrors((prev) => ({ ...prev, city: null }));
                              }
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
                            className={`w-full rounded-lg border ${
                              errors.city
                                ? "border-red-300 bg-red-50"
                                : "border-purple-200 bg-white"
                            } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                          />
                          {errors.city && (
                            <div className="mt-1 text-xs text-red-600">
                              {errors.city}
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="State/Province"
                            value={formData.venue.address.state}
                            onChange={(e) => {
                              const error = validateStringInput(
                                e.target.value,
                                "State"
                              );
                              if (error && e.target.value) {
                                setErrors((prev) => ({
                                  ...prev,
                                  state: error,
                                }));
                              } else {
                                setErrors((prev) => ({ ...prev, state: null }));
                              }
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
                            className={`w-full rounded-lg border ${
                              errors.state
                                ? "border-red-300 bg-red-50"
                                : "border-purple-200 bg-white"
                            } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                          />
                          {errors.state && (
                            <div className="mt-1 text-xs text-red-600">
                              {errors.state}
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Zip/Postal Code"
                            value={formData.venue.address.zipCode}
                            onChange={(e) => {
                              const error = validateZipCode(e.target.value);
                              if (error && e.target.value) {
                                setErrors((prev) => ({
                                  ...prev,
                                  zipCode: error,
                                }));
                              } else {
                                setErrors((prev) => ({
                                  ...prev,
                                  zipCode: null,
                                }));
                              }
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
                            className={`w-full rounded-lg border ${
                              errors.zipCode
                                ? "border-red-300 bg-red-50"
                                : "border-purple-200 bg-white"
                            } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                          />
                          {errors.zipCode && (
                            <div className="mt-1 text-xs text-red-600">
                              {errors.zipCode}
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            placeholder="Country"
                            value={formData.venue.address.country}
                            onChange={(e) => {
                              const error = validateStringInput(
                                e.target.value,
                                "Country"
                              );
                              if (error && e.target.value) {
                                setErrors((prev) => ({
                                  ...prev,
                                  country: error,
                                }));
                              } else {
                                setErrors((prev) => ({
                                  ...prev,
                                  country: null,
                                }));
                              }
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
                            className={`w-full rounded-lg border ${
                              errors.country
                                ? "border-red-300 bg-red-50"
                                : "border-purple-200 bg-white"
                            } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                          />
                          {errors.country && (
                            <div className="mt-1 text-xs text-red-600">
                              {errors.country}
                            </div>
                          )}
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
                            type="number"
                            step="any"
                            placeholder="Latitude (-90 to 90)"
                            value={formData.venue.coordinates.latitude}
                            onChange={(e) => {
                              const value = e.target.value;
                              const coordErrors = validateCoordinates(
                                value,
                                formData.venue.coordinates.longitude
                              );
                              if (coordErrors.latitude) {
                                setErrors((prev) => ({
                                  ...prev,
                                  latitude: coordErrors.latitude,
                                }));
                              } else {
                                setErrors((prev) => ({
                                  ...prev,
                                  latitude: null,
                                }));
                              }
                              setFormData((prev) => ({
                                ...prev,
                                venue: {
                                  ...prev.venue,
                                  coordinates: {
                                    ...prev.venue.coordinates,
                                    latitude: value,
                                  },
                                },
                              }));
                            }}
                            className={`w-full rounded-lg border ${
                              errors.latitude
                                ? "border-red-300 bg-red-50"
                                : "border-purple-200 bg-white"
                            } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                          />
                          {errors.latitude && (
                            <div className="mt-1 text-xs text-red-600">
                              {errors.latitude}
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            type="number"
                            step="any"
                            placeholder="Longitude (-180 to 180)"
                            value={formData.venue.coordinates.longitude}
                            onChange={(e) => {
                              const value = e.target.value;
                              const coordErrors = validateCoordinates(
                                formData.venue.coordinates.latitude,
                                value
                              );
                              if (coordErrors.longitude) {
                                setErrors((prev) => ({
                                  ...prev,
                                  longitude: coordErrors.longitude,
                                }));
                              } else {
                                setErrors((prev) => ({
                                  ...prev,
                                  longitude: null,
                                }));
                              }
                              setFormData((prev) => ({
                                ...prev,
                                venue: {
                                  ...prev.venue,
                                  coordinates: {
                                    ...prev.venue.coordinates,
                                    longitude: value,
                                  },
                                },
                              }));
                            }}
                            className={`w-full rounded-lg border ${
                              errors.longitude
                                ? "border-red-300 bg-red-50"
                                : "border-purple-200 bg-white"
                            } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                          />
                          {errors.longitude && (
                            <div className="mt-1 text-xs text-red-600">
                              {errors.longitude}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Map URL */}
                    <div>
                      <label
                        htmlFor="mapUrl"
                        className="mb-2 flex items-center text-sm font-medium text-gray-700"
                      >
                        Embed Map URL (Optional)
                        <button
                          type="button"
                          onClick={() => setShowMapModal(true)}
                          className="ml-2 text-purple-600 hover:text-purple-800 text-xs underline"
                        >
                          How to get embed URL?
                        </button>
                      </label>
                      <input
                        type="text"
                        id="mapUrl"
                        name="mapUrl"
                        value={formData.venue.mapUrl}
                        onChange={(e) => {
                          const value = e.target.value;
                          const extractedSrc = extractSrcFromIframe(value);
                          setFormData((prev) => ({
                            ...prev,
                            venue: {
                              ...prev.venue,
                              mapUrl: extractedSrc,
                            },
                          }));
                        }}
                        placeholder="Paste Google Maps embed code or direct URL"
                        className="w-full rounded-lg border border-purple-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        You can paste the full embed code from Google Maps -
                        we&#39;ll extract the URL automatically
                      </p>
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
                        ref={tagInputRef}
                        placeholder="Add tags (e.g., music, festival)"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="flex-grow rounded-l-lg border border-purple-200 bg-white px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="rounded-r-lg bg-purple-600 px-4 py-3 text-white hover:bg-purple-700"
                      >
                        Add
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Press Enter or click Add to add a tag. Tags cannot contain
                      only numbers.
                    </p>
                  </div>
                </div>

                {/* Event Images */}
                <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
                  <h2 className="mb-4 text-lg font-semibold text-purple-800">
                    Event Images
                  </h2>

                  <div className="overflow-hidden rounded-lg border-2 border-dashed border-purple-200 bg-white">
                    <div className="relative">
                      <input
                        type="file"
                        id="eventImages"
                        name="eventImages"
                        className="absolute inset-0 cursor-pointer opacity-0 z-10"
                        accept="image/*"
                        onChange={handleImagesChange}
                        multiple
                      />

                      {eventImages.length > 0 ? (
                        <div className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {eventImages.map((image, index) => (
                              <div
                                key={index}
                                className="relative aspect-video rounded-lg overflow-hidden"
                              >
                                <img
                                  src={image.preview || "/placeholder.svg"}
                                  alt={`Event preview ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white transition-all hover:bg-black/70 z-50"
                                >
                                  <FiX className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                            <div
                              className="aspect-video rounded-lg border-2 border-dashed border-purple-200 flex items-center justify-center cursor-pointer hover:bg-purple-50"
                              onClick={() =>
                                document.getElementById("eventImages").click()
                              }
                            >
                              <div className="text-center">
                                <FiPlus className="h-8 w-8 mx-auto text-purple-500" />
                                <p className="text-sm text-purple-600 mt-1">
                                  Add more
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="mb-3 rounded-full bg-purple-100 p-3">
                            <FiImage className="h-8 w-8 text-purple-600" />
                          </div>
                          <p className="mb-1 text-base font-medium text-gray-700">
                            Drag and drop your event images here
                          </p>
                          <p className="mb-4 text-sm text-gray-500">
                            or click to browse files
                          </p>
                          <p className="text-xs text-gray-400">
                            You can upload multiple images
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
                      htmlFor="eventDate"
                      className="mb-2 flex items-center text-sm font-medium text-gray-700"
                    >
                      <FiCalendar className="mr-2 h-4 w-4 text-purple-500" />
                      Event Date
                    </label>
                    <input
                      type="date"
                      id="eventDate"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={(e) => {
                        const dateError = validateFutureDate(e.target.value);
                        if (dateError) {
                          setErrors((prev) => ({
                            ...prev,
                            eventDate: dateError,
                          }));
                        } else {
                          setErrors((prev) => ({ ...prev, eventDate: null }));
                        }
                        setFormData((prev) => ({
                          ...prev,
                          eventDate: e.target.value,
                        }));
                      }}
                      min={new Date().toISOString().split("T")[0]}
                      className={`w-full rounded-lg border ${
                        errors.eventDate
                          ? "border-red-300 bg-red-50"
                          : "border-purple-200 bg-white"
                      } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                    />
                    {errors.eventDate && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <FiAlertCircle className="mr-1 h-4 w-4" />
                        {errors.eventDate}
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
                        onChange={(e) => {
                          const timeErrors = validateTimeRange(
                            e.target.value,
                            formData.endTime
                          );
                          setErrors((prev) => ({
                            ...prev,
                            startTime: timeErrors.startTime || null,
                            endTime: timeErrors.endTime || prev.endTime,
                          }));
                          setFormData((prev) => ({
                            ...prev,
                            startTime: e.target.value,
                          }));
                        }}
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
                        onChange={(e) => {
                          const timeErrors = validateTimeRange(
                            formData.startTime,
                            e.target.value
                          );
                          setErrors((prev) => ({
                            ...prev,
                            endTime: timeErrors.endTime || null,
                            startTime: timeErrors.startTime || prev.startTime,
                          }));
                          setFormData((prev) => ({
                            ...prev,
                            endTime: e.target.value,
                          }));
                        }}
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
                      htmlFor="totalCapacity"
                      className="mb-2 flex items-center text-sm font-medium text-gray-700"
                    >
                      <FiUsers className="mr-2 h-4 w-4 text-purple-500" />
                      Total Event Capacity
                    </label>
                    <input
                      type="number"
                      id="totalCapacity"
                      name="totalCapacity"
                      value={formData.totalCapacity}
                      onChange={(e) =>
                        handleNumberInputChange(e, "totalCapacity")
                      }
                      min="1"
                      placeholder="Maximum number of attendees"
                      className={`w-full rounded-lg border ${
                        errors.totalCapacity
                          ? "border-red-300 bg-red-50"
                          : "border-purple-200 bg-white"
                      } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                    />
                    {errors.totalCapacity && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <FiAlertCircle className="mr-1 h-4 w-4" />
                        {errors.totalCapacity}
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
                      onClick={handleAddTicketTier}
                      className="flex items-center rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-purple-700"
                    >
                      <FiPlus className="mr-1.5 h-3.5 w-3.5" />
                      Add Ticket Type
                    </button>
                  </div>

                  {errors.ticketTiers && (
                    <div className="mb-4 flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                      <FiAlertCircle className="mr-2 h-4 w-4" />
                      {errors.ticketTiers}
                    </div>
                  )}

                  {errors.ticketCapacity && (
                    <div className="mb-4 flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                      <FiAlertCircle className="mr-2 h-4 w-4" />
                      {errors.ticketCapacity}
                    </div>
                  )}

                  {formData.ticketTiers.length === 0 ? (
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
                        onClick={handleAddTicketTier}
                        className="flex items-center rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-purple-700"
                      >
                        <FiPlus className="mr-1.5 h-3.5 w-3.5" />
                        Add Ticket Type
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.ticketTiers.map((tier, index) => (
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
                              onClick={() => handleRemoveTicketTier(index)}
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
                                value={tier.name}
                                onChange={(e) => {
                                  const error = validateStringInput(
                                    e.target.value,
                                    "Ticket name"
                                  );
                                  if (error && e.target.value) {
                                    setErrors((prev) => ({
                                      ...prev,
                                      [`ticketTiers_${index}_name`]: error,
                                    }));
                                  } else {
                                    setErrors((prev) => ({
                                      ...prev,
                                      [`ticketTiers_${index}_name`]: null,
                                    }));
                                  }
                                  handleTicketTierChange(
                                    index,
                                    "name",
                                    e.target.value
                                  );
                                }}
                                className={`w-full rounded-lg border ${
                                  errors[`ticketTiers_${index}_name`]
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-200 bg-gray-50"
                                } px-3 py-2.5 text-gray-900 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                              />
                              {errors[`ticketTiers_${index}_name`] && (
                                <div className="mt-1 text-xs text-red-600">
                                  {errors[`ticketTiers_${index}_name`]}
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
                                  value={tier.price}
                                  onChange={(e) => {
                                    const error = validateNumberInput(
                                      e.target.value,
                                      "Price",
                                      0
                                    );
                                    if (error && e.target.value) {
                                      setErrors((prev) => ({
                                        ...prev,
                                        [`ticketTiers_${index}_price`]: error,
                                      }));
                                    } else {
                                      setErrors((prev) => ({
                                        ...prev,
                                        [`ticketTiers_${index}_price`]: null,
                                      }));
                                    }
                                    handleTicketTierChange(
                                      index,
                                      "price",
                                      e.target.value
                                    );
                                  }}
                                  min="0"
                                  step="0.01"
                                  className={`w-full rounded-lg border ${
                                    errors[`ticketTiers_${index}_price`]
                                      ? "border-red-300 bg-red-50"
                                      : "border-gray-200 bg-gray-50"
                                  } pl-8 pr-3 py-2.5 text-gray-900 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                                />
                                {errors[`ticketTiers_${index}_price`] && (
                                  <div className="mt-1 text-xs text-red-600">
                                    {errors[`ticketTiers_${index}_price`]}
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
                                  value={tier.availableQuantity}
                                  onChange={(e) => {
                                    const error = validateNumberInput(
                                      e.target.value,
                                      "Quantity",
                                      1
                                    );
                                    if (error && e.target.value) {
                                      setErrors((prev) => ({
                                        ...prev,
                                        [`ticketTiers_${index}_availableQuantity`]:
                                          error,
                                      }));
                                    } else {
                                      setErrors((prev) => ({
                                        ...prev,
                                        [`ticketTiers_${index}_availableQuantity`]:
                                          null,
                                      }));
                                    }
                                    handleTicketTierChange(
                                      index,
                                      "availableQuantity",
                                      e.target.value
                                    );
                                  }}
                                  min="1"
                                  className={`w-full rounded-lg border ${
                                    errors[
                                      `ticketTiers_${index}_availableQuantity`
                                    ]
                                      ? "border-red-300 bg-red-50"
                                      : "border-gray-200 bg-gray-50"
                                  } pl-8 pr-3 py-2.5 text-gray-900 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                                />
                                {errors[
                                  `ticketTiers_${index}_availableQuantity`
                                ] && (
                                  <div className="mt-1 text-xs text-red-600">
                                    {
                                      errors[
                                        `ticketTiers_${index}_availableQuantity`
                                      ]
                                    }
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
                                value={tier.maxPerOrder || ""}
                                onChange={(e) => {
                                  if (e.target.value) {
                                    const error = validateNumberInput(
                                      e.target.value,
                                      "Max per order",
                                      1
                                    );
                                    if (error) {
                                      setErrors((prev) => ({
                                        ...prev,
                                        [`ticketTiers_${index}_maxPerOrder`]:
                                          error,
                                      }));
                                    } else {
                                      const maxOrder = Number.parseInt(
                                        e.target.value
                                      );
                                      const available = Number.parseInt(
                                        tier.availableQuantity
                                      );
                                      if (
                                        !isNaN(maxOrder) &&
                                        !isNaN(available) &&
                                        maxOrder > available
                                      ) {
                                        setErrors((prev) => ({
                                          ...prev,
                                          [`ticketTiers_${index}_maxPerOrder`]:
                                            "Max per order cannot exceed available quantity",
                                        }));
                                      } else {
                                        setErrors((prev) => ({
                                          ...prev,
                                          [`ticketTiers_${index}_maxPerOrder`]:
                                            null,
                                        }));
                                      }
                                    }
                                  } else {
                                    setErrors((prev) => ({
                                      ...prev,
                                      [`ticketTiers_${index}_maxPerOrder`]:
                                        null,
                                    }));
                                  }
                                  handleTicketTierChange(
                                    index,
                                    "maxPerOrder",
                                    e.target.value
                                  );
                                }}
                                min="1"
                                className={`w-full rounded-lg border ${
                                  errors[`ticketTiers_${index}_maxPerOrder`]
                                    ? "border-red-300 bg-red-50"
                                    : "border-gray-200 bg-gray-50"
                                } px-3 py-2.5 text-gray-900 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                              />
                              {errors[`ticketTiers_${index}_maxPerOrder`] && (
                                <div className="mt-1 text-xs text-red-600">
                                  {errors[`ticketTiers_${index}_maxPerOrder`]}
                                </div>
                              )}
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
                        onClick={handleAddTicketTier}
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
                      initial={[
                        {
                          daysBeforeEvent: 7,
                          refundPercentage: 50,
                          description:
                            "50% refund up to 7 days before the event",
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
                          {formData.eventName || "Not specified"}
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
                          {categories.find(
                            (c) => c._id === formData.eventCategory
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
                          {formData.eventDate
                            ? `${formData.eventDate} from ${
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
                          {formData.totalCapacity
                            ? `${formData.totalCapacity} attendees`
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
                        {formData.ticketTiers.length > 0 ? (
                          <ul className="mt-1 space-y-1">
                            {formData.ticketTiers.map((tier, index) => (
                              <li key={index} className="text-sm text-gray-600">
                                {tier.name || `Ticket ${index + 1}`}: $
                                {tier.price || "0.00"} (Qty:{" "}
                                {tier.availableQuantity || "0"})
                                {tier.maxPerOrder && (
                                  <span className="text-gray-400 ml-2">
                                    (Max {tier.maxPerOrder} per order)
                                  </span>
                                )}
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
                      <RiRefund2Line className="mr-2 mt-0.5 h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Refund Policies
                        </p>
                        {refundPoliciesEnabled ? (
                          refundPolicies ? (
                            <ul className="mt-1 space-y-1">
                              <li className="text-sm text-gray-600">
                                {refundPolicies.description}
                              </li>
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
                          Event Images
                        </p>
                        <p className="text-sm text-gray-600">
                          {eventImages.length > 0
                            ? `${eventImages.length} images uploaded`
                            : "No images uploaded"}
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
      {/* Map Instructions Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  How to Get Google Maps Embed URL
                </h3>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTrash className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Step-by-Step Instructions:
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                    <li>
                      Go to{" "}
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Google Maps
                      </a>
                    </li>
                    <li>Search for your venue location</li>
                    <li>Click the &quot;Share&quot; button</li>
                    <li>Select &quot;Embed a map&quot; tab</li>
                    <li>Copy the entire HTML code provided</li>
                    <li>
                      Paste it in the Map URL field - we&apos;ll extract the URL
                      automatically
                    </li>
                  </ol>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Visual Guide:
                  </h4>
                  <img
                    src="/map.jpeg"
                    alt="Google Maps embed instructions"
                    className="w-full rounded-lg border"
                  />
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Example of what to copy:
                  </h4>
                  <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
                    {
                      '<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
                    }
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-green-800">
                        Pro Tip
                      </h4>
                      <p className="text-sm text-green-700 mt-1">
                        You can paste the entire embed code - our system will
                        automatically extract just the URL part you need!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowMapModal(false)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateEventPage;
