import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaTicketAlt,
  FaTrash,
  FaPlus,
  FaTag,
  FaUsers,
  FaBox,
  FaExchangeAlt,
  FaExclamationCircle,
} from "react-icons/fa";
import RefundPolicyManager from "./organization/RefundPolicy";
import { useEventStore } from "../store/EventStore";
import { useCategoryStore } from "../store/CategoryStore";
import toast from "react-hot-toast";
import SearchableSelect from "./ui/SearchSelect";
import { AlertCircle, Calendar } from "lucide-react";

const EditEvent = () => {
  const { eventID } = useParams();
  const navigate = useNavigate();
  const tagInputRef = useRef();
  const dateInputRef = useRef(null);

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
    poster: [],
    tags: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState("basic");
  const [refundPolicies, setRefundPolicies] = useState({});
  const [refundPoliciesEnabled, setRefundPoliciesEnabled] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [europeanLocations, setEuropeanLocations] = useState([]);

  const { categories, fetchCategories } = useCategoryStore();
  const {
    selectedEvent,
    fetchEventById,
    updateEvent,
    loading: eventLoading,
  } = useEventStore();

  useEffect(() => {
    if (eventID) {
      fetchEventById(eventID);
    }
  }, [eventID, fetchEventById]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const loadLocationData = async () => {
      try {
        const response = await fetch("/europe.json");
        const data = await response.json();
        setEuropeanLocations(data);
      } catch (error) {
        console.error("Error loading location data:", error);

        setEuropeanLocations([
          {
            country: "Albania",
            states: [
              {
                state: "Berat",
                cities: ["Berat", "Kuçovë", "Poliçan"],
              },
              {
                state: "Tirana",
                cities: ["Tirana", "Kamëz", "Vorë"],
              },
            ],
          },
        ]);
      }
    };

    loadLocationData();
  }, []);

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

      if (selectedEvent.eventImages && selectedEvent.eventImages.length > 0) {
        setPreviewImages(selectedEvent.eventImages);
      }

      if (selectedEvent?.refundPolicy?.rules?.length > 0) {
        setRefundPoliciesEnabled(
          selectedEvent.refundPolicy.type === "time-based"
        );
        setRefundPolicies(selectedEvent.refundPolicy.rules[0] || {});
      }
    }
  }, [selectedEvent]);

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
      const quantity = Number.parseInt(tier.quantity) || 0;
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

  const countries = useMemo(() => {
    return europeanLocations.map((location) => location.country).sort();
  }, [europeanLocations]);

  const availableStates = useMemo(() => {
    if (!formData.venue.address.country) return [];
    const selectedCountry = europeanLocations.find(
      (location) => location.country === formData.venue.address.country
    );
    return selectedCountry
      ? selectedCountry.states.map((state) => state.state).sort()
      : [];
  }, [europeanLocations, formData.venue.address.country]);

  const availableCities = useMemo(() => {
    if (!formData.venue.address.country || !formData.venue.address.state)
      return [];
    const selectedCountry = europeanLocations.find(
      (location) => location.country === formData.venue.address.country
    );
    if (!selectedCountry) return [];

    const selectedState = selectedCountry.states.find(
      (state) => state.state === formData.venue.address.state
    );
    return selectedState ? selectedState.cities.sort() : [];
  }, [
    europeanLocations,
    formData.venue.address.country,
    formData.venue.address.state,
  ]);

  const handleCountryChange = (country) => {
    setFormData((prev) => ({
      ...prev,
      venue: {
        ...prev.venue,
        address: {
          ...prev.venue.address,
          country: country,
          state: "",
          city: "",
        },
      },
    }));
    setErrors((prev) => ({ ...prev, country: null, state: null, city: null }));
  };

  // Handle state change
  const handleStateChange = (state) => {
    setFormData((prev) => ({
      ...prev,
      venue: {
        ...prev.venue,
        address: {
          ...prev.venue.address,
          state: state,
          city: "",
        },
      },
    }));
    setErrors((prev) => ({ ...prev, state: null, city: null }));
  };

  // Handle city change
  const handleCityChange = (city) => {
    setFormData((prev) => ({
      ...prev,
      venue: {
        ...prev.venue,
        address: {
          ...prev.venue.address,
          city: city,
        },
      },
    }));
    setErrors((prev) => ({ ...prev, city: null }));
  };

  const extractSrcFromIframe = (htmlString) => {
    const srcMatch = htmlString.match(/src=["']([^"']+)["']/i);
    return srcMatch ? srcMatch[1] : htmlString;
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

    // Clear related errors
    const newErrors = { ...errors };
    delete newErrors[`price_${index}_label`];
    delete newErrors[`price_${index}_value`];
    delete newErrors[`price_${index}_quantity`];
    delete newErrors[`price_${index}_maxPerOrder`];
    delete newErrors.ticketCapacity;
    setErrors(newErrors);
  };

  const handlePriceChange = (index, field, value) => {
    const errorKey = `price_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: null }));
    }
    if (errors.ticketCapacity) {
      setErrors((prev) => ({ ...prev, ticketCapacity: null }));
    }

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

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    if (name === "price") {
      const price = Number.parseFloat(value);
      if (price >= 0 || value === "") {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStringInputChange = (e, fieldName) => {
    const { value } = e.target;

    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    // Clear error if exists
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: null }));
    }
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

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages((prev) => [...prev, ...newImages]);

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

    const nameError = validateStringInput(formData.name, "Event name");
    if (nameError) newErrors.name = nameError;

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

    const cityError = validateStringInput(formData.venue.address.city, "City");
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

    const dateError = validateFutureDate(formData.date);
    if (dateError) newErrors.date = dateError;

    const timeErrors = validateTimeRange(formData.startTime, formData.endTime);
    Object.assign(newErrors, timeErrors);

    if (!formData.category) newErrors.category = "Category is required";

    const capacityError = validateNumberInput(
      formData.limit,
      "Total capacity",
      1
    );
    if (capacityError) newErrors.limit = capacityError;

    if (formData.price.length === 0) {
      newErrors.price = "At least one ticket type is required";
    } else {
      formData.price.forEach((price, index) => {
        const labelError = validateStringInput(price.label, "Ticket name");
        if (labelError) {
          newErrors[`price_${index}_label`] = labelError;
        }

        const priceError = validateNumberInput(price.value, "Price", -1);
        if (priceError) {
          newErrors[`price_${index}_value`] = priceError;
        }

        const quantityError = validateNumberInput(
          price.quantity,
          "Quantity",
          1
        );
        if (quantityError) {
          newErrors[`price_${index}_quantity`] = quantityError;
        }

        if (price.maxPerOrder && price.maxPerOrder !== "") {
          const maxPerOrderError = validateNumberInput(
            price.maxPerOrder,
            "Max per order",
            1
          );
          if (maxPerOrderError) {
            newErrors[`price_${index}_maxPerOrder`] = maxPerOrderError;
          }

          const maxOrder = Number.parseInt(price.maxPerOrder);
          const available = Number.parseInt(price.quantity);
          if (!isNaN(maxOrder) && !isNaN(available) && maxOrder > available) {
            newErrors[`price_${index}_maxPerOrder`] =
              "Max per order cannot exceed available quantity";
          }
        }
      });

      const capacityErrors = validateTicketCapacity(
        formData.price,
        formData.limit
      );
      Object.assign(newErrors, capacityErrors);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker?.() || dateInputRef.current.focus();
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Select date";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

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

    if (refundPoliciesEnabled && refundPolicies) {
      formDataObj.append("refundPolicy[type]", "time-based");

      formDataObj.append(
        `refundPolicy[rules][daysBeforeEvent]`,
        refundPolicies.daysBeforeEvent
      );
      formDataObj.append(
        `refundPolicy[rules][refundPercentage]`,
        refundPolicies.refundPercentage
      );
      formDataObj.append(
        `refundPolicy[rules][description]`,
        refundPolicies.description
      );
    }
    if (formData.poster && formData.poster.length > 0) {
      formData.poster.forEach((file) => {
        formDataObj.append(`eventImages`, file);
      });
    }

    try {
      await updateEvent(eventID, formDataObj);

      navigate(-1);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event. Please try again.");
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
                  onChange={(e) => handleStringInputChange(e, "name")}
                  className={`block w-full px-4 py-3 rounded-lg border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
                  placeholder="Enter event name"
                />
                {errors.name && (
                  <div className="mt-1 flex items-center text-sm text-red-600">
                    <FaExclamationCircle className="mr-1 h-4 w-4" />
                    {errors.name}
                  </div>
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
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="mt-1 flex items-center text-sm text-red-600">
                    <FaExclamationCircle className="mr-1 h-4 w-4" />
                    {errors.category}
                  </div>
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
                  onChange={(e) => handleStringInputChange(e, "description")}
                  rows={4}
                  className={`block w-full px-4 py-3 rounded-lg border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
                  placeholder="Describe your event"
                />
                {errors.description && (
                  <div className="mt-1 flex items-center text-sm text-red-600">
                    <FaExclamationCircle className="mr-1 h-4 w-4" />
                    {errors.description}
                  </div>
                )}
              </div>

              {/* Date and Location */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <Calendar className="mr-2 text-gray-500" />
                      Date
                    </div>
                  </label>

                  {/* Clickable Date Container */}
                  <div
                    onClick={handleDateClick}
                    className={`relative block w-full px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                      errors.date
                        ? "border-red-500 bg-red-50 hover:bg-red-100"
                        : "border-gray-300 bg-white hover:bg-gray-50 hover:border-[#E167FF]"
                    } focus-within:outline-none focus-within:ring-2 focus-within:ring-[#E167FF] focus-within:border-transparent`}
                  >
                    {/* Hidden actual input */}
                    <input
                      ref={dateInputRef}
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={(e) => {
                        const dateError = validateFutureDate(e.target.value);
                        if (dateError) {
                          setErrors((prev) => ({ ...prev, date: dateError }));
                        } else {
                          setErrors((prev) => ({ ...prev, date: null }));
                        }
                        setFormData((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }));
                      }}
                      min={new Date().toISOString().split("T")[0]}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {/* Custom Display */}
                    <div className="flex items-center justify-between pointer-events-none">
                      <span
                        className={`${
                          !formData.date ? "text-gray-500" : "text-gray-900"
                        }`}
                      >
                        {formatDisplayDate(formData.date)}
                      </span>
                      <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>

                  {errors.date && (
                    <div className="mt-1 flex items-center text-sm text-red-600">
                      <AlertCircle className="mr-1 h-4 w-4" />
                      {errors.date}
                    </div>
                  )}
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
                      className={`block w-full px-4 py-3 rounded-lg border ${
                        errors.startTime ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
                    />
                    {errors.startTime && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <FaExclamationCircle className="mr-1 h-4 w-4" />
                        {errors.startTime}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
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
                      className={`block w-full px-4 py-3 rounded-lg border ${
                        errors.endTime ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
                    />
                    {errors.endTime && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <FaExclamationCircle className="mr-1 h-4 w-4" />
                        {errors.endTime}
                      </div>
                    )}
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
                      const error = validateStringInput(
                        e.target.value,
                        "Venue name"
                      );
                      if (error && e.target.value) {
                        setErrors((prev) => ({ ...prev, venueName: error }));
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
                    className={`block w-full px-4 py-3 rounded-lg border ${
                      errors.venueName ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
                    placeholder="Enter venue name"
                  />
                  {errors.venueName && (
                    <div className="mt-1 flex items-center text-sm text-red-600">
                      <FaExclamationCircle className="mr-1 h-4 w-4" />
                      {errors.venueName}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Street */}
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
                            setErrors((prev) => ({ ...prev, street: error }));
                          } else {
                            setErrors((prev) => ({ ...prev, street: null }));
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
                        className={`block w-full px-4 py-3 rounded-lg border ${
                          errors.street ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
                      />
                      {errors.street && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.street}
                        </div>
                      )}
                    </div>

                    {/* Country Dropdown */}
                    <div>
                      <SearchableSelect
                        options={countries}
                        value={formData.venue.address.country}
                        onChange={handleCountryChange}
                        placeholder="Select Country"
                        error={errors.country}
                      />
                      {errors.country && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.country}
                        </div>
                      )}
                    </div>

                    {/* State Dropdown */}
                    <div>
                      <SearchableSelect
                        options={availableStates}
                        value={formData.venue.address.state}
                        onChange={handleStateChange}
                        placeholder="Select State/Province"
                        disabled={!formData.venue.address.country}
                        error={errors.state}
                      />
                      {errors.state && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.state}
                        </div>
                      )}
                    </div>

                    {/* City Dropdown */}
                    <div>
                      <SearchableSelect
                        options={availableCities}
                        value={formData.venue.address.city}
                        onChange={handleCityChange}
                        placeholder="Select City"
                        disabled={!formData.venue.address.state}
                        error={errors.city}
                      />
                      {errors.city && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.city}
                        </div>
                      )}
                    </div>

                    {/* Zip Code */}
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Zip/Postal Code"
                        value={formData.venue.address.zipCode}
                        onChange={(e) => {
                          const error = validateZipCode(e.target.value);
                          if (error && e.target.value) {
                            setErrors((prev) => ({ ...prev, zipCode: error }));
                          } else {
                            setErrors((prev) => ({ ...prev, zipCode: null }));
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
                        className={`block w-full px-4 py-3 rounded-lg border ${
                          errors.zipCode ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
                      />
                      {errors.zipCode && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.zipCode}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Coordinates */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Map Location (Optional)
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
                            setErrors((prev) => ({ ...prev, latitude: null }));
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
                        className={`block w-full px-4 py-3 rounded-lg border ${
                          errors.latitude ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
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
                            setErrors((prev) => ({ ...prev, longitude: null }));
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
                        className={`block w-full px-4 py-3 rounded-lg border ${
                          errors.longitude
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
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
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    You can paste the full embed code from Google Maps -
                    we&#39;ll extract the URL automatically
                  </p>
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
                  onChange={(e) => handleNumberInputChange(e, "limit")}
                  min="1"
                  className={`block w-full px-4 py-3 rounded-lg border ${
                    errors.limit ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent transition-colors`}
                  placeholder="Maximum number of attendees"
                />
                {errors.limit && (
                  <div className="mt-1 flex items-center text-sm text-red-600">
                    <FaExclamationCircle className="mr-1 h-4 w-4" />
                    {errors.limit}
                  </div>
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
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="rounded-r-lg bg-[#E167FF] px-4 py-3 text-white hover:bg-[#C840E9]"
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
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
                    <FaExclamationCircle className="mr-2 h-4 w-4" />
                    {errors.price}
                  </div>
                )}

                {errors.ticketCapacity && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
                    <FaExclamationCircle className="mr-2 h-4 w-4" />
                    {errors.ticketCapacity}
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
                            onChange={(e) => {
                              const error = validateStringInput(
                                e.target.value,
                                "Ticket name"
                              );
                              if (error && e.target.value) {
                                setErrors((prev) => ({
                                  ...prev,
                                  [`price_${index}_label`]: error,
                                }));
                              } else {
                                setErrors((prev) => ({
                                  ...prev,
                                  [`price_${index}_label`]: null,
                                }));
                              }
                              handlePriceChange(index, "label", e.target.value);
                            }}
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
                            onChange={(e) => {
                              handlePriceChange(index, "value", e.target.value);
                            }}
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
                                onChange={(e) => {
                                  const error = validateNumberInput(
                                    e.target.value,
                                    "Quantity",
                                    1
                                  );
                                  if (error && e.target.value) {
                                    setErrors((prev) => ({
                                      ...prev,
                                      [`price_${index}_quantity`]: error,
                                    }));
                                  } else {
                                    setErrors((prev) => ({
                                      ...prev,
                                      [`price_${index}_quantity`]: null,
                                    }));
                                  }
                                  handlePriceChange(
                                    index,
                                    "quantity",
                                    e.target.value
                                  );
                                }}
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
                                    [`price_${index}_maxPerOrder`]: error,
                                  }));
                                } else {
                                  const maxOrder = Number.parseInt(
                                    e.target.value
                                  );
                                  const available = Number.parseInt(
                                    priceItem.quantity
                                  );
                                  if (
                                    !isNaN(maxOrder) &&
                                    !isNaN(available) &&
                                    maxOrder > available
                                  ) {
                                    setErrors((prev) => ({
                                      ...prev,
                                      [`price_${index}_maxPerOrder`]:
                                        "Max per order cannot exceed available quantity",
                                    }));
                                  } else {
                                    setErrors((prev) => ({
                                      ...prev,
                                      [`price_${index}_maxPerOrder`]: null,
                                    }));
                                  }
                                }
                              } else {
                                setErrors((prev) => ({
                                  ...prev,
                                  [`price_${index}_maxPerOrder`]: null,
                                }));
                              }
                              handlePriceChange(
                                index,
                                "maxPerOrder",
                                e.target.value
                              );
                            }}
                            min="1"
                            className={`w-full px-3 py-2 rounded-md border ${
                              errors[`price_${index}_maxPerOrder`]
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-[#E167FF] focus:border-transparent`}
                          />
                          {errors[`price_${index}_maxPerOrder`] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors[`price_${index}_maxPerOrder`]}
                            </p>
                          )}
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
                      onSave={handleSaveRefundPolicies}
                      initial={refundPolicies}
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
                onClick={() => navigate(-1)}
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
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
};

export default EditEvent;
