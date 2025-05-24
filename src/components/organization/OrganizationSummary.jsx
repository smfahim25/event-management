const DollarSign = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
    />
  </svg>
);

const TrendingUp = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const Calendar = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const PieChart = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
    />
  </svg>
);

const EarningsSummary = ({ data }) => {
  const sampleData = {
    grossRevenue: 15000,
    netEarnings: 13500,
    totalTicketsSold: 150,
    ticketTypeSales: {
      "General Admission": 80,
      VIP: 30,
      "Early Bird": 40,
    },
  };

  const currentData = data || sampleData;

  const ticketTypes = currentData?.ticketTypeSales
    ? Object.entries(currentData.ticketTypeSales).map(([name, count]) => ({
        name,
        count,
        revenue:
          (currentData.grossRevenue / currentData.totalTicketsSold) * count,
      }))
    : [];

  const PieChartComponent = ({ ticketTypes }) => {
    if (!ticketTypes || ticketTypes.length === 0) {
      return (
        <div className="flex items-center justify-center h-48 text-gray-500">
          No ticket data available
        </div>
      );
    }

    const totalRevenue = ticketTypes.reduce((sum, t) => sum + t.revenue, 0);
    const colors = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];

    if (ticketTypes.length === 1) {
      return (
        <div className="relative h-48 sm:h-64 flex items-center justify-center">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="max-w-full max-h-full"
          >
            <circle
              cx="100"
              cy="100"
              r="80"
              fill={colors[0]}
              stroke="white"
              strokeWidth="2"
            />

            <circle
              cx="100"
              cy="100"
              r="40"
              fill="white"
              stroke="#e5e7eb"
              strokeWidth="1"
            />

            <text
              x="100"
              y="95"
              textAnchor="middle"
              className="text-xs font-medium fill-gray-600"
            >
              Total
            </text>
            <text
              x="100"
              y="110"
              textAnchor="middle"
              className="text-sm font-bold fill-gray-900"
            >
              ${totalRevenue.toFixed(0)}
            </text>
          </svg>
        </div>
      );
    }

    let cumulativeAngle = 0;

    return (
      <div className="relative h-48 sm:h-64 flex items-center justify-center">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="max-w-full max-h-full"
        >
          {ticketTypes.map((ticket, index) => {
            const percentage = (ticket.revenue / totalRevenue) * 100;
            const angle = (ticket.revenue / totalRevenue) * 360;

            if (percentage < 0.5) return null;

            const startAngle = cumulativeAngle;
            const endAngle = cumulativeAngle + angle;

            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);

            const radius = 80;
            const centerX = 100;
            const centerY = 100;

            const x1 = centerX + radius * Math.cos(startRad);
            const y1 = centerY + radius * Math.sin(startRad);
            const x2 = centerX + radius * Math.cos(endRad);
            const y2 = centerY + radius * Math.sin(endRad);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              "Z",
            ].join(" ");

            cumulativeAngle += angle;

            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}

          <circle
            cx="100"
            cy="100"
            r="40"
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          <text
            x="100"
            y="95"
            textAnchor="middle"
            className="text-xs font-medium fill-gray-600"
          >
            Total
          </text>
          <text
            x="100"
            y="110"
            textAnchor="middle"
            className="text-sm font-bold fill-gray-900"
          >
            ${totalRevenue.toFixed(0)}
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-green-100 mr-3 sm:mr-4">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Gross Earnings
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                ${currentData?.grossRevenue?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-gray-500">Platform Fee (10%)</span>
              <span className="font-medium text-gray-700">
                -${((currentData?.grossRevenue || 0) * 0.1).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-purple-100 mr-3 sm:mr-4">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Net Earnings
              </p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">
                ${currentData?.netEarnings?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-gray-500">After platform fees</span>
              <span className="font-medium text-gray-700">
                {(
                  ((currentData?.netEarnings || 0) /
                    (currentData?.grossRevenue || 1)) *
                  100
                ).toFixed(0)}
                % of gross
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-blue-100 mr-3 sm:mr-4">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Tickets Sold
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {currentData?.totalTicketsSold || 0}
              </p>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-gray-500">Avg. Ticket Price</span>
              <span className="font-medium text-gray-700">
                $
                {(
                  (currentData?.grossRevenue || 0) /
                  (currentData?.totalTicketsSold || 1)
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white md:max-w-3xl mx-auto rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
        <h4 className="text-sm sm:text-md font-medium text-gray-700 mb-4">
          Earnings by Ticket Type
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PieChartComponent ticketTypes={ticketTypes} />

          {/* Legend and Stats */}
          <div className="space-y-3 sm:space-y-4">
            {ticketTypes.length > 0 ? (
              ticketTypes.map((ticket, index) => {
                const totalRevenue = ticketTypes.reduce(
                  (sum, t) => sum + t.revenue,
                  0
                );
                const percentage = (
                  (ticket.revenue / totalRevenue) *
                  100
                ).toFixed(1);
                const colors = [
                  "#8b5cf6",
                  "#ec4899",
                  "#3b82f6",
                  "#10b981",
                  "#f59e0b",
                ];

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="h-3 w-3 rounded-sm mr-3 flex-shrink-0"
                        style={{
                          backgroundColor: colors[index % colors.length],
                        }}
                      />
                      <span className="text-xs sm:text-sm text-gray-700">
                        {ticket.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        ${ticket.revenue.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ticket.count} tickets ({percentage}%)
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 text-sm">
                No ticket sales data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Platform Fee Explanation */}
      <div className="bg-purple-50 rounded-xl p-4 sm:p-6 border border-purple-100">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <PieChart className="h-5 w-5 text-purple-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-purple-800">
              Platform Fee Explanation
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-purple-700">
              A 10% platform fee is deducted from all ticket sales. This fee
              covers payment processing, platform maintenance, and customer
              support. Your net earnings are automatically transferred to your
              connected bank account according to your payout schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsSummary;
