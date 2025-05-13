import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FaTicketAlt,
  FaUser,
  FaEnvelope,
  FaMinus,
  FaPlus,
  FaLock,
  FaInfoCircle,
  FaShoppingCart,
  FaTrash,
} from "react-icons/fa";

const RegisterForm = ({ details, selectedTicketType }) => {
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
  const [ticketCounts, setTicketCounts] = useState({});
  const [showFeeInfo, setShowFeeInfo] = useState(null);

  // Initialize ticket counts
  useEffect(() => {
    if (Array.isArray(details.price)) {
      const initialCounts = {};
      details.price.forEach((ticket) => {
        initialCounts[ticket.label] = 0;
      });
      setTicketCounts(initialCounts);
    }
  }, [details.price]);

  // If a ticket type was pre-selected, update its count
  useEffect(() => {
    if (selectedTicketType && ticketCounts[selectedTicketType.label] === 0) {
      handleTicketCountChange(selectedTicketType.label, 1);
    }
  }, [selectedTicketType, ticketCounts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTicketCountChange = (ticketLabel, change) => {
    setTicketCounts((prev) => {
      const newCount = Math.max(0, (prev[ticketLabel] || 0) + change);
      return { ...prev, [ticketLabel]: newCount };
    });
  };

  // Calculate service fee (example: 8% of ticket price)
  const calculateFee = (price) => {
    return Math.round(price * 0.08 * 100) / 100;
  };

  // Calculate total price
  const calculateTotal = () => {
    if (!Array.isArray(details.price)) return 0;

    return details.price.reduce((total, ticket) => {
      const count = ticketCounts[ticket.label] || 0;
      const ticketTotal = ticket.value * count;
      const feeTotal = calculateFee(ticket.value) * count;
      return total + ticketTotal + feeTotal;
    }, 0);
  };

  // Calculate subtotal (without fees)
  const calculateSubtotal = () => {
    if (!Array.isArray(details.price)) return 0;

    return details.price.reduce((total, ticket) => {
      const count = ticketCounts[ticket.label] || 0;
      return total + ticket.value * count;
    }, 0);
  };

  // Calculate total number of tickets
  const calculateTotalTickets = () => {
    return Object.values(ticketCounts).reduce((sum, count) => sum + count, 0);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Check if at least one ticket is selected
    if (calculateTotalTickets() === 0) {
      alert("Please select at least one ticket");
      return;
    }

    setIsSubmitting(true);

    // Mock form submission with timeout
    setTimeout(() => {
      console.log("Form submitted with:", {
        ...formData,
        eventId: details.id || "event-id",
        tickets: ticketCounts,
        totalPrice: calculateTotal(),
      });

      alert(
        `Ticket request submitted for ${
          details.name
        }. Total: $${calculateTotal().toFixed(2)}`
      );
      setIsSubmitting(false);
    }, 1500);
  };

  const toggleFeeInfo = (ticketLabel) => {
    setShowFeeInfo(showFeeInfo === ticketLabel ? null : ticketLabel);
  };

  // Get selected tickets
  const getSelectedTickets = () => {
    return Object.entries(ticketCounts)
      .filter(([, count]) => count > 0)
      .map(([label, count]) => {
        const ticket = details.price.find((t) => t.label === label);
        return { ...ticket, count };
      });
  };

  return (
    <div className="container mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-6 px-8 rounded-t-xl shadow-md">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FaTicketAlt className="mr-3" />
          Get Tickets
        </h2>
        <p className="text-purple-100 mt-1">Secure your spot at this event</p>
      </div>

      <form onSubmit={handleFormSubmit} className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Ticket Selection and User Info */}
          <div className="w-full lg:w-7/12">
            {/* Ticket Selection */}
            {Array.isArray(details.price) && details.price.length > 0 && (
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">
                  Select Tickets
                </label>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {details.price.map((ticket, index) => {
                    const fee = calculateFee(ticket.value);
                    return (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {ticket.label}
                            </h3>
                            <div className="flex items-center mt-1">
                              <span className="text-xl font-bold text-gray-900">
                                ${ticket.value.toFixed(2)}
                              </span>
                              <span className="text-gray-500 ml-2 text-sm">
                                Plus ${fee.toFixed(2)} fee
                                <button
                                  type="button"
                                  onClick={() => toggleFeeInfo(ticket.label)}
                                  className="ml-1 text-purple-600 hover:text-purple-800"
                                >
                                  <FaInfoCircle />
                                </button>
                              </span>
                            </div>
                            {showFeeInfo === ticket.label && (
                              <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                                Service fee helps us cover payment processing
                                and platform maintenance costs.
                              </div>
                            )}
                            {ticket.quantity && (
                              <div className="mt-1 text-sm text-gray-500">
                                {ticket.quantity - (ticket.sold || 0)} tickets
                                remaining
                              </div>
                            )}
                          </div>

                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() =>
                                handleTicketCountChange(ticket.label, -1)
                              }
                              disabled={ticketCounts[ticket.label] <= 0}
                              className={`h-10 w-10 flex items-center justify-center rounded-l-lg border ${
                                ticketCounts[ticket.label] <= 0
                                  ? "bg-gray-100 text-gray-400 border-gray-200"
                                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-purple-600 hover:text-white"
                              }`}
                            >
                              <FaMinus />
                            </button>
                            <div className="h-10 w-10 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                              <span className="text-lg font-medium">
                                {ticketCounts[ticket.label] || 0}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleTicketCountChange(ticket.label, 1)
                              }
                              className="h-10 w-10 flex items-center justify-center rounded-r-lg border border-gray-300 bg-gray-100 text-gray-700 hover:bg-purple-600 hover:text-white"
                            >
                              <FaPlus />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">
                Contact Information
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
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

                <div className="relative">
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
          </div>

          {/* Right Column - Cart/Order Summary */}
          <div className="w-full lg:w-5/12 md:mt-10">
            <div className="bg-gray-50 rounded-lg p-5 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800 text-lg flex items-center">
                  <FaShoppingCart className="mr-2" /> Your Tickets
                </h3>
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {calculateTotalTickets()} items
                </span>
              </div>

              {calculateTotalTickets() === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaShoppingCart className="mx-auto text-4xl mb-3 opacity-30" />
                  <p>Your ticket is empty</p>
                  <p className="text-sm mt-1">Select tickets to get started</p>
                </div>
              ) : (
                <>
                  {/* Selected Tickets */}
                  <div className="space-y-3 max-h-[250px] overflow-y-auto mb-4">
                    {getSelectedTickets().map((ticket) => (
                      <div
                        key={ticket.label}
                        className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                      >
                        <div className="flex-grow">
                          <h4 className="font-medium text-gray-800">
                            {ticket.label}
                          </h4>
                          <div className="flex items-center text-sm text-gray-600">
                            <span>
                              ${ticket.value.toFixed(2)} + $
                              {calculateFee(ticket.value).toFixed(2)} fee
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleTicketCountChange(ticket.label, -1)
                            }
                            className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-gray-700 hover:bg-purple-600 hover:text-white"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="w-6 text-center font-medium">
                            {ticket.count}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleTicketCountChange(ticket.label, 1)
                            }
                            className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-gray-700 hover:bg-purple-600 hover:text-white"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleTicketCountChange(
                                ticket.label,
                                -ticket.count
                              )
                            }
                            className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-red-500 hover:bg-red-500 hover:text-white ml-1"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        ${calculateSubtotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mb-3">
                      <span>Service fees</span>
                      <span>
                        ${(calculateTotal() - calculateSubtotal()).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-purple-600">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Secure Checkout Notice */}
                  <div className="flex items-center text-sm text-gray-500 mt-4 mb-4">
                    <FaLock className="mr-2" />
                    <span>Secure checkout. Your information is protected.</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || calculateTotalTickets() === 0}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white text-lg transition-colors duration-200 ${
                      isSubmitting || calculateTotalTickets() === 0
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
                      `Checkout • $${calculateTotal().toFixed(2)}`
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

// Add prop validation
RegisterForm.propTypes = {
  details: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        quantity: PropTypes.number,
        sold: PropTypes.number,
      })
    ).isRequired,
  }).isRequired,
  selectedTicketType: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  }),
};

RegisterForm.defaultProps = {
  selectedTicketType: null,
};

export default RegisterForm;
