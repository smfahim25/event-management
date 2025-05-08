import { useState, useEffect } from "react";
import { useData } from "../context/DataContext";

const StripeDashboard = () => {
  const { defaultTexts } = useData();
  const [stripeData, setStripeData] = useState(null);
  const [isPayoutProcessing /* setIsPayoutProcessing*/] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Simulate API delay
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

      setMessage("Stripe data loaded successfully.");
    }, 1000);
  }, []);

  function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="flex flex-col">
      {stripeData ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">
            {defaultTexts.stripeDashboard.title}
          </h2>

          <div className="flex md:flex-row flex-col">
            <div className="py-6 px-10 m-5 border rounded-2xl border-black/10 w-fit">
              <h3 className="text-3xl font-semibold tracking-tighter mb-5">
                {defaultTexts.stripeDashboard.balance.sectionTitle}
              </h3>
              <div className="flex md:gap-40 gap-28">
                <div>
                  <h3 className="text-lg">
                    {defaultTexts.stripeDashboard.balance.available}
                  </h3>
                  <h3 className="text-2xl font-semibold">
                    ${stripeData.balance.available}
                  </h3>
                </div>

                <div>
                  <h3 className="text-lg">
                    {defaultTexts.stripeDashboard.balance.pending}
                  </h3>
                  <h3 className="text-2xl font-semibold">
                    ${stripeData.balance.pending}
                  </h3>
                </div>
              </div>
            </div>

            <div className="py-6 px-10 m-5 border rounded-2xl border-black/10 flex-1">
              <h3 className="text-3xl font-semibold tracking-tighter mb-5">
                {defaultTexts.stripeDashboard.payouts.sectionTitle}
              </h3>
              <div className="flex flex-col gap-4">
                <h3 className="text-lg">
                  {defaultTexts.stripeDashboard.payouts.noPayouts}
                </h3>

                <button
                  // onClick={handlePayout}
                  disabled={
                    isPayoutProcessing || stripeData.balance.available === 0
                  }
                  className={`py-2 px-4 rounded-md text-white font-semibold ${
                    isPayoutProcessing
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isPayoutProcessing ? "Processing..." : "Withdraw"}
                </button>
              </div>
            </div>
          </div>

          <div className="py-6 px-10 m-5 border rounded-2xl border-black/10 overflow-auto">
            <h3 className="text-3xl font-semibold tracking-tighter mb-5">
              {defaultTexts.stripeDashboard.transactions.sectionTitle}
            </h3>
            <div>
              <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-16 py-3 text-left text-sm font-medium">
                      {
                        defaultTexts.stripeDashboard.transactions.table.headers
                          .id
                      }
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      {
                        defaultTexts.stripeDashboard.transactions.table.headers
                          .amount
                      }
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      {
                        defaultTexts.stripeDashboard.transactions.table.headers
                          .date
                      }
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      {
                        defaultTexts.stripeDashboard.transactions.table.headers
                          .status
                      }
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      {
                        defaultTexts.stripeDashboard.transactions.table.headers
                          .type
                      }
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stripeData.transactions.length > 0 &&
                    stripeData.transactions.map((e) => (
                      <tr key={e.id} className="border-b">
                        <td className="px-16 py-4 text-sm text-gray-700">
                          {e.id}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          ${e.amount}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {formatDate(e.created)}
                        </td>
                        <td className="px-4 py-4 text-sm text-green-600">
                          {e.status}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {e.type}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-600">{message || "Loading Stripe data..."}</p>
      )}
    </div>
  );
};

export default StripeDashboard;
