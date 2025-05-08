import { useState } from "react";
import {
  FaTicketAlt,
  FaUser,
  FaEnvelope,
  FaMinus,
  FaPlus,
  FaLock,
} from "react-icons/fa";

const RegisterForm = ({ details, ticketQuantity, setTicketQuantity }) => {
  // Mock user data
  const mockUser = {
    fullName: "John Smith",
    emailAddresses: [{ emailAddress: "john.smith@example.com" }],
  };

  const [formData, setFormData] = useState({
    username: mockUser?.fullName || "",
    email: mockUser?.emailAddresses[0]?.emailAddress || "",
    contactNumber: "",
    verificationCode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedPrice, setSelectedPrice] = useState(
    Array.isArray(details.price) && details.price.length > 0
      ? details.price[0].value
      : details.price || 0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setTicketQuantity(newQuantity);
    }
  };

  const handlePriceSelection = (value) => {
    setSelectedPrice(value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock form submission with timeout
    setTimeout(() => {
      console.log("Form submitted with:", {
        ...formData,
        eventId: details.id || "event-id",
        price: selectedPrice,
        quantity: ticketQuantity,
        totalPrice: selectedPrice * ticketQuantity,
      });

      alert(
        `Ticket request submitted for ${details.name}. Total: $${
          selectedPrice * ticketQuantity
        }`
      );
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto *:bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-6 px-8 rounded-t-xl shadow-md">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FaTicketAlt className="mr-3" />
          Get Tickets
        </h2>
        <p className="text-purple-100 mt-1">Secure your spot at this event</p>
      </div>

      <form onSubmit={handleFormSubmit} className="p-8">
        {/* Ticket Type Selection */}
        {Array.isArray(details.price) && details.price.length > 0 && (
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">
              Select Ticket Type
            </label>
            <div className="flex flex-col lg:flex-row lg:items-center gap-5">
              {details.price.map((p, index) => (
                <div
                  key={index}
                  onClick={() => handlePriceSelection(p.value)}
                  className={`lg:w-1/4 flex justify-between items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedPrice === p.value
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {p.label || "Standard Ticket"}
                    </p>
                    {p.description && (
                      <p className="text-sm text-gray-500">{p.description}</p>
                    )}
                  </div>
                  <p className="text-xl font-bold text-purple-600">
                    ${p.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ticket Quantity */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-3">
            Number of Tickets
          </label>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleQuantityChange(ticketQuantity - 1)}
              disabled={ticketQuantity <= 1}
              className={`p-3 rounded-l-lg border border-gray-300 ${
                ticketQuantity <= 1
                  ? "bg-gray-100 text-gray-400"
                  : "bg-gray-100 text-gray-700 hover:bg-purple-600 hover:text-white"
              }`}
            >
              <FaMinus />
            </button>
            <div className="w-16 h-12 flex items-center justify-center border-t border-b border-gray-300 bg-white">
              <span className="text-lg font-medium">{ticketQuantity}</span>
            </div>
            <button
              type="button"
              onClick={() => handleQuantityChange(ticketQuantity + 1)}
              className="p-3 rounded-r-lg border border-gray-300 bg-gray-100 text-gray-700 hover:bg-purple-600 hover:text-white"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-3">
            Contact Information
          </label>
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="relative lg:w-1/4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <FaUser />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="relative lg:w-1/4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <FaEnvelope />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-800 mb-3">Order Summary</h3>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">
              {Array.isArray(details.price)
                ? details.price.find((p) => p.value === selectedPrice)?.label ||
                  "Ticket"
                : "Ticket"}{" "}
              × {ticketQuantity}
            </span>
            <span className="font-medium">
              ${selectedPrice * ticketQuantity}
            </span>
          </div>
          <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
            <span className="font-medium">Total</span>
            <span className="text-xl font-bold text-purple-600">
              ${selectedPrice * ticketQuantity}
            </span>
          </div>
        </div>

        {/* Secure Checkout Notice */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <FaLock className="mr-2" />
          <span>Secure checkout. Your information is protected.</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-colors duration-200 ${
            isSubmitting
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Processing...
            </span>
          ) : (
            "Request Tickets"
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
