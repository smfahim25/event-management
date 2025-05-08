import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function CreateEventForm({ onCancel }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    limit: "",
    location: "",
    price: [],
    organizer: localStorage.getItem("user_id")?.toString() || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Event name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (!formData.limit) newErrors.limit = "Attendee limit is required";
    if (!formData.location) newErrors.location = "Location is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    try {
      // Simulated successful form submission
      console.log("Form submitted with data:", formData);

      // Navigate to profile page after successful submission
      navigate("/app/profile");

      // Reset form after submission
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
      date: "",
      startTime: "",
      endTime: "",
      limit: "",
      location: "",
      price: [],
      organizer: localStorage.getItem("user_id")?.toString() || "",
    });
    setErrors({});
    onCancel();
  };

  return (
    <div className="container p-10 px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Event Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-200 border shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-200 border shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          ></textarea>
          {errors.description && (
            <p className="mt-2 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-200 border shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          />
          {errors.date && (
            <p className="mt-2 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700"
          >
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-200 border shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          />
          {errors.startTime && (
            <p className="mt-2 text-sm text-red-600">{errors.startTime}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-gray-700"
          >
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-200 border shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          />
          {errors.endTime && (
            <p className="mt-2 text-sm text-red-600">{errors.endTime}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="limit"
            className="block text-sm font-medium text-gray-700"
          >
            Attendee Limit
          </label>
          <input
            type="number"
            id="limit"
            name="limit"
            value={formData.limit}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-200 border shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          />
          {errors.limit && (
            <p className="mt-2 text-sm text-red-600">{errors.limit}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-200 border shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
          />
          {errors.location && (
            <p className="mt-2 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Ticket Prices Section */}
        <div className="mb-4">
          <label
            htmlFor="prices"
            className="block text-sm font-medium text-gray-700"
          >
            Ticket Prices
          </label>
          <div className="space-y-4">
            {formData.price.map((priceItem, index) => (
              <div
                key={index}
                className="flex flex-wrap items-center gap-4 p-2 border rounded-md shadow-sm"
              >
                <input
                  type="text"
                  placeholder="Enter Label"
                  value={priceItem.label}
                  onChange={(e) =>
                    handlePriceChange(index, "label", e.target.value)
                  }
                  className="flex-grow p-2 rounded-md border-gray-200 border focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                />
                <input
                  type="number"
                  placeholder="Enter Price ($)"
                  value={priceItem.value}
                  onChange={(e) =>
                    handlePriceChange(index, "value", e.target.value)
                  }
                  min="0"
                  className="flex-grow p-2 rounded-md border-gray-200 border focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePrice(index)}
                  className="px-3 py-2 bg-red-600 rounded-md text-white hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddPrice}
            className="mt-4 px-3 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700"
          >
            Add +
          </button>
          {errors.price && (
            <p className="mt-2 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="poster"
            className="block text-sm font-medium text-gray-700"
          >
            Event Poster
          </label>
          <input
            type="file"
            id="poster"
            name="poster"
            className="mt-1 block w-full rounded-md border-gray-200 border shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
            accept="image/*"
          />
          {errors.poster && (
            <p className="mt-2 text-sm text-red-600">{errors.poster}</p>
          )}
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Create Event
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
CreateEventForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
};

export default CreateEventForm;
