import { useState } from "react";
import PropTypes from "prop-types";
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
  FiCheck,
  FiAlertCircle,
  FiTag,
  FiUsers,
  FiPackage,
} from "react-icons/fi";

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

function CreateEventForm({ onCancel }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    date: "",
    startTime: "",
    endTime: "",
    limit: "",
    location: "",
    price: [],
    organizer: localStorage.getItem("user_id")?.toString() || "",
  });

  const [errors, setErrors] = useState({});
  const [posterPreview, setPosterPreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

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
      price: [...prev.price, { label: "", value: "", quantity: "" }],
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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name) newErrors.name = "Event name is required";
      if (!formData.description)
        newErrors.description = "Description is required";
      if (!formData.location) newErrors.location = "Location is required";
      if (!formData.category) newErrors.category = "Category is required";
    } else if (step === 2) {
      if (!formData.date) newErrors.date = "Date is required";
      if (!formData.startTime) newErrors.startTime = "Start time is required";
      if (!formData.endTime) newErrors.endTime = "End time is required";
      if (!formData.limit) newErrors.limit = "Attendee limit is required";
    } else if (step === 3) {
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

  const nextStep = () => {
    if (validateStep(currentStep)) {
      const nextStepValue = currentStep + 1;
      if (nextStepValue <= totalSteps) {
        setCurrentStep(nextStepValue);
        console.log("Moving to step:", nextStepValue);
      }
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    try {
      console.log("Form submitted with data:", formData);

      navigate("/app/profile");

      handleCancel();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      date: "",
      startTime: "",
      endTime: "",
      limit: "",
      location: "",
      price: [],
      organizer: localStorage.getItem("user_id")?.toString() || "",
    });
    setErrors({});
    setPosterPreview(null);
    setCurrentStep(1);
    onCancel();
  };

  return (
    <div className="max-h-[85vh] overflow-hidden rounded-xl bg-white">
      <div className="relative bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 px-6 py-5 text-white">
        <button
          onClick={handleCancel}
          className="absolute right-4 top-4 rounded-full bg-white/20 p-1.5 text-white transition-all hover:bg-white/30"
        >
          <FiX className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">Create New Event</h1>
        <p className="mt-1 text-purple-100">
          Fill in the details to create your event
        </p>

        {/* Progress steps */}
        <div className="mt-4 flex justify-center">
          <div className="flex items-center max-w-md mx-auto">
            {Array.from({ length: totalSteps - 1 }).map((_, index) => (
              <div
                key={index}
                className="
flex items-center
"
              >
                <div
                  className={`
flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium 
${
  currentStep > index + 1
    ? "bg-white text-purple-600"
    : currentStep === index + 1
    ? "border-2 border-white bg-purple-600 text-white"
    : "border border-purple-300 bg-purple-500/50 text-purple-100"
}
`}
                >
                  {currentStep > index + 1 ? (
                    <FiCheck
                      className="
h-4 w-4
"
                    />
                  ) : (
                    index + 1
                  )}
                </div>

                {index < totalSteps - 2 && (
                  <div
                    className={`
h-1 w-16 
${currentStep > index + 1 ? "bg-white" : "bg-purple-300/50"}
`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-h-[calc(85vh-130px)] overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
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

                {/* Event Category - New Field */}
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

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 flex items-center text-sm font-medium text-gray-700"
                  >
                    <FiMapPin className="mr-2 h-4 w-4 text-purple-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Where will your event take place?"
                    className={`w-full rounded-lg border ${
                      errors.location
                        ? "border-red-300 bg-red-50"
                        : "border-purple-200 bg-white"
                    } px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                  />
                  {errors.location && (
                    <div className="mt-1 flex items-center text-sm text-red-600">
                      <FiAlertCircle className="mr-1 h-4 w-4" />
                      {errors.location}
                    </div>
                  )}
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
          )}

          {/* Step 2: Date, Time & Capacity */}
          {currentStep === 2 && (
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
          )}

          {/* Step 3: Ticket Pricing */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
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
          )}

          {/* Step 4: Summary */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Summary Section */}
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
                        Location
                      </p>
                      <p className="text-sm text-gray-600">
                        {formData.location || "Not specified"}
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
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
              >
                Cancel
              </button>
            )}

            {currentStep === totalSteps ? (
              <button
                type="submit"
                className="flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
              >
                Create Event
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
              >
                Continue
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

CreateEventForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
};

export default CreateEventForm;
