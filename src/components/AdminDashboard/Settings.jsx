import { useState, useEffect } from "react";
import { useSettingsStore } from "../../store/SettingsStore";
import ColorPickerInput from "./ColorPicker";

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
  const [galleryTitles, setGalleryTitles] = useState([]);
  const [galleryPositions, setGalleryPositions] = useState([]);

  const [bannerImages, setBannerImages] = useState([null, null]);
  const [bannerFiles, setBannerFiles] = useState([null, null]);

  const [certificateImage, setCertificateImage] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sliders, setSliders] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState(null);

  const [themeColor, setThemeColor] = useState("black");

  const {
    settings,
    sliders: heroslider,
    fetchSettings,
    updateSettings,
    fetchSliders,
    createSlider,
    updateSlider,
    deleteSlider,
  } = useSettingsStore();

  const generateRandomTitle = () => {
    const adjectives = [
      "Amazing",
      "Beautiful",
      "Creative",
      "Delightful",
      "Elegant",
      "Fantastic",
      "Gorgeous",
      "Inspiring",
      "Joyful",
      "Lovely",
    ];
    const nouns = [
      "Slider",
      "Image",
      "Banner",
      "Display",
      "Showcase",
      "Presentation",
      "Exhibit",
      "Feature",
      "Highlight",
      "Preview",
    ];

    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdj} ${randomNoun}`;
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        await fetchSettings();
        await fetchSliders();
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (heroslider) {
      setSliders(heroslider);

      if (heroslider && heroslider.length > 0) {
        const images = heroslider.map((slider) => slider.image);
        const titles = heroslider.map(
          (slider) => slider.title || generateRandomTitle()
        );
        const positions = heroslider.map(
          (slider) => slider.position || heroslider.indexOf(slider) + 1
        );

        setGalleryImages(images);
        setGalleryTitles(titles);
        setGalleryPositions(positions);
      }
    }
  }, [heroslider]);

  useEffect(() => {
    if (settings) {
      setCompanyName(settings.companyName || "");
      setTaxAlias(settings.taxAlias || "GST");
      setTaxPercentage(settings.taxPercentage?.toString() || "12");
      setDaysBeforeProductExpiry(
        settings.daysBeforeProductExpiry?.toString() || "30"
      );
      setAddress(settings.address || "");
      setThemeColor(settings?.navbarColor);

      if (settings.companyLogo) {
        setLogo(settings.companyLogo);
        setIsLogoUploaded(true);
      }

      // Initialize banner images from settings
      if (settings.infoFirstImage || settings.infoSecondImage) {
        setBannerImages([
          settings.infoFirstImage || null,
          settings.infoSecondImage || null,
        ]);
      }

      if (settings.marqueeImage) {
        setCertificateImage(settings.marqueeImage);
      }
    }
  }, [settings]);

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
      const newGalleryFiles = [...galleryFiles];
      const newGalleryImages = [...galleryImages];
      const newGalleryTitles = [...galleryTitles];
      const newGalleryPositions = [...galleryPositions];

      // Find the highest current position to start numbering new images
      const highestPosition = Math.max(...galleryPositions, 0);

      files.forEach((file, index) => {
        newGalleryFiles.push(file);
        newGalleryTitles.push(generateRandomTitle());
        newGalleryPositions.push(highestPosition + index + 1);

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newGalleryImages.push(e.target.result);
            setGalleryImages([...newGalleryImages]);
          }
        };
        reader.readAsDataURL(file);
      });

      setGalleryFiles(newGalleryFiles);
      setGalleryTitles(newGalleryTitles);
      setGalleryPositions(newGalleryPositions);
    }
  };

  const confirmDeleteSlider = (index) => {
    setSliderToDelete(index);
    setShowDeleteModal(true);
  };

  const handleDeleteSlider = async () => {
    if (sliderToDelete !== null) {
      try {
        if (sliders[sliderToDelete]?._id) {
          await deleteSlider(sliders[sliderToDelete]._id);
        }

        const newGalleryImages = [...galleryImages];
        const newGalleryFiles = [...galleryFiles];
        const newGalleryTitles = [...galleryTitles];
        const newGalleryPositions = [...galleryPositions];
        const newSliders = [...sliders];

        newGalleryImages.splice(sliderToDelete, 1);
        newGalleryFiles.splice(sliderToDelete, 1);
        newGalleryTitles.splice(sliderToDelete, 1);
        newGalleryPositions.splice(sliderToDelete, 1);
        newSliders.splice(sliderToDelete, 1);

        setGalleryImages(newGalleryImages);
        setGalleryFiles(newGalleryFiles);
        setGalleryTitles(newGalleryTitles);
        setGalleryPositions(newGalleryPositions);
        setSliders(newSliders);
      } catch (error) {
        console.error("Failed to delete slider:", error);
      } finally {
        setShowDeleteModal(false);
        setSliderToDelete(null);
      }
    }
  };

  const updateGalleryTitle = (index, newTitle) => {
    const newTitles = [...galleryTitles];
    newTitles[index] = newTitle;
    setGalleryTitles(newTitles);
  };

  const updateGalleryPosition = (index, newPosition) => {
    const position = Math.max(1, parseInt(newPosition) || 1);

    const newPositions = [...galleryPositions];
    newPositions[index] = position;
    setGalleryPositions(newPositions);
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

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);

      const settingsFormData = new FormData();
      settingsFormData.append("companyName", companyName);
      settingsFormData.append("taxAlias", taxAlias);
      settingsFormData.append("taxPercentage", taxPercentage);
      settingsFormData.append(
        "daysBeforeProductExpiry",
        daysBeforeProductExpiry
      );
      settingsFormData.append("address", address);
      settingsFormData.append("navbarColor", themeColor);

      if (logoFile) {
        settingsFormData.append("companyLogo", logoFile);
      }

      bannerFiles.forEach((file, index) => {
        if (file) {
          if (index === 0) {
            settingsFormData.append("infoFirstImage", file);
          } else if (index === 1) {
            settingsFormData.append("infoSecondImage", file);
          }
        }
      });

      if (certificateFile) {
        settingsFormData.append("marqueeImage", certificateFile);
      }

      await updateSettings(settingsFormData);

      const maxLength = Math.max(
        galleryFiles.length,
        sliders?.length || 0,
        galleryImages.length
      );

      for (let i = 0; i < maxLength; i++) {
        if (!galleryFiles[i] && (!sliders[i] || !galleryTitles[i])) {
          continue;
        }

        const formData = new FormData();

        if (galleryFiles[i]) {
          formData.append("image", galleryFiles[i]);
        }

        if (galleryPositions[i] !== undefined) {
          formData.append("position", galleryPositions[i].toString());
        }

        if (galleryTitles[i]) {
          formData.append("title", galleryTitles[i]);
        } else if (!galleryFiles[i]) {
          formData.append("title", generateRandomTitle());
        }

        if (i < sliders?.length && sliders[i]?._id) {
          if (
            galleryFiles[i] ||
            galleryTitles[i] ||
            galleryPositions[i] !== undefined
          ) {
            await updateSlider(sliders[i]._id, formData);
          }
        } else if (galleryFiles[i]) {
          await createSlider(formData);
        }
      }

      // Fetch updated sliders
      const updatedSliders = await fetchSliders();
      setSliders(updatedSliders);
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
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this slider image?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSlider}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

            <div className="bg-white rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Navbar Color
                  </label>
                  <ColorPickerInput
                    color={themeColor}
                    onChange={(newColor) => setThemeColor(newColor)}
                  />
                </div>
              </div>
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
            Slider Images
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
                Upload multiple images for your slider section
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
                Add Slider Images
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
                  Slider Images
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
                          alt={`Slider ${index + 1}`}
                          className="w-full sm:w-32 h-32 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => confirmDeleteSlider(index)}
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
                            Slider {index + 1}
                          </h4>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Title:
                          </label>
                          <input
                            type="text"
                            value={galleryTitles[index] || ""}
                            onChange={(e) =>
                              updateGalleryTitle(index, e.target.value)
                            }
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="Slider title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Position:
                          </label>
                          <input
                            type="number"
                            defaultValue={galleryPositions[index] || index + 1}
                            onChange={(e) =>
                              updateGalleryPosition(index, e.target.value)
                            }
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Banner Images Section (Two Images) */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Info Images
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1].map((index) => (
              <div
                key={index}
                className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 relative"
              >
                <h3 className="text-md font-medium text-gray-700 mb-4">
                  {index === 0 ? "First Info Image" : "Second Info Image"}
                </h3>

                {bannerImages[index] ? (
                  <div className="mb-4">
                    <img
                      src={bannerImages[index]}
                      alt={
                        index === 0 ? "First Info Image" : "Second Info Image"
                      }
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                ) : settings &&
                  settings[`info${index === 0 ? "First" : "Second"}Image`] ? (
                  <div className="mb-4">
                    <img
                      src={
                        settings[`info${index === 0 ? "First" : "Second"}Image`]
                      }
                      alt={
                        index === 0 ? "First Info Image" : "Second Info Image"
                      }
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
                  {bannerImages[index] ||
                  (settings &&
                    settings[`info${index === 0 ? "First" : "Second"}Image`])
                    ? "Change Image"
                    : "Upload Image"}
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
            Marquee Image (Single Upload)
          </h2>

          <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 relative">
            {certificateImage ? (
              <div className="flex flex-col items-center">
                <img
                  src={certificateImage}
                  alt="Marquee"
                  className="max-h-64 max-w-full object-contain mb-4 rounded-lg"
                />
              </div>
            ) : settings?.marqueeImage ? (
              <div className="flex flex-col items-center">
                <img
                  src={settings.marqueeImage}
                  alt="Marquee"
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
                {certificateImage || settings?.marqueeImage
                  ? "Change"
                  : "Upload"}
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
