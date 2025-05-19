import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, Upload, Search } from "lucide-react";
import { useCategoryStore } from "../../store/CategoryStore";

export default function CategoryManagement() {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    approveCategory,
    deleteCategory,
  } = useCategoryStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: null,
  });
  const [iconPreview, setIconPreview] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setFormData({
      name: "",
      description: "",
      icon: null,
    });
    setIconPreview(null);
    setModalOpen(true);
  };

  const handleEditCategory = async (category) => {
    try {
      const categoryDetails = await fetchCategory(category._id);
      setModalOpen(true);
      setCurrentCategory(categoryDetails.data);
      setFormData({
        name: categoryDetails.data.name,
        description: categoryDetails.data.description,
        icon: null,
      });
      setIconPreview(categoryDetails.data.icon);
    } catch (error) {
      console.error("Error fetching category details:", error);
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete._id);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleApproveCategory = async (id) => {
    await approveCategory(id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        icon: file,
      });

      const reader = new FileReader();
      reader.onload = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("description", formData.description);
    if (formData.icon) {
      formPayload.append("icon", formData.icon);
    }

    try {
      if (currentCategory) {
        await updateCategory(currentCategory._id, formPayload);
      } else {
        await createCategory(formPayload);
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error submitting category:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Category Management
          </h1>
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={18} /> Add Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="w-16 h-16 border-4 rounded-full animate-spin bg-purple-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Categories Table - Responsive with horizontal scroll */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Icon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category.icon && (
                          <img
                            src={category.icon}
                            alt={category.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 truncate w-64">
                          {category.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            category.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(category)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                          {!category.isActive && (
                            <button
                              onClick={() =>
                                handleApproveCategory(category._id)
                              }
                              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium mr-2 hover:bg-green-200 transition-colors duration-150 flex items-center"
                            >
                              <Check size={18} />
                              <span>Approve</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {currentCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <div className="flex items-center space-x-4">
                    {iconPreview && (
                      <img
                        src={iconPreview}
                        alt="Icon"
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    )}
                    <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200 flex items-center">
                      <Upload size={18} className="mr-2" />
                      <span>Upload Icon</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
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
                        Processing...
                      </span>
                    ) : (
                      <span>{currentCategory ? "Update" : "Create"}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete the category &quot;
              {categoryToDelete?.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
