export default function OrganizerRegistrationForm() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-purple-600 py-6 px-8">
          <h1 className="text-2xl font-bold text-white">
            Organizer Registration
          </h1>
          <p className="text-indigo-100 mt-1">
            Complete the form below to register as an event organizer
          </p>
        </div>

        <form className="py-8 px-8 space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Basic Information
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="organizationName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Organization Name*
                </label>
                <input
                  type="text"
                  name="organizationName"
                  id="organizationName"
                  required
                  placeholder="Creative Events Co."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  required
                  placeholder="We organize music, art, and technology events across the country."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="logo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Logo*
                </label>
                <input
                  type="file"
                  name="logo"
                  id="logo"
                  required
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website*
                </label>
                <input
                  type="url"
                  name="website"
                  id="website"
                  required
                  placeholder="https://creativeevents.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Social Media
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label
                  htmlFor="facebook"
                  className="block text-sm font-medium text-gray-700"
                >
                  Facebook
                </label>
                <input
                  type="url"
                  name="facebook"
                  id="facebook"
                  placeholder="https://facebook.com/creativeevents"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label
                  htmlFor="twitter"
                  className="block text-sm font-medium text-gray-700"
                >
                  Twitter
                </label>
                <input
                  type="url"
                  name="twitter"
                  id="twitter"
                  placeholder="https://twitter.com/creativeevents"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label
                  htmlFor="instagram"
                  className="block text-sm font-medium text-gray-700"
                >
                  Instagram
                </label>
                <input
                  type="url"
                  name="instagram"
                  id="instagram"
                  placeholder="https://instagram.com/creativeevents"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label
                  htmlFor="linkedin"
                  className="block text-sm font-medium text-gray-700"
                >
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin"
                  id="linkedin"
                  placeholder="https://linkedin.com/company/creativeevents"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Address
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
              <div className="sm:col-span-6">
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street Address*
                </label>
                <input
                  type="text"
                  name="street"
                  id="street"
                  required
                  placeholder="123 Event Lane"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City*
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  required
                  placeholder="New York"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State/Province*
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  required
                  placeholder="NY"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  ZIP / Postal Code*
                </label>
                <input
                  type="text"
                  name="zipCode"
                  id="zipCode"
                  required
                  placeholder="10001"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country*
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                >
                  <option value="">Select a country</option>
                  <option value="USA">United States</option>
                  <option value="CAN">Canada</option>
                  <option value="GBR">United Kingdom</option>
                  <option value="AUS">Australia</option>
                  <option value="DEU">Germany</option>
                  <option value="FRA">France</option>
                  {/* Add more countries as needed */}
                </select>
              </div>
            </div>
          </div>

          {/* Verification Documents */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Verification Documents
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label
                  htmlFor="businessLicense"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business License*
                </label>
                <input
                  type="file"
                  name="businessLicense"
                  id="businessLicense"
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Upload PDF, JPG, or PNG (max 5MB)
                </p>
              </div>

              <div>
                <label
                  htmlFor="taxId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tax ID*
                </label>
                <input
                  type="file"
                  name="taxId"
                  id="taxId"
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Upload PDF, JPG, or PNG (max 5MB)
                </p>
              </div>

              <div>
                <label
                  htmlFor="additionalDocument"
                  className="block text-sm font-medium text-gray-700"
                >
                  Additional Document (Optional)
                </label>
                <input
                  type="file"
                  name="additionalDocument"
                  id="additionalDocument"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Upload PDF, JPG, or PNG (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Financial Information
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label
                  htmlFor="commissionRate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Commission Rate (%)*
                </label>
                <input
                  type="number"
                  name="commissionRate"
                  id="commissionRate"
                  required
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="7.5"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label
                  htmlFor="payoutSchedule"
                  className="block text-sm font-medium text-gray-700"
                >
                  Payout Schedule*
                </label>
                <select
                  id="payoutSchedule"
                  name="payoutSchedule"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                >
                  <option value="">Select a schedule</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="sm:col-span-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-500">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-500">
                    Privacy Policy
                  </a>
                  *
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
