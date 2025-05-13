export default function OrganizerApprovals({ pendingApprovals }) {
  const organizers = [
    {
      id: 1,
      name: "John Smith",
      email: "john@techevents.com",
      business: "Tech Events Inc.",
      date: "May 10, 2025",
      documents: 3,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@musicfest.com",
      business: "Music Festival Productions",
      date: "May 11, 2025",
      documents: 2,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    },
    {
      id: 3,
      name: "Robert Chen",
      email: "robert@artgallery.com",
      business: "Modern Art Gallery",
      date: "May 12, 2025",
      documents: 4,
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Organizer Approvals
      </h1>
      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Pending Organizer Applications
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Review and approve organizer applications before they can create
            events.
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
                  Organizer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Business Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Application Date
                </th>
                {/* <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Documents
                </th> */}
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {organizers.map((organizer) => (
                <tr
                  key={organizer.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={organizer.image || "/placeholder.svg"}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {organizer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {organizer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {organizer.business}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {organizer.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* <button className="text-indigo-600 hover:text-indigo-900">
                      View {organizer.documents} documents
                    </button> */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
