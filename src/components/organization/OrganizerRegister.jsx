import { useEffect, useMemo, useState } from "react";
import { useOrganizerStore } from "../../store/OrganizerStore";
import { useNavigate } from "react-router-dom";
import SearchableSelect from "../ui/SearchSelect";

export default function OrganizerRegistrationForm() {
  const { createOrganizer, loading, error, success } = useOrganizerStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    organizationName: "",
    description: "",
    logo: null,
    website: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      countryIso2: "",
    },
    commissionRate: "",
    payoutSchedule: "",
  });
  const [europeanLocations, setEuropeanLocations] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadLocationData = async () => {
      try {
        const response = await fetch("/europe.json");
        const data = await response.json();
        setEuropeanLocations(data);
      } catch (error) {
        console.error("Error loading location data:", error);

        setEuropeanLocations([
          {
            country: "Albania",
            states: [
              {
                state: "Berat",
                cities: ["Berat", "Kuçovë", "Poliçan"],
              },
              {
                state: "Tirana",
                cities: ["Tirana", "Kamëz", "Vorë"],
              },
            ],
          },
        ]);
      }
    };

    loadLocationData();
  }, []);

  const countries = useMemo(() => {
    return europeanLocations.map((location) => location.country).sort();
  }, [europeanLocations]);

  const availableStates = useMemo(() => {
    if (!formData.address.country) return [];
    const selectedCountry = europeanLocations.find(
      (location) => location.country === formData.address.country
    );
    return selectedCountry
      ? selectedCountry.states.map((state) => state.state).sort()
      : [];
  }, [europeanLocations, formData.address.country]);

  const availableCities = useMemo(() => {
    if (!formData.address.country || !formData.address.state) return [];
    const selectedCountry = europeanLocations.find(
      (location) => location.country === formData.address.country
    );
    if (!selectedCountry) return [];

    const selectedState = selectedCountry.states.find(
      (state) => state.state === formData.address.state
    );
    return selectedState ? selectedState.cities.sort() : [];
  }, [europeanLocations, formData.address.country, formData.address.state]);

  const handleCountryChange = (country) => {
    const selectedCountryObj = europeanLocations.find(
      (location) => location.country === country
    );

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        country: country,
        countryIso2: selectedCountryObj?.iso2 || "",
        state: "",
        city: "",
      },
    }));
    setErrors((prev) => ({ ...prev, country: null, state: null, city: null }));
  };

  const handleStateChange = (state) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        state: state,
        city: "",
      },
    }));
    setErrors((prev) => ({ ...prev, state: null, city: null }));
  };

  const handleCityChange = (city) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        city: city,
      },
    }));
    setErrors((prev) => ({ ...prev, city: null }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      logo: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createOrganizer(formData);
    navigate("/app/profile");
  };

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

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 m-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Registration successful! Your organizer account is now pending
                  approval.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="py-8 px-8 space-y-8" onSubmit={handleSubmit}>
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
                  value={formData.organizationName}
                  onChange={handleInputChange}
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
                  value={formData.description}
                  onChange={handleInputChange}
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
                  onChange={handleFileChange}
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
                  type="text"
                  name="website"
                  id="website"
                  required
                  placeholder="https://creativeevents.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  value={formData.website}
                  onChange={handleInputChange}
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
                  htmlFor="address.street"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street Address*
                </label>
                <input
                  type="text"
                  name="address.street"
                  id="address.street"
                  required
                  placeholder="123 Event Lane"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  value={formData.address.street}
                  onChange={handleInputChange}
                />
              </div>

              {/* Country Dropdown */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country*
                </label>
                <SearchableSelect
                  options={countries}
                  value={formData.address.country}
                  onChange={handleCountryChange}
                  placeholder="Select Country"
                  error={errors.country}
                />
                {errors.country && (
                  <div className="mt-1 text-xs text-red-600">
                    {errors.country}
                  </div>
                )}
              </div>

              {/* State Dropdown */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province*
                </label>
                <SearchableSelect
                  options={availableStates}
                  value={formData.address.state}
                  onChange={handleStateChange}
                  placeholder="Select State/Province"
                  disabled={!formData.address.country}
                  error={errors.state}
                />
                {errors.state && (
                  <div className="mt-1 text-xs text-red-600">
                    {errors.state}
                  </div>
                )}
              </div>

              {/* City Dropdown */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City*
                </label>
                <SearchableSelect
                  options={availableCities}
                  value={formData.address.city}
                  onChange={handleCityChange}
                  placeholder="Select City"
                  disabled={!formData.address.state}
                  error={errors.city}
                />
                {errors.city && (
                  <div className="mt-1 text-xs text-red-600">{errors.city}</div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address.zipCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  ZIP / Postal Code*
                </label>
                <input
                  type="text"
                  name="address.zipCode"
                  id="address.zipCode"
                  required
                  placeholder="10001"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  value={formData.address.zipCode}
                  onChange={handleInputChange}
                />
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
                onClick={() => navigate(-1)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  loading
                    ? "bg-purple-400"
                    : "bg-purple-600 hover:bg-purple-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {loading ? (
                  <>
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
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
