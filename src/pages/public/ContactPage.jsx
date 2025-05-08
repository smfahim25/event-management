import { useState } from "react";
import axios from "axios";
import Nav from "../../components/Nav";
import { useData } from "../../context/DataContext";
import {
  FaUser,
  FaEnvelope,
  FaComment,
  FaPaperPlane,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

function ContactPage() {
  const { defaultTexts } = useData();
  const { contactPage } = defaultTexts;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = contactPage.form.name.error;
    if (!formData.email.trim()) {
      newErrors.email = contactPage.form.email.error;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = contactPage.form.email.invalidError;
    }
    if (!formData.message.trim())
      newErrors.message = contactPage.form.message.error;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setSuccess("");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/feedback`,
        formData
      );
      if (response.status === 200 || response.status === 201) {
        setSuccess(contactPage.successMessage);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      setErrors({ api: contactPage.apiError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-[#E167FF]">
      <Nav />

      <div className="container mx-auto px-4 py-16 pt-32">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Contact Info */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-white">
              <h1 className="text-4xl font-bold mb-6">{contactPage.title}</h1>
              <p className="text-white/80 mb-8 text-lg">
                Have questions about our events or need assistance? We&apos;re
                here to help! Fill out the form and our team will get back to
                you as soon as possible.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <FaEnvelope className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Email Us</h3>
                    <p className="text-white/80">support@eventify.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <FaComment className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Live Chat</h3>
                    <p className="text-white/80">Available 9 AM - 5 PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <FaUser className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Customer Support</h3>
                    <p className="text-white/80">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Send us a message
                </h2>

                {/* Success Message */}
                {success && (
                  <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                    <FaCheck className="mr-2 text-green-500" />
                    <p>{success}</p>
                  </div>
                )}

                {/* API Error */}
                {errors.api && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                    <FaExclamationTriangle className="mr-2 text-red-500" />
                    <p>{errors.api}</p>
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {contactPage.form.name.label}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={contactPage.form.name.placeholder}
                        className={`pl-10 block w-full px-4 py-3 border ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {contactPage.form.email.label}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={contactPage.form.email.placeholder}
                        className={`pl-10 block w-full px-4 py-3 border ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {contactPage.form.message.label}
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                        <FaComment className="text-gray-400" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={contactPage.form.message.placeholder}
                        className={`pl-10 block w-full px-4 py-3 border ${
                          errors.message ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                      ></textarea>
                    </div>
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className={`w-full flex items-center justify-center bg-purple-600 text-white py-3 px-6 rounded-lg font-medium transition-colors ${
                      loading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-purple-700 active:bg-purple-800"
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        {contactPage.form.submitButton.loading}
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        {contactPage.form.submitButton.default}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
