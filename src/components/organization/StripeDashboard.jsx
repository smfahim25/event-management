import { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import {
  FiDollarSign,
  FiClock,
  FiArrowDown,
  FiRefreshCw,
  FiCreditCard,
  FiSettings,
  FiPercent,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";

const StripeDashboard = () => {
  const { defaultTexts } = useData();
  const [stripeData, setStripeData] = useState(null);
  const [isPayoutProcessing, setIsPayoutProcessing] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundPolicies, setRefundPolicies] = useState([]);
  const [newPolicy, setNewPolicy] = useState({
    days: 7,
    percentage: 50,
    description: "",
  });

  // Platform commission rate
  const platformCommissionRate = 0.1; // 10%

  useEffect(() => {
    // Simulate API call to fetch Stripe data
    setTimeout(() => {
      setStripeData({
        balance: {
          available: 1200.45,
          pending: 350.0,
          gross: 1500.56, // Gross amount before platform fees
        },
        transactions: [
          {
            id: "txn_1",
            amount: 500.0,
            grossAmount: 555.56, // Amount before platform fee
            platformFee: 55.56, // 10% platform fee
            created: 1715116800,
            status: "succeeded",
            type: "payment",
          },
          {
            id: "txn_2",
            amount: 250.0,
            grossAmount: 277.78,
            platformFee: 27.78,
            created: 1715030400,
            status: "pending",
            type: "refund",
          },
          {
            id: "txn_3",
            amount: 450.45,
            grossAmount: 500.5,
            platformFee: 50.05,
            created: 1714944000,
            status: "succeeded",
            type: "transfer",
          },
        ],
        payoutSchedule: "automatic", // or "manual"
        nextPayoutDate: 1715203200, // Unix timestamp
      });

      // Fetch refund policies
      setRefundPolicies([
        {
          id: "policy_1",
          days: 7,
          percentage: 50,
          description: "50% refund if canceled 7 days before the event",
          isDefault: true,
        },
        {
          id: "policy_2",
          days: 14,
          percentage: 75,
          description: "75% refund if canceled 14 days before the event",
          isDefault: false,
        },
        {
          id: "policy_3",
          days: 30,
          percentage: 100,
          description: "100% refund if canceled 30 days before the event",
          isDefault: false,
        },
      ]);
    }, 1000);
  }, []);

  function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getStatusClass(status) {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
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

  const handlePayout = () => {
    setIsPayoutProcessing(true);
    // Simulate payout process
    setTimeout(() => {
      setStripeData((prev) => ({
        ...prev,
        balance: {
          ...prev.balance,
          available: 0,
        },
        transactions: [
          {
            id: `txn_${Date.now()}`,
            amount: prev.balance.available,
            grossAmount: prev.balance.available,
            platformFee: 0,
            created: Math.floor(Date.now() / 1000),
            status: "succeeded",
            type: "payout",
          },
          ...prev.transactions,
        ],
      }));
      setIsPayoutProcessing(false);
      alert(
        "Payout initiated successfully! Funds will be transferred to your bank account."
      );
    }, 2000);
  };

  const handleConnectStripe = () => {
    // Simulate connecting to Stripe
    setIsConnected(true);
    setShowConnectModal(false);
    alert("Your account has been successfully connected to Stripe!");
  };

  const handleAddRefundPolicy = () => {
    if (!newPolicy.description) {
      setNewPolicy({
        ...newPolicy,
        description: `${newPolicy.percentage}% refund if canceled ${newPolicy.days} days before the event`,
      });
    }

    const policy = {
      id: `policy_${Date.now()}`,
      days: newPolicy.days,
      percentage: newPolicy.percentage,
      description:
        newPolicy.description ||
        `${newPolicy.percentage}% refund if canceled ${newPolicy.days} days before the event`,
      isDefault: refundPolicies.length === 0,
    };

    setRefundPolicies([...refundPolicies, policy]);
    setNewPolicy({
      days: 7,
      percentage: 50,
      description: "",
    });
  };

  const handleSetDefaultPolicy = (policyId) => {
    setRefundPolicies(
      refundPolicies.map((policy) => ({
        ...policy,
        isDefault: policy.id === policyId,
      }))
    );
  };

  const handleDeletePolicy = (policyId) => {
    setRefundPolicies(
      refundPolicies.filter((policy) => policy.id !== policyId)
    );
  };

  const handlePayoutScheduleChange = (schedule) => {
    setStripeData({
      ...stripeData,
      payoutSchedule: schedule,
    });
  };

  if (!stripeData) {
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
      {/* Stripe Connect Status */}
      {!isConnected && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your account is not connected to Stripe. Connect your account to
                receive payments.
              </p>
              <div className="mt-2">
                <button
                  onClick={() => setShowConnectModal(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Connect with Stripe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                {stripeData.balance.available.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                {defaultTexts.stripeDashboard?.balance?.pending || "Pending"}
              </p>
              <p className="flex items-center text-3xl font-bold text-amber-600">
                <FiClock className="mr-1 h-6 w-6" />
                {stripeData.balance.pending.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="px-6 pb-6 pt-0">
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Gross Sales</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${stripeData.balance.gross.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Platform Fee (10%)
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  $
                  {(stripeData.balance.gross * platformCommissionRate).toFixed(
                    2
                  )}
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
                  onClick={() => handlePayoutScheduleChange("automatic")}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    stripeData.payoutSchedule === "automatic"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Automatic
                </button>
                <button
                  onClick={() => handlePayoutScheduleChange("manual")}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    stripeData.payoutSchedule === "manual"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Manual
                </button>
              </div>
            </div>

            {stripeData.payoutSchedule === "automatic" ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <FiCalendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Next automatic payout
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(stripeData.nextPayoutDate)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handlePayout}
                disabled={
                  isPayoutProcessing || stripeData.balance.available === 0
                }
                className={`mt-2 flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
                  isPayoutProcessing || stripeData.balance.available === 0
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
                    Withdraw ${stripeData.balance.available.toFixed(2)}
                  </>
                )}
              </button>
            )}

            <div className="mt-2 border-t border-gray-200 pt-4">
              <button
                onClick={() => setShowRefundModal(true)}
                className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-800"
              >
                <FiSettings className="mr-2 h-4 w-4" />
                Configure Refund Policies
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-5">
          <h3 className="text-xl font-semibold text-white">
            {defaultTexts.stripeDashboard?.transactions?.sectionTitle ||
              "Transactions"}
          </h3>
          <p className="text-violet-100 text-sm">Recent transaction history</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {defaultTexts.stripeDashboard?.transactions?.table?.headers
                    ?.id || "ID"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {defaultTexts.stripeDashboard?.transactions?.table?.headers
                    ?.amount || "Amount"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Gross Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Platform Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {defaultTexts.stripeDashboard?.transactions?.table?.headers
                    ?.date || "Date"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {defaultTexts.stripeDashboard?.transactions?.table?.headers
                    ?.status || "Status"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {defaultTexts.stripeDashboard?.transactions?.table?.headers
                    ?.type || "Type"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {stripeData.transactions.length > 0 &&
                stripeData.transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      ${transaction.grossAmount.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      ${transaction.platformFee.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(transaction.created)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        {getTypeIcon(transaction.type)}
                        <span className="ml-2">{transaction.type}</span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stripe Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Connect with Stripe
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Connect your account with Stripe to receive payments directly to
              your bank account. This is a secure process handled by Stripe.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiCheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    Secure payment processing
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiCheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    Automatic payouts to your bank account
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiCheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    Detailed financial reporting
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowConnectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConnectStripe}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-md text-sm font-medium"
              >
                Connect with Stripe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Policy Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Configure Refund Policies
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Set up refund policies for your events. These policies will be
              applied automatically when attendees request refunds.
            </p>

            {/* Current Policies */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">
                Current Policies
              </h4>
              {refundPolicies.length > 0 ? (
                <div className="space-y-3">
                  {refundPolicies.map((policy) => (
                    <div
                      key={policy.id}
                      className={`border rounded-lg p-4 ${
                        policy.isDefault
                          ? "border-purple-300 bg-purple-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {policy.description}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 flex items-center">
                              <FiCalendar className="mr-1 h-3 w-3" />
                              {policy.days} days before event
                            </span>
                            <span className="mx-2 text-gray-300">|</span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <FiPercent className="mr-1 h-3 w-3" />
                              {policy.percentage}% refund
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!policy.isDefault && (
                            <button
                              onClick={() => handleSetDefaultPolicy(policy.id)}
                              className="text-xs text-purple-600 hover:text-purple-800"
                            >
                              Set as Default
                            </button>
                          )}
                          {policy.isDefault && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                          <button
                            onClick={() => handleDeletePolicy(policy.id)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-sm text-gray-500">
                    No refund policies configured yet.
                  </p>
                </div>
              )}
            </div>

            {/* Add New Policy */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">
                Add New Policy
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="days"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Days Before Event
                  </label>
                  <input
                    type="number"
                    id="days"
                    min="0"
                    value={newPolicy.days}
                    onChange={(e) =>
                      setNewPolicy({
                        ...newPolicy,
                        days: Number.parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="percentage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Refund Percentage
                  </label>
                  <input
                    type="number"
                    id="percentage"
                    min="0"
                    max="100"
                    value={newPolicy.percentage}
                    onChange={(e) =>
                      setNewPolicy({
                        ...newPolicy,
                        percentage: Number.parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description (Optional)
                </label>
                <input
                  type="text"
                  id="description"
                  value={newPolicy.description}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, description: e.target.value })
                  }
                  placeholder={`${newPolicy.percentage}% refund if canceled ${newPolicy.days} days before the event`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <FiInfo className="mr-2 h-4 w-4" />
                <p>
                  This policy will automatically apply to refund requests based
                  on how many days before the event the request is made.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowRefundModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRefundPolicy}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-md text-sm font-medium"
              >
                Add Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StripeDashboard;
