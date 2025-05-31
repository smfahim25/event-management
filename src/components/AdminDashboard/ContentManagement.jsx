import { useState, useEffect } from "react";
import { useSettingsStore } from "../../store/SettingsStore";
import { useFaqStore } from "../../store/FaqStore";
import toast from "react-hot-toast";

export default function ContentManagement() {
  const { policy, fetchPolicy, updatePolicy } = useSettingsStore();
  const { faqs, fetchFaqs, createFaq, updateFaq, deleteFaq } = useFaqStore();

  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    category: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentDocType, setCurrentDocType] = useState("privacyPolicy");

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    faqId: null,
    faqQuestion: "",
  });

  const [legalDoc, setLegalDoc] = useState({
    page: "privacyPolicy",
    content: "",
    effectiveDate: "",
  });

  // Initial data fetch
  useEffect(() => {
    fetchFaqs();
    fetchPolicy(currentDocType);
  }, [fetchFaqs, fetchPolicy, currentDocType]);

  // Update form when policy data arrives
  useEffect(() => {
    if (policy) {
      const policyData = policy[0];
      const formattedDate = policyData.effectiveDate
        ? new Date(policyData.effectiveDate).toISOString().split("T")[0]
        : "";

      setLegalDoc({
        page: policyData.page || currentDocType,
        content: policyData.content || "",
        effectiveDate: formattedDate,
      });
    }
  }, [policy, currentDocType]);

  const handleFaqInputChange = (e) => {
    const { name, value } = e.target;
    setFaqForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFaqSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      toast.error("Please fill in both question and answer fields.");
      return;
    }

    const categoryToSave = faqForm.category.trim() || "general";

    setLoading(true);
    try {
      const faqData = {
        ...faqForm,
        category: categoryToSave,
      };

      if (editingId) {
        await updateFaq(editingId, faqData);
        setEditingId(null);
      } else {
        await createFaq(faqData);
      }

      setFaqForm({
        question: "",
        answer: "",
        category: "",
      });
    } catch (error) {
      console.error("Failed to save FAQ:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFaq = (faq) => {
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "",
    });
    setEditingId(faq._id);
  };

  const handleCancelEdit = () => {
    setFaqForm({
      question: "",
      answer: "",
      category: "",
    });
    setEditingId(null);
  };

  const handleDeleteFaq = (faq) => {
    setDeleteConfirmation({
      isOpen: true,
      faqId: faq._id,
      faqQuestion: faq.question,
    });
  };

  const confirmDeleteFaq = async () => {
    setLoading(true);
    try {
      await deleteFaq(deleteConfirmation.faqId);
      setDeleteConfirmation({ isOpen: false, faqId: null, faqQuestion: "" });
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelDeleteFaq = () => {
    setDeleteConfirmation({ isOpen: false, faqId: null, faqQuestion: "" });
  };

  const handleLegalDocChange = (e) => {
    const { name, value } = e.target;
    if (name === "page") {
      setCurrentDocType(value);
    }
    setLegalDoc((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLegalDocUpdate = async () => {
    if (!legalDoc.content.trim()) {
      alert("Please enter document content.");
      return;
    }

    setLoading(true);
    try {
      await updatePolicy(legalDoc);
    } catch (error) {
      console.error("Failed to update document:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: "bg-blue-100 text-blue-800",
      tickets: "bg-green-100 text-green-800",
      refunds: "bg-yellow-100 text-yellow-800",
      organizers: "bg-purple-100 text-purple-800",
      billing: "bg-indigo-100 text-indigo-800",
      account: "bg-pink-100 text-pink-800",
      technical: "bg-red-100 text-red-800",
      events: "bg-orange-100 text-orange-800",
    };

    return colors[category?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getExistingCategories = () => {
    const categories = faqs.map((faq) => faq.category).filter((cat) => cat);
    return [...new Set(categories)].sort();
  };

  const getDocumentTypeName = (type) => {
    const typeNames = {
      privacyPolicy: "Privacy Policy",
      termsConditions: "Terms and Conditions",
    };
    return typeNames[type] || type;
  };

  const existingCategories = getExistingCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Content Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage your platform&#39;s FAQs and legal documents with ease
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
            <div className="px-6 py-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    FAQs Management
                  </h3>
                  <p className="text-sm text-gray-500">
                    Create and manage frequently asked questions
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="question"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Question
                  </label>
                  <input
                    type="text"
                    name="question"
                    id="question"
                    value={faqForm.question}
                    onChange={handleFaqInputChange}
                    className="w-full h-12 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter your FAQ question..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="answer"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Answer
                  </label>
                  <textarea
                    id="answer"
                    name="answer"
                    rows={4}
                    value={faqForm.answer}
                    onChange={handleFaqInputChange}
                    className="w-full p-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    placeholder="Provide a detailed answer..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="category"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    id="category"
                    value={faqForm.category}
                    onChange={handleFaqInputChange}
                    className="w-full h-12 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter category (e.g., tickets, refunds, general)..."
                    list="category-suggestions"
                  />
                  {existingCategories.length > 0 && (
                    <datalist id="category-suggestions">
                      {existingCategories.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  )}
                  {existingCategories.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-2">
                        Existing categories:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {existingCategories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() =>
                              setFaqForm((prev) => ({ ...prev, category }))
                            }
                            className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getCategoryColor(
                              category
                            )}`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={handleFaqSubmit}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </div>
                    ) : editingId ? (
                      "Update FAQ"
                    ) : (
                      "Add FAQ"
                    )}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Current FAQs
                  </h4>
                  <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {faqs.length} FAQ{faqs.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-4">
                  {faqs.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">
                        No FAQs found. Create your first FAQ above.
                      </p>
                    </div>
                  ) : (
                    faqs.map((faq) => (
                      <div
                        key={faq._id}
                        className={`border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 ${
                          editingId === faq._id
                            ? "ring-2 ring-blue-500 bg-blue-50/50"
                            : "bg-white hover:bg-gray-50/50"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3 mb-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                                  faq.category
                                )}`}
                              >
                                {faq.category || "general"}
                              </span>
                            </div>
                            <h5 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                              {faq.question}
                            </h5>
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {faq.answer}
                            </p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleEditFaq(faq)}
                              disabled={loading}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                              title="Edit FAQ"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteFaq(faq)}
                              disabled={loading}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                              title="Delete FAQ"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Legal Documents Section */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20">
            <div className="px-6 py-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Legal Documents
                  </h3>
                  <p className="text-sm text-gray-500">
                    Manage terms of service, privacy policy, and other legal
                    content
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="page"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Document Type
                  </label>
                  <select
                    id="page"
                    name="page"
                    value={legalDoc.page}
                    onChange={handleLegalDocChange}
                    className="w-full h-12 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  >
                    <option value="privacyPolicy">Privacy Policy</option>
                    <option value="termsConditions">
                      Terms and Conditions
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="content"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={12}
                    value={legalDoc.content}
                    onChange={handleLegalDocChange}
                    className="w-full p-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    placeholder="Enter document content..."
                  />
                </div>

                {policy && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                    <h5 className="text-sm font-semibold text-gray-800 mb-2">
                      Current Policy Information
                    </h5>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Type:</span>{" "}
                        {getDocumentTypeName(policy[0].page) || "Not Set"}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Last Updated:</span>{" "}
                        {policy[0].updatedAt
                          ? new Date(policy[0].updatedAt).toLocaleDateString()
                          : "Never"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <label
                      htmlFor="effectiveDate"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Effective Date
                    </label>
                    <input
                      type="date"
                      name="effectiveDate"
                      id="effectiveDate"
                      value={legalDoc.effectiveDate}
                      onChange={handleLegalDocChange}
                      className="w-full h-12 px-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleLegalDocUpdate}
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update Document"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-200 scale-100">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete FAQ
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Question:</span>
                </p>
                <p className="text-sm text-gray-900 mt-1 font-medium">
                  {deleteConfirmation.faqQuestion}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelDeleteFaq}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteFaq}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </div>
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
