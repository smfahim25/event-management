import { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import {
  FiDollarSign,
  FiClock,
  FiArrowDown,
  FiRefreshCw,
  FiCreditCard,
  FiLink,
  FiCheckCircle,
  FiInfo,
  FiGlobe,
  FiMail,
  FiShield,
  FiX,
} from "react-icons/fi";
import { usePayoutStore } from "../../store/PayoutStore";
import { useAuthStore } from "../../store/AuthStore";
import { useOrganizerStore } from "../../store/OrganizerStore";
import toast from "react-hot-toast";
import { FaUnlink } from "react-icons/fa";

const StripeDashboard = () => {
  const { defaultTexts } = useData();
  const [stripeData, setStripeData] = useState(null);
  const [isPayoutProcessing, setIsPayoutProcessing] = useState(false);
  const [earnings, setEarnings] = useState({});
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [isStripeConnected, setIsStripeConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [stripeAccountDetails, setStripeAccountDetails] = useState(null);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const { user } = useAuthStore();
  const { getPayouts, createPayout } = usePayoutStore();
  const {
    getOrganizerEarnings,
    getStripeConnectLink,
    getStripeStatus,
    disconnectStripe,
    loading,
  } = useOrganizerStore();
  const [call, setCall] = useState(false);

  useEffect(() => {
    getOrganizerEarnings().then((data) => {
      if (data && data.earnings) {
        setEarnings(data.earnings);
      }
    });
  }, [getOrganizerEarnings, call]);

  useEffect(() => {
    const fetchStripeData = async () => {
      try {
        const payouts = await getPayouts(user?._id);
        if (payouts?.data?.data) {
          setStripeData(payouts?.data?.data);
        } else {
          setStripeData([]);
        }
      } catch (error) {
        console.error("Error fetching Stripe data:", error);
        toast.error("Failed to fetch Stripe data.");
      }
    };

    fetchStripeData();
  }, [getPayouts, user?._id]);

  useEffect(() => {
    checkStripeConnectionStatus();
  }, []);

  const checkStripeConnectionStatus = async () => {
    try {
      const data = await getStripeStatus();

      setIsStripeConnected(data.success);

      if (data?.success && data?.status) {
        setStripeAccountDetails(data.status);
      }
    } catch (error) {
      console.error("Error checking Stripe connection:", error);
    }
  };

  const handleStripeConnect = async () => {
    setIsConnecting(true);
    try {
      const data = await getStripeConnectLink();
      console.log(data);
      if (data.success) {
        setTimeout(() => {
          window.location.href = data.url;
        }, 300);
      }
    } catch (error) {
      console.error("Error connecting to Stripe:", error);
      toast.error("Failed to connect to Stripe. Please try again.");
      setIsConnecting(false);
    }
  };

  const handleDisconnectConfirmation = () => {
    setShowDisconnectConfirm(true);
  };

  const cancelDisconnect = () => {
    setShowDisconnectConfirm(false);
  };

  const confirmDisconnect = async () => {
    setIsDisconnecting(true);
    setShowDisconnectConfirm(false);
    try {
      await disconnectStripe();
      setIsStripeConnected(false);
      setStripeAccountDetails(null);
      toast.success("Stripe account disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting from Stripe:", error);
      toast.error("Failed to disconnect from Stripe. Please try again.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const getCapabilityStatus = (status) => {
    switch (status) {
      case "active":
        return { color: "text-green-600", bg: "bg-green-100", text: "Active" };
      case "pending":
        return {
          color: "text-yellow-600",
          bg: "bg-yellow-100",
          text: "Pending",
        };
      case "inactive":
        return { color: "text-red-600", bg: "bg-red-100", text: "Inactive" };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100", text: "Unknown" };
    }
  };

  const getCountryFlag = (countryCode) => {
    const flags = {
      AL: "🇦🇱",
      AD: "🇦🇩",
      AT: "🇦🇹",
      BY: "🇧🇾",
      BE: "🇧🇪",
      BA: "🇧🇦",
      BG: "🇧🇬",
      HR: "🇭🇷",
      CY: "🇨🇾",
      CZ: "🇨🇿",
      DK: "🇩🇰",
      EE: "🇪🇪",
      FI: "🇫🇮",
      FR: "🇫🇷",
      DE: "🇩🇪",
      GR: "🇬🇷",
      HU: "🇭🇺",
      IS: "🇮🇸",
      IE: "🇮🇪",
      IT: "🇮🇹",
      LV: "🇱🇻",
      LI: "🇱🇮",
      LT: "🇱🇹",
      LU: "🇱🇺",
      MT: "🇲🇹",
      MD: "🇲🇩",
      MC: "🇲🇨",
      ME: "🇲🇪",
      NL: "🇳🇱",
      MK: "🇲🇰",
      NO: "🇳🇴",
      PL: "🇵🇱",
      PT: "🇵🇹",
      RO: "🇷🇴",
      RU: "🇷🇺",
      SM: "🇸🇲",
      RS: "🇷🇸",
      SK: "🇸🇰",
      SI: "🇸🇮",
      ES: "🇪🇸",
      SE: "🇸🇪",
      CH: "🇨🇭",
      TR: "🇹🇷",
      UA: "🇺🇦",
      GB: "🇬🇧",
      VA: "🇻🇦",
    };

    return flags[countryCode] || "🌍";
  };

  function formatDate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getStatusClass(status) {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getTypeIcon(type) {
    switch (type) {
      case "payment":
        return <FiDollarSign className="w-4 h-4" />;
      case "refund":
        return <FiArrowDown className="w-4 h-4" />;
      case "transfer":
        return <FiRefreshCw className="w-4 h-4" />;
      default:
        return <FiCreditCard className="w-4 h-4" />;
    }
  }

  const handleWithdrawAmountChange = (e) => {
    const value = e.target.value;
    setWithdrawAmount(value);

    setWithdrawError("");

    const amount = parseFloat(value);
    const availableBalance = earnings?.availableBalance || 0;

    if (value && (isNaN(amount) || amount <= 0)) {
      setWithdrawError("Please enter a valid amount");
    } else if (amount > availableBalance) {
      setWithdrawError("Amount cannot exceed available balance");
    }
  };

  const handlePayout = async () => {
    if (!isStripeConnected) {
      toast.error("Please connect your Stripe account first");
      return;
    }

    const amount = parseFloat(withdrawAmount);
    const availableBalance = earnings?.availableBalance || 0;

    if (!amount || amount <= 0) {
      setWithdrawError("Please enter a valid amount");
      return;
    }

    if (amount > availableBalance) {
      setWithdrawError("Amount cannot exceed available balance");
      return;
    }

    setIsPayoutProcessing(true);

    try {
      const payoutData = {
        amount: amount,
        currency: "USD",
        type: "manual",
      };

      const result = await createPayout(payoutData);

      if (result) {
        setEarnings((prev) => ({
          ...prev,
          availableBalance: prev.availableBalance - amount,
        }));
        setCall(true);
        setWithdrawAmount("");
      } else {
        toast.error("Failed to process payout. Please try again.");
      }
    } catch (error) {
      console.error("Payout error:", error);
      alert("An error occurred while processing the payout. Please try again.");
    } finally {
      setIsPayoutProcessing(false);
    }
  };

  const isWithdrawDisabled = () => {
    const amount = parseFloat(withdrawAmount);
    const availableBalance = earnings?.availableBalance || 0;

    return (
      !isStripeConnected ||
      isPayoutProcessing ||
      !withdrawAmount ||
      isNaN(amount) ||
      amount <= 0 ||
      amount > availableBalance ||
      availableBalance === 0
    );
  };

  if (!earnings) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          {defaultTexts.stripeDashboard?.title || "Financial Dashboard"}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-violet-500 to-purple-600 animate-pulse"></div>
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-violet-500 to-purple-600 animate-pulse"></div>
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-violet-500 to-purple-600 animate-pulse"></div>
          <div className="p-6">
            <div className="h-64 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      )}
      {/* Disconnect Confirmation Modal */}
      {showDisconnectConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Disconnect Stripe Account
              </h3>
              <button
                onClick={cancelDisconnect}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to disconnect your Stripe account? You
                won&apos;t be able to receive payments until you reconnect.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDisconnect}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDisconnect}
                disabled={isDisconnecting}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDisconnecting ? (
                  <>
                    <FiRefreshCw className="inline mr-2 h-4 w-4 animate-spin" />
                    Disconnecting...
                  </>
                ) : (
                  "Disconnect"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stripe Connection Status Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-5">
          <h3 className="text-xl font-semibold text-white">
            Stripe Connection
          </h3>
          <p className="text-blue-100 text-sm">
            Manage your Stripe account connection
          </p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {isStripeConnected ? (
                <>
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Connected
                    </p>
                    <p className="text-xs text-gray-500">
                      Your Stripe account is connected
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    <FiLink className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Not Connected
                    </p>
                    <p className="text-xs text-gray-500">
                      Connect your Stripe account to receive payouts
                    </p>
                  </div>
                </>
              )}
            </div>

            {isStripeConnected ? (
              <button
                onClick={handleDisconnectConfirmation}
                disabled={isDisconnecting}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDisconnecting ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Disconnecting...
                  </>
                ) : (
                  <>
                    <FaUnlink className="w-4 h-4 mr-2" />
                    Disconnect
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleStripeConnect}
                disabled={isConnecting}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isConnecting ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <FiLink className="w-4 h-4 mr-2" />
                    Connect Stripe
                  </>
                )}
              </button>
            )}
          </div>

          {/* Stripe Account Details - Show when connected */}
          {isStripeConnected && stripeAccountDetails && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <FiInfo className="w-4 h-4 mr-2 text-green-600" />
                Account Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Account ID */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                    <FiShield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Account ID</p>
                    <p className="text-sm font-medium text-gray-900 font-mono">
                      {stripeAccountDetails.id}
                    </p>
                  </div>
                </div>

                {/* Country */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                    <FiGlobe className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Country</p>
                    <p className="text-sm font-medium text-gray-900 flex items-center">
                      <span className="mr-2">
                        {getCountryFlag(stripeAccountDetails.country)}
                      </span>
                      {stripeAccountDetails.country}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
                    <FiMail className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {stripeAccountDetails.email}
                    </p>
                  </div>
                </div>

                {/* Account Status */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                    <FiCheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {stripeAccountDetails.charges_enabled
                          ? "Charges Enabled"
                          : "Charges Disabled"}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {stripeAccountDetails.payouts_enabled
                          ? "Payouts Enabled"
                          : "Payouts Disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Capabilities */}
              {stripeAccountDetails.capabilities && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">
                    Capabilities
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(stripeAccountDetails.capabilities).map(
                      ([capability, status]) => {
                        const statusInfo = getCapabilityStatus(status);
                        return (
                          <span
                            key={capability}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}
                          >
                            {capability.replace("_", " ").toUpperCase()}:{" "}
                            {statusInfo.text}
                          </span>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {stripeAccountDetails.requirements && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">
                    Account Requirements
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Details Submitted:</span>
                      <span
                        className={`ml-2 font-medium ${
                          stripeAccountDetails.details_submitted
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stripeAccountDetails.details_submitted ? "Yes" : "No"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Items Due:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {stripeAccountDetails.requirements.currently_due
                          ?.length || 0}{" "}
                        items
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isStripeConnected && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You need to connect your Stripe account
                to receive payouts and manage your earnings.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Balance Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-5">
            <h3 className="text-xl font-semibold text-white">
              {defaultTexts.stripeDashboard?.balance?.sectionTitle || "Balance"}
            </h3>
            <p className="text-violet-100 text-sm">Current balance overview</p>
          </div>
          <div className="grid grid-cols-2 gap-6 p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                {defaultTexts.stripeDashboard?.balance?.available ||
                  "Available"}
              </p>
              <p className="flex items-center text-3xl font-bold text-green-600">
                <FiDollarSign className="mr-1 h-6 w-6" />
                {earnings?.availableBalance?.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                {defaultTexts.stripeDashboard?.balance?.pending || "Pending"}
              </p>
              <p className="flex items-center text-3xl font-bold text-amber-600">
                <FiClock className="mr-1 h-6 w-6" />
                {earnings?.pending?.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="px-6 pb-6 pt-0">
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Gross Sales</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${earnings?.grossTotal?.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Platform Fee
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  ${earnings?.totalPlatformFee?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payouts Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-5">
            <h3 className="text-xl font-semibold text-white">
              {defaultTexts.stripeDashboard?.payouts?.sectionTitle || "Payouts"}
            </h3>
            <p className="text-violet-100 text-sm">Manage your payouts</p>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                Payout Schedule
              </p>
              <div className="flex items-center space-x-2">
                <button
                  className={`px-3 py-1 text-xs font-medium rounded-full ${"bg-purple-100 text-purple-800"}`}
                >
                  Manual
                </button>
              </div>
            </div>

            {/* Withdraw Amount Input */}
            <div className="space-y-2">
              <label
                htmlFor="withdrawAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Withdraw Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="withdrawAmount"
                  value={withdrawAmount}
                  onChange={handleWithdrawAmountChange}
                  placeholder="0.00"
                  min="0"
                  max={earnings?.availableBalance || 0}
                  step="0.01"
                  disabled={!isStripeConnected}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    withdrawError ? "border-red-300" : "border-gray-300"
                  }`}
                />
              </div>
              {withdrawError && (
                <p className="text-sm text-red-600">{withdrawError}</p>
              )}
              <p className="text-xs text-gray-500">
                Available balance: $
                {earnings?.availableBalance?.toFixed(2) || "0.00"}
              </p>
            </div>

            <button
              onClick={handlePayout}
              disabled={isWithdrawDisabled()}
              className={`mt-2 flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
                isWithdrawDisabled()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              }`}
            >
              {isPayoutProcessing ? (
                <>
                  <FiRefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FiArrowDown className="mr-2 h-4 w-4" />
                  {!isStripeConnected
                    ? "Connect Stripe to Withdraw"
                    : "Withdraw"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-5">
          <h3 className="text-xl font-semibold text-white">
            {defaultTexts?.stripeDashboard?.transactions?.sectionTitle ||
              "Transactions"}
          </h3>
          <p className="text-violet-100 text-sm">Recent transaction history</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {defaultTexts?.stripeDashboard?.transactions?.table?.headers
                    ?.id || "ID"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {defaultTexts?.stripeDashboard?.transactions?.table?.headers
                    ?.amount || "Amount"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {defaultTexts?.stripeDashboard?.transactions?.table?.headers
                    ?.date || "Date"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {defaultTexts?.stripeDashboard?.transactions?.table?.headers
                    ?.status || "Status"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {defaultTexts?.stripeDashboard?.transactions?.table?.headers
                    ?.type || "Type"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {stripeData?.length > 0 &&
                stripeData?.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {transaction._id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      ${transaction?.amount?.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(transaction?.updatedAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(
                          transaction?.status
                        )}`}
                      >
                        {transaction?.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        {getTypeIcon(transaction?.type)}
                        <span className="ml-2">{transaction?.type}</span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StripeDashboard;
