export default function EventApprovals({ pendingApprovals }) {
  const events = [
    {
      id: 1,
      name: "Tech Conference 2025",
      organizer: "Tech Events Inc.",
      date: "June 15-17, 2025",
      location: "San Francisco, CA",
      submitted: "May 10, 2025",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: 2,
      name: "Summer Music Festival",
      organizer: "Music Festival Productions",
      date: "July 4-6, 2025",
      location: "Austin, TX",
      submitted: "May 11, 2025",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: 3,
      name: "Modern Art Exhibition",
      organizer: "Modern Art Gallery",
      date: "August 1-30, 2025",
      location: "New York, NY",
      submitted: "May 12, 2025",
      image: "/placeholder.svg?height=100&width=200",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Event Approvals</h1>
      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Pending Event Approvals
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Review and approve events before they are published to the platform.
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
                  Event
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Organizer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Submitted
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-24">
                        <img
                          className="h-16 w-24 rounded object-cover"
                          src={event.image || "/placeholder.svg"}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {event.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {event.organizer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{event.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {event.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.submitted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      View Details
                    </button> */}
                    <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium mr-2 hover:bg-green-200 transition-colors duration-150">
                      Approve
                    </button>
                    <button className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-200 transition-colors duration-150">
                      Reject
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
