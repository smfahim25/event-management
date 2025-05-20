import { useState, useEffect } from "react";
import { FiCalendar, FiPlus, FiTrash2, FiInfo, FiCheck } from "react-icons/fi";
import PropTypes from "prop-types";

const RefundPolicyManager = ({ eventId, onSave }) => {
  const [policies, setPolicies] = useState([]);
  const [newPolicy, setNewPolicy] = useState({
    daysBeforeEvent: 7,
    refundPercentage: 50,
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  useEffect(() => {
    // Simulate fetching policies for this event
    setTimeout(() => {
      setPolicies([
        {
          id: "policy_1",
          daysBeforeEvent: 7,
          refundPercentage: 50,
          description: "50% refund if canceled 7 days before the event",
          isDefault: true,
        },
        {
          id: "policy_2",
          daysBeforeEvent: 14,
          refundPercentage: 75,
          description: "75% refund if canceled 14 days before the event",
          isDefault: false,
        },
        {
          id: "policy_3",
          daysBeforeEvent: 30,
          refundPercentage: 100,
          description: "100% refund if canceled 30 days before the event",
          isDefault: false,
        },
      ]);
      setSelectedPolicy("policy_1");
      setIsLoading(false);
    }, 800);
  }, [eventId]);

  const handleAddPolicy = () => {
    if (!newPolicy.description) {
      setNewPolicy({
        ...newPolicy,
        description: `${newPolicy.refundPercentage}% refund if canceled ${newPolicy.daysBeforeEvent} days before the event`,
      });
    }

    const policy = {
      id: `policy_${Date.now()}`,
      daysBeforeEvent: newPolicy.daysBeforeEvent,
      refundPercentage: newPolicy.refundPercentage,
      description:
        newPolicy.description ||
        `${newPolicy.refundPercentage}% refund if canceled ${newPolicy.daysBeforeEvent} days before the event`,
      isDefault: policies.length === 0,
    };

    const updatedPolicies = [...policies, policy];
    setPolicies(updatedPolicies);
    setNewPolicy({
      daysBeforeEvent: 7,
      refundPercentage: 50,
      description: "",
    });

    // If this is the first policy, select it
    if (policies.length === 0) {
      setSelectedPolicy(policy.id);
    }
  };

  const handleDeletePolicy = (policyId) => {
    const updatedPolicies = policies.filter((policy) => policy.id !== policyId);
    setPolicies(updatedPolicies);

    // If the deleted policy was selected, select another one
    if (selectedPolicy === policyId && updatedPolicies.length > 0) {
      setSelectedPolicy(updatedPolicies[0].id);
    } else if (updatedPolicies.length === 0) {
      setSelectedPolicy(null);
    }
  };

  const handleSelectPolicy = (policyId) => {
    setSelectedPolicy(policyId);
    const updatedPolicies = policies.map((policy) => ({
      ...policy,
      isDefault: policy.id === selectedPolicy,
    }));
    const selectedPolicyDetails = updatedPolicies.find(
      (policy) => policy.id === policyId
    );

    console.log("Selected Policy:", selectedPolicyDetails);

    onSave(selectedPolicyDetails);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-200 rounded w-full"></div>
          <div className="h-20 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Refund Policies
        </h3>
        <p className="text-sm text-gray-500">
          Configure refund policies for this event. These policies will be
          applied automatically when attendees request refunds.
        </p>
      </div>

      {/* Policy Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Select a refund policy for this event
        </label>
        {policies.length > 0 ? (
          <div className="space-y-3">
            {policies.map((policy) => (
              <div
                key={policy.id}
                onClick={() => handleSelectPolicy(policy.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPolicy === policy.id
                    ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                    : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/30"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                        selectedPolicy === policy.id
                          ? "border-purple-500 bg-purple-500 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPolicy === policy.id && (
                        <FiCheck className="w-3 h-3" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {policy.description}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500 flex items-center">
                          <FiCalendar className="mr-1 h-3 w-3" />
                          {policy.daysBeforeEvent} days before event
                        </span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-xs text-gray-500 flex items-center">
                          {/* <FiPercent className="mr-1 h-3 w-3" /> */}
                          {policy.refundPercentage}% refund
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePolicy(policy.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-sm text-gray-500">
              No refund policies configured yet. Add one below.
            </p>
          </div>
        )}
      </div>

      {/* Add New Policy */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">
          Add New Policy
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="days"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Days Before Event
            </label>
            <input
              type="number"
              id="days"
              min="0"
              value={newPolicy.daysBeforeEvent}
              onChange={(e) =>
                setNewPolicy({
                  ...newPolicy,
                  daysBeforeEvent: Number.parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label
              htmlFor="percentage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Refund Percentage
            </label>
            <input
              type="number"
              id="percentage"
              min="0"
              max="100"
              value={newPolicy.refundPercentage}
              onChange={(e) =>
                setNewPolicy({
                  ...newPolicy,
                  refundPercentage: Number.parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description (Optional)
          </label>
          <input
            type="text"
            id="description"
            value={newPolicy.description}
            onChange={(e) =>
              setNewPolicy({ ...newPolicy, description: e.target.value })
            }
            placeholder={`${newPolicy.refundPercentage}% refund if canceled ${newPolicy.daysBeforeEvent} days before the event`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <FiInfo className="mr-2 h-4 w-4" />
          <p>
            This policy will automatically apply to refund requests based on how
            many days before the event the request is made.
          </p>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddPolicy}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add Policy
          </button>
        </div>
      </div>
    </div>
  );
};
RefundPolicyManager.propTypes = {
  eventId: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default RefundPolicyManager;
