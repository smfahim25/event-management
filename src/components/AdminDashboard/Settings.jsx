import { useState, useEffect } from "react";
import { useSettingsStore } from "../../store/SettingsStore";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("");
  const [taxAlias, setTaxAlias] = useState("GST");
  const [taxPercentage, setTaxPercentage] = useState("12");
  const [daysBeforeProductExpiry, setDaysBeforeProductExpiry] = useState("30");
  const [address, setAddress] = useState("");

  const [logo, setLogo] = useState("/placeholder.svg?height=100&width=100");
  const [logoFile, setLogoFile] = useState(null);
  const [isLogoUploaded, setIsLogoUploaded] = useState(false);

  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryImageIndexes, setGalleryImageIndexes] = useState([]);

  const [bannerImages, setBannerImages] = useState([null, null]);
  const [bannerFiles, setBannerFiles] = useState([null, null]);

  const [certificateImage, setCertificateImage] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { settings, fetchSettings, updateSettings } = useSettingsStore();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        await fetchSettings();
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setCompanyName(settings.companyName || "");
      setTaxAlias(settings.taxAlias || "GST");
      setTaxPercentage(settings.taxPercentage?.toString() || "12");
      setDaysBeforeProductExpiry(
        settings.daysBeforeProductExpiry?.toString() || "30"
      );
      setAddress(settings.address || "");

      if (settings.companyLogo) {
        setLogo(settings.companyLogo);
        setIsLogoUploaded(true);
      }

      if (settings.galleryImages) {
        setGalleryImages(settings.galleryImages);
      }

      if (settings.galleryImageIndexes) {
        setGalleryImageIndexes(settings.galleryImageIndexes);
      }

      if (settings.bannerImages) {
        setBannerImages(settings.bannerImages);
      }

      if (settings.certificateImage) {
        setCertificateImage(settings.certificateImage);
      }
    }
  }, [settings]);

  // Company Logo Handler (Single Image)
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
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

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newGalleryFiles = [...galleryFiles, ...files];
      setGalleryFiles(newGalleryFiles);

      const startIndex =
        galleryImageIndexes.length > 0
          ? Math.max(...galleryImageIndexes) + 1
          : 1;
      const newIndexes = [...galleryImageIndexes];

      files.forEach((file, index) => {
        newIndexes.push(startIndex + index);
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setGalleryImages((prev) => [...prev, e.target.result]);
          }
        };
        reader.readAsDataURL(file);
      });

      setGalleryImageIndexes(newIndexes);
    }
  };

  const removeGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryImageIndexes((prev) => prev.filter((_, i) => i !== index));
  };

  const updateGalleryImageIndex = (imageIndex, newEventIndex) => {
    const updatedIndexes = [...galleryImageIndexes];
    updatedIndexes[imageIndex] = parseInt(newEventIndex) || 0;
    setGalleryImageIndexes(updatedIndexes);
  };

  const handleBannerChange = (e, index) => {
    const file = e.target.files?.[0];
    if (file) {
      const newBannerFiles = [...bannerFiles];
      newBannerFiles[index] = file;
      setBannerFiles(newBannerFiles);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const newBannerImages = [...bannerImages];
          newBannerImages[index] = e.target.result;
          setBannerImages(newBannerImages);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBannerImage = (index) => {
    const newBannerImages = [...bannerImages];
    const newBannerFiles = [...bannerFiles];
    newBannerImages[index] = null;
    newBannerFiles[index] = null;
    setBannerImages(newBannerImages);
    setBannerFiles(newBannerFiles);
  };

  const handleCertificateChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCertificateImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCertificateImage = () => {
    setCertificateImage(null);
    setCertificateFile(null);
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);

      const formData = new FormData();

      formData.append("companyName", companyName);
      formData.append("taxAlias", taxAlias);
      formData.append("taxPercentage", taxPercentage);
      formData.append("daysBeforeProductExpiry", daysBeforeProductExpiry);
      formData.append("address", address);

      if (logoFile) {
        formData.append("companyLogo", logoFile);
      }

      // Append gallery images with their indexes
      galleryFiles.forEach((file, index) => {
        if (file) {
          formData.append(`galleryImage_${index}`, file);
          formData.append(
            `galleryImageIndex_${index}`,
            galleryImageIndexes[index] || 0
          );
        }
      });

      bannerFiles.forEach((file, index) => {
        if (file) {
          formData.append(`bannerImage_${index}`, file);
        }
      });

      if (certificateFile) {
        formData.append("certificateImage", certificateFile);
      }

      await updateSettings(formData);
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading settings...</span>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Company Settings */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
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
        </div>

        {/* Company Logo Section (Single Image) */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Company Logo
          </h2>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 relative">
              {isLogoUploaded && (
                <button
                  onClick={() => {
                    setLogo("/placeholder.svg?height=100&width=100");
                    setLogoFile(null);
                    setIsLogoUploaded(false);
                  }}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                >
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <p className="text-sm text-gray-500 mb-2">
                    Upload your company logo
                  </p>
                </div>
              )}

              <label className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md cursor-pointer hover:bg-blue-200 transition-colors">
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
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
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="text-sm text-gray-600">
                    Recommended size: 400×200 pixels
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Gallery Images Section (Multiple Images) */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Hero Images (Multiple Upload with Postion number)
          </h2>

          <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 mb-4">
            <div className="text-center">
              <svg
                className="h-12 w-12 text-gray-400 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <p className="text-sm text-gray-500 mb-2">
                Upload multiple images for your hero section
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Set display order for each image using the event index
              </p>
              <label className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-md cursor-pointer hover:bg-green-200 transition-colors">
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add Images
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleGalleryChange}
                />
              </label>
            </div>
          </div>

          {galleryImages.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-700">
                  Uploaded Images
                </h3>
                <span className="text-sm text-gray-500">
                  {galleryImages.length} image
                  {galleryImages.length !== 1 ? "s" : ""} uploaded
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {galleryImages.map((image, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative group flex-shrink-0">
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full sm:w-32 h-32 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </button>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-1">
                            Image {index + 1}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Set the display order for this image
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <label className="text-sm font-medium text-gray-600 min-w-0">
                            Event Index:
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              max="999"
                              value={galleryImageIndexes[index] || 0}
                              onChange={(e) =>
                                updateGalleryImageIndex(index, e.target.value)
                              }
                              className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                              placeholder="0"
                            />
                            <span className="text-xs text-gray-400">
                              (0 = first)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m4 0H4m15 0v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4h14z"
                              ></path>
                            </svg>
                            Display Order: #{galleryImageIndexes[index] || 0}
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                updateGalleryImageIndex(
                                  index,
                                  Math.max(
                                    0,
                                    (galleryImageIndexes[index] || 0) - 1
                                  )
                                )
                              }
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Move up in order"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 15l7-7 7 7"
                                ></path>
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                updateGalleryImageIndex(
                                  index,
                                  (galleryImageIndexes[index] || 0) + 1
                                )
                              }
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Move down in order"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                ></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Section */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">
                  Display Order Summary
                </h4>
                <div className="text-sm text-green-700">
                  {galleryImages
                    .map((_, index) => ({
                      imageNumber: index + 1,
                      eventIndex: galleryImageIndexes[index] || 0,
                    }))
                    .sort((a, b) => a.eventIndex - b.eventIndex)
                    .map((item, sortedIndex) => (
                      <span
                        key={item.imageNumber}
                        className="inline-block mr-3 mb-1"
                      >
                        #{sortedIndex + 1}: Image {item.imageNumber} (Index:{" "}
                        {item.eventIndex})
                      </span>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Banner Images Section (Two Images) */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Inspire Images (Two Images)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1].map((index) => (
              <div
                key={index}
                className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 relative"
              >
                <h3 className="text-md font-medium text-gray-700 mb-4">
                  Banner {index + 1}
                </h3>

                {bannerImages[index] && (
                  <button
                    onClick={() => removeBannerImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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

                {bannerImages[index] ? (
                  <div className="mb-4">
                    <img
                      src={bannerImages[index]}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 mb-4">
                    <svg
                      className="h-8 w-8 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <p className="text-sm text-gray-500">No Image uploaded</p>
                  </div>
                )}

                <label className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-md cursor-pointer hover:bg-purple-200 transition-colors w-full justify-center">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  {bannerImages[index] ? "Change Image" : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleBannerChange(e, index)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate Image Section (Single Image) */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Participate Image (Single Upload)
          </h2>

          <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 relative">
            {certificateImage && (
              <button
                onClick={removeCertificateImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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

            {certificateImage ? (
              <div className="flex flex-col items-center">
                <img
                  src={certificateImage}
                  alt="Certificate"
                  className="max-h-64 max-w-full object-contain mb-4 rounded-lg"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <svg
                  className="h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <p className="text-sm text-gray-500 mb-4">Upload Images</p>
              </div>
            )}

            <div className="flex justify-center">
              <label className="inline-flex items-center px-6 py-2 bg-orange-100 text-orange-700 rounded-md cursor-pointer hover:bg-orange-200 transition-colors">
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                {certificateImage ? "Change" : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCertificateChange}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
