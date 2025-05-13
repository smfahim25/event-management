export default function RevenueChart({ data }) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Revenue Overview
        </h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="h-80">
          <div className="relative h-full">
            {/* Y-axis labels */}
            <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-xs text-gray-500 py-2">
              <span>$0</span>
              <span>${Math.round(maxRevenue / 2)}</span>
              <span>${Math.round(maxRevenue)}</span>
            </div>

            {/* Chart area */}
            <div className="absolute inset-0 ml-12">
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                <div className="border-t border-gray-200 h-0"></div>
                <div className="border-t border-gray-200 h-0"></div>
                <div className="border-t border-gray-200 h-0"></div>
              </div>

              {/* Bars */}
              <div className="absolute inset-0 flex items-end justify-around">
                {data.map((month, index) => {
                  const revenueHeight = (month.revenue / maxRevenue) * 100;
                  const commissionHeight =
                    (month.commission / maxRevenue) * 100;

                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div className="relative w-12 sm:w-16 flex items-end">
                        {/* Revenue bar (background) */}
                        <div
                          className="absolute w-8 sm:w-12 bg-indigo-200 rounded-t transition-all duration-500 ease-in-out"
                          style={{
                            height: `${revenueHeight}%`,
                          }}
                        ></div>
                        {/* Commission bar (foreground) */}
                        <div
                          className="absolute w-8 sm:w-12 bg-indigo-600 rounded-t transition-all duration-500 ease-in-out"
                          style={{
                            height: `${commissionHeight}%`,
                          }}
                        ></div>
                      </div>
                      <span className="mt-1 text-xs text-gray-500">
                        {month.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-indigo-600 rounded-sm mr-2"></div>
            <span className="text-xs text-gray-600">Platform Commission</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-indigo-200 rounded-sm mr-2"></div>
            <span className="text-xs text-gray-600">Total Revenue</span>
          </div>
        </div>
      </div>
    </div>
  );
}
