import { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import {
  FiDollarSign,
  FiClock,
  FiArrowDown,
  FiRefreshCw,
  FiCreditCard,
} from "react-icons/fi";

const StripeDashboard = () => {
  const { defaultTexts } = useData();
  const [stripeData, setStripeData] = useState(null);
  const [isPayoutProcessing /* setIsPayoutProcessing*/] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setStripeData({
        balance: {
          available: 1200.45,
          pending: 350.0,
        },
        transactions: [
          {
            id: "txn_1",
            amount: 500.0,
            created: 1715116800,
            status: "succeeded",
            type: "payment",
          },
          {
            id: "txn_2",
            amount: 250.0,
            created: 1715030400,
            status: "pending",
            type: "refund",
          },
          {
            id: "txn_3",
            amount: 450.45,
            created: 1714944000,
            status: "succeeded",
            type: "transfer",
          },
        ],
      });
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

  if (!stripeData) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          {defaultTexts.stripeDashboard.title}
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
      <h2 className="text-3xl font-bold tracking-tight">
        {defaultTexts.stripeDashboard.title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-5">
            <h3 className="text-xl font-semibold text-white">
              {defaultTexts.stripeDashboard.balance.sectionTitle}
            </h3>
            <p className="text-violet-100 text-sm">Current balance overview</p>
          </div>
          <div className="grid grid-cols-2 gap-6 p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                {defaultTexts.stripeDashboard.balance.available}
              </p>
              <p className="flex items-center text-3xl font-bold text-green-600">
                <FiDollarSign className="mr-1 h-6 w-6" />
                {stripeData.balance.available.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                {defaultTexts.stripeDashboard.balance.pending}
              </p>
              <p className="flex items-center text-3xl font-bold text-amber-600">
                <FiClock className="mr-1 h-6 w-6" />
                {stripeData.balance.pending.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-5">
            <h3 className="text-xl font-semibold text-white">
              {defaultTexts.stripeDashboard.payouts.sectionTitle}
            </h3>
            <p className="text-violet-100 text-sm">Manage your payouts</p>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <p className="text-sm text-gray-600">
              {defaultTexts.stripeDashboard.payouts.noPayouts}
            </p>
            <button
              // onClick={handlePayout}
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
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-5">
          <h3 className="text-xl font-semibold text-white">
            {defaultTexts.stripeDashboard.transactions.sectionTitle}
          </h3>
          <p className="text-violet-100 text-sm">Recent transaction history</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {defaultTexts.stripeDashboard.transactions.table.headers.id}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {
                    defaultTexts.stripeDashboard.transactions.table.headers
                      .amount
                  }
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {defaultTexts.stripeDashboard.transactions.table.headers.date}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {
                    defaultTexts.stripeDashboard.transactions.table.headers
                      .status
                  }
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {defaultTexts.stripeDashboard.transactions.table.headers.type}
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
    </div>
  );
};

export default StripeDashboard;
