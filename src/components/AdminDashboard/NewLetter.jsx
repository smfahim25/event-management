import { useState, useEffect } from "react";
import { Users, Mail, Calendar, Search, Download, Send, X } from "lucide-react";
import useNewsletterStore from "../../store/newsLetterStore";
import toast from "react-hot-toast";

const NewsletterSubscribers = () => {
  const { getNewsletter, sendNewsletterEmail } = useNewsletterStore();
  const [subscribers, setSubscribers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNewsletter();
        setSubscribers(data?.data);
        setFilteredSubscribers(data?.data);
      } catch (err) {
        console.error("Failed to fetch newsletter data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = subscribers?.filter((subscriber) =>
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubscribers(filtered);
  }, [searchTerm, subscribers]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportToCSV = () => {
    const headers = ["Email", "Subscribed At", "ID"];
    const csvContent = [
      headers.join(","),
      ...subscribers.map((sub) =>
        [sub.email, sub.subscribedAt, sub._id].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const openEmailModal = () => {
    setIsEmailModalOpen(true);
    setEmailSubject("");
    setEmailBody("");
  };

  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
    setEmailSubject("");
    setEmailBody("");
  };

  const sendEmailToSubscribers = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error("Please fill in both subject and body fields");
      return;
    }

    setIsSending(true);

    try {
      await sendNewsletterEmail({
        subject: emailSubject,
        body: emailBody,
      });

      closeEmailModal();
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  Newsletter Subscribers
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Manage your email subscription list
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="bg-green-50 px-3 py-2 rounded-lg text-center sm:text-left">
                <span className="text-xs sm:text-sm font-medium text-green-800">
                  {subscribers.length} Total Subscribers
                </span>
              </div>

              <div className="flex space-x-2 sm:space-x-3">
                <button
                  onClick={openEmailModal}
                  disabled={subscribers.length === 0}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-1 sm:space-x-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send Email</span>
                  <span className="sm:hidden">Send</span>
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-1 sm:space-x-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by email address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-3 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Subscribers ({filteredSubscribers.length})
            </h2>
          </div>

          {filteredSubscribers.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No subscribers found" : "No subscribers yet"}
              </h3>
              <p className="text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Subscribers will appear here once they sign up for your newsletter"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed Date
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber._id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 flex-shrink-0">
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              {subscriber.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                          <span className="truncate">
                            {formatDate(subscriber.subscribedAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <span className="text-xs sm:text-sm text-gray-500 font-mono">
                          {subscriber._id}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {subscribers.length > 0 && (
          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Total Subscribers
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {subscribers.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
              <div className="flex items-center">
                <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Latest Subscription
                  </p>
                  <p className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                    {formatDate(
                      Math.max(
                        ...subscribers.map((s) => new Date(s.subscribedAt))
                      )
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center">
                <div className="bg-purple-100 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">Results</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {filteredSubscribers.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Modal */}
        {isEmailModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-3 min-w-0 flex-1 mr-4">
                    <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                      <Send className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                        Send Email to Subscribers
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Sending to {subscribers.length} subscribers
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeEmailModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    disabled={isSending}
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Email Form */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Enter email subject..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm sm:text-base"
                      disabled={isSending}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="body"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Body <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="body"
                      rows="8"
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Write your email content here..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-vertical text-sm sm:text-base"
                      disabled={isSending}
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end space-y-reverse space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeEmailModal}
                    className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                    disabled={isSending}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendEmailToSubscribers}
                    disabled={
                      !emailSubject.trim() || !emailBody.trim() || isSending
                    }
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isSending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterSubscribers;
