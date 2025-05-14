import { useState } from "react";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("TECH PLANES");
  const [currency, setCurrency] = useState("$ (Dollar)");
  const [taxAlias, setTaxAlias] = useState("GST");
  const [taxPercentage, setTaxPercentage] = useState("12");
  const [expiryDays, setExpiryDays] = useState("30");
  const [address, setAddress] = useState("");
  const [logo, setLogo] = useState("/placeholder.svg?height=100&width=100");
  const [isLogoUploaded, setIsLogoUploaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogo(e.target.result);
          setIsLogoUploaded(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Company Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Company Name */}
            <div>
              <label
                htmlFor="company-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Name
              </label>
              <input
                type="text"
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Currency Symbol */}
            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Currency Symbol
              </label>
              <div className="relative">
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>$ (Dollar)</option>
                  <option>€ (Euro)</option>
                  <option>£ (Pound)</option>
                  <option>₹ (Rupee)</option>
                  <option>¥ (Yen)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Used in invoices and reports
              </p>
            </div>

            {/* Tax Alias */}
            <div>
              <label
                htmlFor="tax-alias"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tax Alias
              </label>
              <div className="relative">
                <select
                  id="tax-alias"
                  value={taxAlias}
                  onChange={(e) => setTaxAlias(e.target.value)}
                  className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>GST</option>
                  <option>VAT</option>
                  <option>Sales Tax</option>
                  <option>Service Tax</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">Used in invoices</p>
            </div>

            {/* Tax Percentage */}
            <div>
              <label
                htmlFor="tax-percentage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tax Percentage
              </label>
              <input
                type="number"
                id="tax-percentage"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(e.target.value)}
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Days Before Product Expiry */}
            <div>
              <label
                htmlFor="expiry-days"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Days Before Product Expiry
              </label>
              <input
                type="number"
                id="expiry-days"
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Notification will be sent before this many days
              </p>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="Enter company address"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>

          {/* Company Logo */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Company Logo
            </label>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2 border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 relative">
                {isLogoUploaded && (
                  <button
                    onClick={() => {
                      setLogo("/placeholder.svg?height=100&width=100");
                      setIsLogoUploaded(false);
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                  >
                    <svg
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                )}

                {isLogoUploaded ? (
                  <div className="flex items-center justify-center">
                    <img
                      src={logo || "/placeholder.svg"}
                      alt="Company logo"
                      className="max-h-32 max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <svg
                      className="h-12 w-12 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <p className="text-sm text-gray-500 mb-2">
                      Drag and drop your logo here
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      or click to browse files
                    </p>
                  </div>
                )}

                <label className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md cursor-pointer hover:bg-blue-200 transition-colors">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  {isLogoUploaded ? "Change Logo" : "Upload Logo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </label>
              </div>

              <div className="w-full md:w-1/2">
                <h3 className="text-md font-medium text-gray-800 mb-3">
                  Logo Guidelines
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      ></path>
                    </svg>
                    <span className="text-sm text-gray-600">
                      Use a transparent PNG or SVG for best results
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      ></path>
                    </svg>
                    <span className="text-sm text-gray-600">
                      Recommended size: 400×200 pixels
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      ></path>
                    </svg>
                    <span className="text-sm text-gray-600">
                      Your logo will appear on invoices, reports, and dashboard
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
