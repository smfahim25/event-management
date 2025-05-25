import { useState, useEffect } from "react";
import { useEventStore } from "../../store/EventStore";
import { useSettingsStore } from "../../store/SettingsStore";

export default function CommissionSettings() {
  const { settings, fetchSettings, updateSettings, updateCommission } =
    useSettingsStore();
  const { events, fetchAdminEvents } = useEventStore();

  const [globalRate, setGlobalRate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [specialRate, setSpecialRate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchAdminEvents();
  }, [fetchSettings, fetchAdminEvents]);

  useEffect(() => {
    if (settings?.globalCommissionRate) {
      setGlobalRate(settings.globalCommissionRate.toString());
    }
  }, [settings]);

  const handleGlobalSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("globalCommissionRate", parseFloat(globalRate));

      await updateSettings(formData);
    } catch (error) {
      console.error("Failed to update global commission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpecialSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !specialRate) return;

    setIsLoading(true);
    try {
      console.log(selectedEvent);
      await updateCommission(selectedEvent, parseFloat(specialRate));

      setSelectedEvent("");
      setSpecialRate("");
    } catch (error) {
      console.error("Failed to update special commission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Commission Settings
      </h1>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Global Commission Rate */}
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
            <form onSubmit={handleGlobalSubmit}>
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
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full h-[40px] px-4 sm:text-sm rounded-md border-indigo-500 border-2"
                      placeholder="5.00"
                      value={globalRate}
                      onChange={(e) => setGlobalRate(e.target.value)}
                      step="0.01"
                      min="0"
                      max="100"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Special Commission Rates */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Special Commission Rates
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Set custom commission rates for specific events.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSpecialSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="event-select"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event
                  </label>
                  <select
                    id="event-select"
                    name="event-select"
                    className="mt-1 block w-full px-4 py-2 text-base border-indigo-500 border-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    required
                  >
                    <option value="">Select an event</option>
                    {events.map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.eventName}
                      </option>
                    ))}
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
                      value={specialRate}
                      onChange={(e) => setSpecialRate(e.target.value)}
                      step="0.01"
                      min="0"
                      max="100"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading || !selectedEvent || !specialRate}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Adding..." : "Add Special Rate"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
