import { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiPieChart,
} from "react-icons/fi";

const EarningsSummary = ({ eventId }) => {
  const [earningsData, setEarningsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    setTimeout(() => {
      const mockData = {
        totalGross: 5250.0,
        platformFee: 525.0,
        netEarnings: 4725.0,
        ticketsSold: 105,
        averageTicketPrice: 50.0,
        ticketTypes: [
          { name: "General Admission", count: 75, revenue: 3000.0 },
          { name: "VIP", count: 20, revenue: 1600.0 },
          { name: "Early Bird", count: 10, revenue: 650.0 },
        ],
        dailyEarnings: [
          { date: "2025-05-01", gross: 1200, net: 1080 },
          { date: "2025-05-02", gross: 800, net: 720 },
          { date: "2025-05-03", gross: 1500, net: 1350 },
          { date: "2025-05-04", gross: 950, net: 855 },
          { date: "2025-05-05", gross: 800, net: 720 },
        ],
      };
      setEarningsData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [eventId, timeRange]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-full sm:w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h3 className="text-lg font-medium text-gray-900">Earnings Summary</h3>
        <div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Gross Earnings */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-green-100 mr-3 sm:mr-4">
              <FiDollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Gross Earnings
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                ${earningsData.totalGross.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-gray-500">Platform Fee (10%)</span>
              <span className="font-medium text-gray-700">
                -${earningsData.platformFee.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Net Earnings */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-purple-100 mr-3 sm:mr-4">
              <FiTrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Net Earnings
              </p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">
                ${earningsData.netEarnings.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-gray-500">After platform fees</span>
              <span className="font-medium text-gray-700">
                {(
                  (earningsData.netEarnings / earningsData.totalGross) *
                  100
                ).toFixed(0)}
                % of gross
              </span>
            </div>
          </div>
        </div>

        {/* Tickets Sold */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-blue-100 mr-3 sm:mr-4">
              <FiCalendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Tickets Sold
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {earningsData.ticketsSold}
              </p>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-gray-500">Avg. Ticket Price</span>
              <span className="font-medium text-gray-700">
                ${earningsData.averageTicketPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Over Time */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
          <h4 className="text-sm sm:text-md font-medium text-gray-700 mb-4">
            Earnings Over Time
          </h4>
          <div className="h-48 sm:h-64">
            <div className="relative h-full">
              {/* Y-axis labels */}
              <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-xs text-gray-500 py-2">
                <span>$0</span>
                <span>
                  $
                  {Math.round(
                    Math.max(
                      ...earningsData.dailyEarnings.map((d) => d.gross)
                    ) / 2
                  )}
                </span>
                <span>
                  $
                  {Math.round(
                    Math.max(...earningsData.dailyEarnings.map((d) => d.gross))
                  )}
                </span>
              </div>

              {/* Chart area */}
              <div className="absolute inset-0 ml-8 sm:ml-12">
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  <div className="border-t border-gray-200 h-0"></div>
                  <div className="border-t border-gray-200 h-0"></div>
                  <div className="border-t border-gray-200 h-0"></div>
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-around">
                  {earningsData.dailyEarnings.map((day, index) => {
                    const maxGross = Math.max(
                      ...earningsData.dailyEarnings.map((d) => d.gross)
                    );
                    const grossHeight = (day.gross / maxGross) * 100;
                    const netHeight = (day.net / maxGross) * 100;

                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div className="relative w-6 sm:w-12 flex items-end">
                          {/* Gross bar (background) */}
                          <div
                            className="absolute w-4 sm:w-8 bg-purple-200 rounded-t"
                            style={{ height: `${grossHeight}%` }}
                          ></div>
                          {/* Net bar (foreground) */}
                          <div
                            className="absolute w-4 sm:w-8 bg-purple-600 rounded-t"
                            style={{ height: `${netHeight}%` }}
                          ></div>
                        </div>
                        <span className="mt-1 text-xs text-gray-500 text-center">
                          {new Date(day.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center space-x-4 sm:space-x-6 flex-wrap">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-600 rounded-sm mr-2"></div>
              <span className="text-xs text-gray-600">Net Earnings</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-200 rounded-sm mr-2"></div>
              <span className="text-xs text-gray-600">Platform Fee</span>
            </div>
          </div>
        </div>

        {/* Ticket Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
          <h4 className="text-sm sm:text-md font-medium text-gray-700 mb-4">
            Earnings by Ticket Type
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pie Chart */}
            <div className="relative h-48 sm:h-64 flex items-center justify-center">
              <svg
                width="160"
                height="160"
                viewBox="0 0 100 100"
                className="sm:w-[180px] sm:h-[180px]"
              >
                {/* Create pie chart segments */}
                {earningsData.ticketTypes.map((ticket, index, array) => {
                  // Calculate start and end angles for pie segments
                  const totalRevenue = array.reduce(
                    (sum, t) => sum + t.revenue,
                    0
                  );
                  const percentage = (ticket.revenue / totalRevenue) * 100;

                  let startAngle = 0;
                  for (let i = 0; i < index; i++) {
                    startAngle += (array[i].revenue / totalRevenue) * 360;
                  }
                  const endAngle =
                    startAngle + (ticket.revenue / totalRevenue) * 360;

                  // Convert angles to radians
                  const startRad = (startAngle - 90) * (Math.PI / 180);
                  const endRad = (endAngle - 90) * (Math.PI / 180);

                  // Calculate path
                  const x1 = 50 + 40 * Math.cos(startRad);
                  const y1 = 50 + 40 * Math.sin(startRad);
                  const x2 = 50 + 40 * Math.cos(endRad);
                  const y2 = 50 + 40 * Math.sin(endRad);

                  // Determine if the arc should be drawn as a large arc
                  const largeArcFlag = percentage > 50 ? 1 : 0;

                  return (
                    <path
                      key={index}
                      d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={
                        ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"][
                          index % 5
                        ]
                      }
                    />
                  );
                })}
                {/* Center circle for donut chart */}
                <circle cx="50" cy="50" r="25" fill="white" />
              </svg>
            </div>

            {/* Legend and Stats */}
            <div className="space-y-3 sm:space-y-4">
              {earningsData.ticketTypes.map((ticket, index) => {
                const totalRevenue = earningsData.ticketTypes.reduce(
                  (sum, t) => sum + t.revenue,
                  0
                );
                const percentage = (
                  (ticket.revenue / totalRevenue) *
                  100
                ).toFixed(1);

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="h-3 w-3 rounded-sm mr-2"
                        style={{
                          backgroundColor: [
                            "#8b5cf6",
                            "#ec4899",
                            "#3b82f6",
                            "#10b981",
                            "#f59e0b",
                          ][index % 5],
                        }}
                      ></div>
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
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Fee Explanation */}
      <div className="bg-purple-50 rounded-xl p-4 sm:p-6 border border-purple-100">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FiPieChart className="h-5 w-5 text-purple-600" />
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
