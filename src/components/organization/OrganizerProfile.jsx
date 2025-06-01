import { useState, useEffect, useRef } from "react";
import {
  FiAward,
  FiCalendar,
  FiCreditCard,
  FiEdit2,
  FiImage,
  FiPlus,
  FiUpload,
} from "react-icons/fi";
import { useData } from "../../context/DataContext";
import StripeDashboard from "./StripeDashboard";
import EventCard from "../ui/EventCard";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Buildings, FileText, Phone, User, X } from "phosphor-react";
import { IoMail } from "react-icons/io5";
import { FaSave } from "react-icons/fa";
import { useOrganizerStore } from "../../store/OrganizerStore";
import { useAuthStore } from "../../store/AuthStore";
import { useEventStore } from "../../store/EventStore";

const OrganizerProfile = () => {
  const { defaultTexts } = useData();
  const { profilePage } = defaultTexts;
  const {
    organizer: organizerProfile,
    getOrganizerProfile,
    updateOrganizerProfile,
    loading: organizerLoading,
  } = useOrganizerStore();
  const {
    user,
    updateUser,
    fetchUser: getUser,
    loading: userLoading,
  } = useAuthStore();

  const { events, fetchOrganizerEvents } = useEventStore();

  const [profile, setProfile] = useState({});
  const [organizerDetails, setOrganizerDetails] = useState({});
  const [editMode, setEditMode] = useState({
    user: false,
    organizer: false,
  });
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [organizerFormData, setOrganizerFormData] = useState({
    organizationName: "",
    description: "",
    website: "",
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [activeProfileTab, setActiveProfileTab] = useState("user");
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await getUser();
        await getOrganizerProfile();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadInitialData();
  }, [getUser, getOrganizerProfile]);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      });

      setUserFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }

    if (organizerProfile) {
      setOrganizerDetails(organizerProfile);
      setOrganizerFormData({
        organizationName: organizerProfile.organizationName || "",
        description: organizerProfile.description || "",
        website: organizerProfile.website || "",
      });
      if (organizerProfile.logo) {
        setLogoPreview(organizerProfile.logo);
      }
    }
  }, [user, organizerProfile]);

  const fetchCreatedEvents = async () => {
    try {
      await fetchOrganizerEvents();
    } catch (error) {
      console.error("Error fetching created events:", error);
    }
  };

  useEffect(() => {
    fetchCreatedEvents();
  }, []);

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData({
      ...userFormData,
      [name]: value,
    });
  };

  const handleOrganizerInputChange = (e) => {
    const { name, value } = e.target;
    setOrganizerFormData({
      ...organizerFormData,
      [name]: value,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerLogoUpload = () => {
    fileInputRef.current.click();
  };

  const handleSaveUserProfile = async () => {
    try {
      await updateUser(userFormData);
      await getUser();
      setEditMode({ ...editMode, user: false });
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleSaveOrganizerProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("organizationName", organizerFormData.organizationName);
      formData.append("description", organizerFormData.description);
      formData.append("website", organizerFormData.website);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      await updateOrganizerProfile(formData);
      const data = await getOrganizerProfile();
      setOrganizerDetails(data);
      setEditMode({ ...editMode, organizer: false });
      setLogoFile(null);
    } catch (error) {
      console.error("Failed to update organizer profile:", error);
    }
  };

  const handleCancelEdit = (type) => {
    setEditMode({ ...editMode, [type]: false });
    if (type === "user") {
      setUserFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    } else {
      setOrganizerFormData({
        organizationName: organizerDetails.organizationName || "",
        description: organizerDetails.description || "",
        website: organizerDetails.website || "",
      });

      setLogoPreview(organizerDetails.logo || null);
      setLogoFile(null);
    }
  };

  return (
    <>
      {/* Profile Card */}
      <div className="mb-8 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
            <div className="flex flex-col items-center sm:flex-row sm:items-center">
              <div className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 overflow-hidden rounded-full border-4 border-purple-100 shadow-md flex-shrink-0">
                <img
                  src={organizerDetails?.logo}
                  alt={organizerDetails?.organizationName}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-4 sm:mt-0 text-center sm:text-left sm:ml-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {organizerDetails.organizationName || profile.name}
                </h1>
                <p className="text-gray-500 text-sm sm:text-base truncate max-w-[250px] sm:max-w-none">
                  {profile.email}
                </p>
                <span className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  Event Organizer
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="w-full">
        <div className="flex space-x-1 rounded-md bg-muted p-1 mb-4">
          <button
            className={`flex-1 justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "profile"
                ? "bg-purple-200 text-foreground shadow-lg"
                : "text-muted-foreground shadow-md"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`flex-1 justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "events"
                ? "bg-purple-200 text-foreground shadow-lg"
                : "text-muted-foreground shadow-md"
            }`}
            onClick={() => setActiveTab("events")}
          >
            <FiCalendar className="mr-2 h-4 w-4 inline" />
            My Events
          </button>
          <button
            className={`flex-1 justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === "dashboard"
                ? "bg-purple-200 text-foreground shadow-lg"
                : "text-muted-foreground shadow-md"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FiCreditCard className="mr-2 h-4 w-4 inline" />
            Dashboard
          </button>
        </div>

        {/* Profile Tab Content */}
        <div className={activeTab === "profile" ? "block" : "hidden"}>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-4">
            <div className="flex space-x-1 rounded-md bg-muted p-1">
              <button
                className={`flex-1 justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  activeProfileTab === "user"
                    ? "bg-purple-200 text-foreground shadow-lg"
                    : "text-muted-foreground shadow-md"
                }`}
                onClick={() => setActiveProfileTab("user")}
              >
                User Details
              </button>
              <button
                className={`flex-1 justify-center rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  activeProfileTab === "organizer"
                    ? "bg-purple-200 text-foreground shadow-lg"
                    : "text-muted-foreground shadow-md"
                }`}
                onClick={() => setActiveProfileTab("organizer")}
              >
                Organizer Details
              </button>
            </div>
          </div>

          {/* User Profile Content */}
          <div className={activeProfileTab === "user" ? "block" : "hidden"}>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-800">
                      User Information
                    </h2>
                    <div>
                      {editMode.user ? (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleCancelEdit("user")}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                          >
                            <X size={16} />
                            <span>Cancel</span>
                          </button>
                          <button
                            onClick={handleSaveUserProfile}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                          >
                            <FaSave size={16} />
                            <span>Save Changes</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setEditMode({ ...editMode, user: true })
                          }
                          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors shadow-sm"
                        >
                          <FiEdit2 size={16} />
                          <span>Edit Profile</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {editMode.user ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label
                            htmlFor="fullName"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                          >
                            <User size={16} className="text-purple-500" />
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullname"
                            value={userFormData.name}
                            onChange={handleUserInputChange}
                            disabled={userLoading}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                          >
                            <IoMail size={16} className="text-purple-500" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={userFormData.email}
                            onChange={handleUserInputChange}
                            disabled={userLoading}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                            placeholder="Enter your email address"
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="phone"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                          >
                            <Phone size={16} className="text-purple-500" />
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={userFormData.phone}
                            onChange={handleUserInputChange}
                            disabled={userLoading}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                            placeholder="Enter your phone number"
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="address"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                          >
                            <Buildings size={16} className="text-purple-500" />
                            Address
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={userFormData.address}
                            onChange={handleUserInputChange}
                            disabled={userLoading}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                            placeholder="Enter your address"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                            <User size={16} className="text-purple-500" />
                            <span>Full Name</span>
                          </div>
                          <p className="text-base font-medium text-gray-800">
                            {profile.name}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                            <IoMail size={16} className="text-purple-500" />
                            <span>Email Address</span>
                          </div>
                          <p className="text-base text-gray-800">
                            {profile.email}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                            <Phone size={16} className="text-purple-500" />
                            <span>Phone Number</span>
                          </div>
                          <p className="text-base text-gray-800">
                            {profile.phone || (
                              <span className="text-gray-400 italic">
                                Not provided
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                            <Buildings size={16} className="text-purple-500" />
                            <span>Address</span>
                          </div>
                          <p className="text-base text-gray-800">
                            {profile.address || (
                              <span className="text-gray-400 italic">
                                Not provided
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Organizer Profile Content */}
          <div
            className={activeProfileTab === "organizer" ? "block" : "hidden"}
          >
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-5 p-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Organizer Information
                    </h2>
                    <div>
                      {editMode.organizer ? (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleCancelEdit("organizer")}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                          >
                            <X size={16} />
                            <span>Cancel</span>
                          </button>
                          <button
                            onClick={handleSaveOrganizerProfile}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                          >
                            <FaSave size={16} />
                            <span>Save Changes</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setEditMode({ ...editMode, organizer: true })
                          }
                          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors shadow-sm"
                        >
                          <FiEdit2 size={16} />
                          <span>Edit Organizer</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {editMode.organizer ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label
                            htmlFor="organizationName"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                          >
                            <Buildings size={16} className="text-purple-500" />
                            Organization Name
                          </label>
                          <input
                            type="text"
                            id="organizationName"
                            name="organizationName"
                            value={organizerFormData.organizationName}
                            onChange={handleOrganizerInputChange}
                            disabled={organizerLoading}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                            placeholder="Enter organization name"
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="website"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                          >
                            <IoMail size={16} className="text-purple-500" />
                            Website
                          </label>
                          <input
                            type="url"
                            id="website"
                            name="website"
                            value={organizerFormData.website}
                            onChange={handleOrganizerInputChange}
                            disabled={organizerLoading}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                            placeholder="Enter website URL"
                          />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <label
                            htmlFor="description"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                          >
                            <FileText size={16} className="text-purple-500" />
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            value={organizerFormData.description}
                            onChange={handleOrganizerInputChange}
                            disabled={organizerLoading}
                            rows={5}
                            className="w-full px-4 py-1 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none shadow-sm"
                            placeholder="Tell attendees about your organization..."
                          ></textarea>
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="logoUpload"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                          >
                            <FiImage size={16} className="text-purple-500" />
                            Organization Logo
                          </label>
                          <div className="flex flex-col md:flex-row gap-5 items-center space-y-4">
                            <input
                              type="file"
                              id="logoUpload"
                              ref={fileInputRef}
                              accept="image/*"
                              onChange={handleLogoChange}
                              className="hidden"
                            />
                            {logoPreview ? (
                              <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-purple-300 p-1">
                                <img
                                  src={logoPreview}
                                  alt="Organization logo preview"
                                  className="w-40 h-40 object-cover rounded-lg"
                                />
                              </div>
                            ) : (
                              <div className="w-40 h-40 flex items-center justify-center rounded-lg bg-gray-50 border-2 border-dashed border-purple-300">
                                <FiImage className="h-12 w-12 text-gray-300" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={triggerLogoUpload}
                              className="lg:w-1/4 h-[40px] flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors shadow-sm"
                            >
                              <FiUpload size={16} />
                              {logoPreview ? "Change Logo" : "Upload Logo"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                            <Buildings size={16} className="text-purple-500" />
                            <span>Organization Name</span>
                          </div>
                          <p className="text-base font-medium text-gray-800">
                            {organizerDetails.organizationName || (
                              <span className="text-gray-400 italic">
                                Not provided
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                            <IoMail size={16} className="text-purple-500" />
                            <span>Website</span>
                          </div>
                          <p className="text-base text-gray-800">
                            {organizerDetails.website ? (
                              <a
                                href={organizerDetails.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:underline"
                              >
                                {organizerDetails.website}
                              </a>
                            ) : (
                              <span className="text-gray-400 italic">
                                Not provided
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
                            <FileText size={16} className="text-purple-500" />
                            <span>Description</span>
                          </div>
                          <div className="rounded-lg p-2">
                            {organizerDetails.description ? (
                              <p className="text-base text-gray-800 whitespace-pre-line leading-relaxed">
                                {organizerDetails.description}
                              </p>
                            ) : (
                              <p className="text-gray-400 italic">
                                No description provided
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                            <FiAward size={16} className="text-purple-500" />
                            <span>Verification Status</span>
                          </div>
                          <p className="text-base text-gray-800">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                organizerDetails.verificationStatus ===
                                "approved"
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : organizerDetails.verificationStatus ===
                                    "pending"
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  : "bg-red-100 text-red-800 border border-red-200"
                              }`}
                            >
                              {organizerDetails.verificationStatus ||
                                "Not verified"}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Tab Content */}
        <div className={activeTab === "events" ? "block" : "hidden"}>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                {profilePage.eventsSection?.title || "My Events"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Events you have created
              </p>
            </div>
            <div className="p-6 pt-0">
              {events.length > 0 ? (
                <div className="flex flex-wrap gap-5">
                  {events.map((event) => (
                    <EventCard key={event._id} {...event} />
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg bg-gray-50">
                  <p className="text-center text-gray-500">
                    {profilePage.eventsSection?.noEvents ||
                      "You haven't created any events yet."}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center p-6 pt-0">
              <button
                onClick={() => navigate("/app/create-event")}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Create New Event
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Tab Content */}
        <div className={activeTab === "dashboard" ? "block" : "hidden"}>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                {defaultTexts.stripeDashboard?.title || "Financial Dashboard"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage your earnings and payouts
              </p>
            </div>
            <div className="p-6 pt-0">
              <StripeDashboard
                earnings={organizerDetails.earnings}
                commissionRate={organizerDetails.commissionRate}
                payoutSchedule={organizerDetails.payoutSchedule}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

OrganizerProfile.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    organization: PropTypes.string,
    bio: PropTypes.string,
    imageUrl: PropTypes.string,
  }),
};

export default OrganizerProfile;
