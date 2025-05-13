export default function RefundResolution({ pendingApprovals }) {
  const refundRequests = [
    {
      id: 1,
      attendee: "Michael Brown",
      email: "michael@example.com",
      event: "Tech Conference 2025",
      price: "$199.00",
      date: "May 10, 2025",
      reason: "Unable to attend due to illness",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    },
    {
      id: 2,
      attendee: "Emily Davis",
      email: "emily@example.com",
      event: "Summer Music Festival",
      price: "$150.00",
      date: "May 11, 2025",
      reason: "Event date changed, can't attend new date",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    },
    {
      id: 3,
      attendee: "David Wilson",
      email: "david@example.com",
      event: "Business Workshop",
      price: "$299.00",
      date: "May 12, 2025",
      reason: "Workshop content changed significantly from description",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Refund Conflict Resolution
      </h1>
      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Pending Refund Requests
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Review and resolve refund disputes between attendees and organizers.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Attendee
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Event
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ticket Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Request Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Reason
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {refundRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={request.image || "/placeholder.svg"}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {request.attendee}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.event}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{request.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {request.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      View Details
                    </button> */}
                    <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium mr-2 hover:bg-green-200 transition-colors duration-150">
                      Approve
                    </button>
                    <button className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-200 transition-colors duration-150">
                      Deny
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
