export default function CommissionSettings() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Commission Settings
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Global Commission Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Global Commission Rate
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Set the default commission rate for all events on the platform.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label
                  htmlFor="commission-rate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Default Commission Rate (%)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="commission-rate"
                    id="commission-rate"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full h-[40px] px-4 sm:text-sm  rounded-md border-indigo-500 border-2"
                    placeholder="5.00"
                    defaultValue="5.00"
                    step="0.01"
                    min="0"
                    max="100"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Special Commission Rates */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Special Commission Rates
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Set custom commission rates for specific organizers or events.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="organizer"
                  className="block text-sm font-medium text-gray-700"
                >
                  Organizer or Event
                </label>
                <select
                  id="organizer"
                  name="organizer"
                  className="mt-1 block w-full px-4 py-2 text-base border-indigo-500 border-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select an organizer or event</option>
                  <option value="org1">Tech Events Inc.</option>
                  <option value="org2">Music Festival Productions</option>
                  <option value="org3">Modern Art Gallery</option>
                  <option value="evt1">Tech Conference 2025</option>
                  <option value="evt2">Summer Music Festival</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="special-rate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Special Commission Rate (%)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="special-rate"
                    id="special-rate"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 h-[40px] sm:text-sm border-indigo-500 border-2 rounded-md"
                    placeholder="3.00"
                    step="0.01"
                    min="0"
                    max="100"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                >
                  Add Special Rate
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700">
                Current Special Rates
              </h4>
              <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Rate
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        Tech Events Inc.
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        Organizer
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        3.5%
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </a>
                        <span className="text-gray-500 mx-1">|</span>
                        <a href="#" className="text-red-600 hover:text-red-900">
                          Remove
                        </a>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        Summer Music Festival
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        Event
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        4.0%
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </a>
                        <span className="text-gray-500 mx-1">|</span>
                        <a href="#" className="text-red-600 hover:text-red-900">
                          Remove
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
