export default function ContentManagement() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Content Management
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* FAQs */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              FAQs
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage frequently asked questions for the platform.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="faq-question"
                  className="block text-sm font-medium text-gray-700"
                >
                  Question
                </label>
                <input
                  type="text"
                  name="faq-question"
                  id="faq-question"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full h-[40px] border-indigo-500 shadow-sm sm:text-sm px-4 border-2 rounded-md"
                  placeholder="Enter FAQ question"
                />
              </div>
              <div>
                <label
                  htmlFor="faq-answer"
                  className="block text-sm font-medium text-gray-700"
                >
                  Answer
                </label>
                <textarea
                  id="faq-answer"
                  name="faq-answer"
                  rows={4}
                  className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-2 border-indigo-500 p-4 rounded-md"
                  placeholder="Enter FAQ answer"
                />
              </div>
              <div>
                <label
                  htmlFor="faq-category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="faq-category"
                  name="faq-category"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-2 border-indigo-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="general">General</option>
                  <option value="tickets">Tickets</option>
                  <option value="refunds">Refunds</option>
                  <option value="organizers">For Organizers</option>
                </select>
              </div>
              <div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                >
                  Add FAQ
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700">
                Current FAQs
              </h4>
              <div className="mt-2 space-y-4">
                <div className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex justify-between">
                    <h5 className="text-sm font-medium text-gray-900">
                      How do I get a refund?
                    </h5>
                    <div>
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm mr-2">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900 text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Refunds are processed according to each event&apos;s refund
                    policy. You can request a refund from your order history
                    page.
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Category: Refunds
                  </p>
                </div>
                <div className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex justify-between">
                    <h5 className="text-sm font-medium text-gray-900">
                      How do I create an event?
                    </h5>
                    <div>
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm mr-2">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900 text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    To create an event, you need to register as an organizer.
                    Once approved, you can create events from your organizer
                    dashboard.
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Category: For Organizers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Documents */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Legal Documents
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage terms of service, privacy policy, and other legal content.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="document-type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Document Type
                </label>
                <select
                  id="document-type"
                  name="document-type"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-indigo-500 border-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="terms">Terms of Service</option>
                  <option value="privacy">Privacy Policy</option>
                  <option value="refund">Refund Policy</option>
                  <option value="cookies">Cookie Policy</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="document-content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <textarea
                  id="document-content"
                  name="document-content"
                  rows={10}
                  className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-indigo-500 border p-4 rounded-md"
                  placeholder="Enter document content"
                  defaultValue="Terms of Service for Event Platform

Last Updated: May 1, 2025

1. Introduction
Welcome to our event platform. By using our services, you agree to these Terms of Service.

2. User Accounts
You are responsible for maintaining the security of your account.

3. Events and Tickets
All events are subject to the organizer's terms and conditions."
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="effective-date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Effective Date
                  </label>
                  <input
                    type="date"
                    name="effective-date"
                    id="effective-date"
                    className="mt-1 focus:ring-indigo-500 w-[200px] px-2 focus:border-indigo-500 block shadow-sm sm:text-sm border-indigo-500 border-2 h-[40px] rounded-md"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                  >
                    Update Document
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700">
                Document History
              </h4>
              <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Document
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Last Updated
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        By
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
                        Terms of Service
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        May 1, 2025
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        Admin User
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        Privacy Policy
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        April 15, 2025
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        Admin User
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        Refund Policy
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        March 20, 2025
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        Admin User
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
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
