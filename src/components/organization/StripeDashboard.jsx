import { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import {
  FiDollarSign,
  FiClock,
  FiArrowDown,
  FiRefreshCw,
  FiCreditCard,
} from "react-icons/fi";
import { usePayoutStore } from "../../store/PayoutStore";
import { useAuthStore } from "../../store/AuthStore";
import { useOrganizerStore } from "../../store/OrganizerStore";
import toast from "react-hot-toast";

const StripeDashboard = () => {
  const { defaultTexts } = useData();
  const [stripeData, setStripeData] = useState(null);
  const [isPayoutProcessing, setIsPayoutProcessing] = useState(false);
  const [earnings, setEarnings] = useState({});
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const { user } = useAuthStore();
  const { getPayouts, createPayout } = usePayoutStore();
  const { getOrganizerEarnings } = useOrganizerStore();

  useEffect(() => {
    getOrganizerEarnings().then((data) => {
      if (data && data.earnings) {
        setEarnings(data.earnings);
      }
    });
  }, [getOrganizerEarnings]);

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
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
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
                  Withdraw
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
