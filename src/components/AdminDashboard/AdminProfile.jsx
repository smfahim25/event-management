import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAuthStore } from "../../store/AuthStore";

function AdminProfile() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const { user: adminUser, updateUser, fetchUser: getUser } = useAuthStore();
  const [user, setUser] = useState({
    name: adminUser.name,
    email: adminUser.email,
    phone: adminUser.phone,
    address: adminUser.address,
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateUser(user);
    await getUser();
    setEditMode(false);
    setLoading(false);
    setMessage({ text: "", type: "" });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: "New passwords don't match!", type: "error" });
      return;
    }

    setLoading(true);
    await updateUser({ password: passwordData.newPassword });
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setMessage({ text: "", type: "" });
    setIsChangingPassword(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
          </div>

          {/* Message Display */}
          {message.text && (
            <div
              className={`px-6 py-3 ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Profile Info */}
          <div className="px-6 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column - Profile Info */}
              <div className="md:w-1/2">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FaUser className="mr-2" /> Personal Information
                </h2>

                <form onSubmit={handleProfileUpdate}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          name="name"
                          defaultValue={adminUser.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-100 rounded-md">
                          {adminUser.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaEnvelope className="mr-1" /> Email Address
                      </label>
                      {editMode ? (
                        <input
                          type="email"
                          name="email"
                          defaultValue={adminUser.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                          disabled={!editMode}
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-100 rounded-md">
                          {adminUser.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaPhone className="mr-1" /> Phone Number
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          name="phone"
                          defaultValue={adminUser.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-100 rounded-md">
                          {adminUser?.phone || "N/A"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaHome className="mr-1" /> Address
                      </label>
                      {editMode ? (
                        <textarea
                          name="address"
                          defaultValue={adminUser.address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          rows="3"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-100 rounded-md whitespace-pre-line">
                          {adminUser.address || "N/A"}
                        </p>
                      )}
                    </div>

                    {editMode ? (
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditMode(true)}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Right Column - Password Change */}
              <div className="md:w-1/2">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FaLock className="mr-2" /> Password Settings
                </h2>

                {isChangingPassword ? (
                  <form onSubmit={handlePasswordUpdate}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.current ? "text" : "password"}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-2.5 text-gray-500"
                            onClick={() => togglePasswordVisibility("current")}
                          >
                            {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.new ? "text" : "password"}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-2.5 text-gray-500"
                            onClick={() => togglePasswordVisibility("new")}
                          >
                            {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.confirm ? "text" : "password"}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-2.5 text-gray-500"
                            onClick={() => togglePasswordVisibility("confirm")}
                          >
                            {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                        >
                          {loading ? "Updating..." : "Update Password"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsChangingPassword(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-4">
                      For security reasons, we don&#39;t display your password.
                      You can change it here.
                    </p>
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      Change Password
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
