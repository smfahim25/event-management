import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Edit, Eye, Trash2, Plus, Filter } from "lucide-react";
import PreviewModal from "./PreviewModal";
import { useBlogStore } from "../../store/BlogStore";

export default function BlogsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const {
    categories,
    blogs,
    meta,
    loading,
    fetchCategories,
    fetchBlogs,
    deleteBlog,
  } = useBlogStore();

  useEffect(() => {
    fetchCategories();
    fetchBlogs(currentPage, entriesPerPage);
  }, [currentPage, entriesPerPage, fetchCategories, fetchBlogs]);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePreview = (blog) => {
    setPreviewBlog(blog);
  };

  const handleEdit = (blog) => {
    navigate(`/admin/blogs/edit/${blog._id}`);
  };

  const handleDeleteClick = (id) => {
    setBlogToDelete(id);
    setDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBlog(blogToDelete);
      await fetchBlogs(currentPage, entriesPerPage);
      setDeleteConfirmModal(false);
      setBlogToDelete(null);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmModal(false);
    setBlogToDelete(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEntriesPerPageChange = (newLimit) => {
    setEntriesPerPage(newLimit);
    setCurrentPage(1);
  };

  const generatePaginationButtons = () => {
    const buttons = [];
    const totalPages = meta?.totalPages || 1;

    // For mobile, show fewer buttons
    const isMobile = window.innerWidth < 640;
    const maxButtons = isMobile ? 3 : 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
              currentPage === i
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {i}
          </button>
        );
      }
      return buttons;
    }

    if (currentPage > 2 && !isMobile) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          1
        </button>
      );
      if (currentPage > 3) {
        buttons.push(
          <span key="dots1" className="px-1 sm:px-2 text-xs sm:text-sm">
            ...
          </span>
        );
      }
    }

    const start = Math.max(1, currentPage - (isMobile ? 1 : 2));
    const end = Math.min(totalPages, currentPage + (isMobile ? 1 : 2));

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
            currentPage === i
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - 1 && !isMobile) {
      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="dots2" className="px-1 sm:px-2 text-xs sm:text-sm">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 border-b">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Blogs
          </h1>
          <button
            onClick={() => navigate("/admin/blogs/create")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            Add New
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 sm:p-6 border-b">
          {/* Mobile Filter Toggle */}
          <div className="sm:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          {/* Search and Category Filter */}
          <div
            className={`flex flex-col sm:flex-row gap-4 ${
              showFilters || "hidden sm:flex"
            }`}
          >
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer w-full sm:w-auto"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading blogs...</div>
          </div>
        )}

        {!loading && (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blog Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                      <tr
                        key={blog.id || blog._id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {blog.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {blog.category?.name || blog.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(blog.updatedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              blog.isPublished
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {blog.isPublished ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(blog)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handlePreview(blog)}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="Preview"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(blog._id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No blogs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden">
              {filteredBlogs.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredBlogs.map((blog) => (
                    <div key={blog.id || blog._id} className="p-4 sm:p-6">
                      <div className="flex flex-col space-y-3">
                        {/* Title and Status */}
                        <div className="flex items-start justify-between">
                          <h3 className="text-sm sm:text-base font-medium text-gray-900 flex-1 pr-4">
                            {blog.title}
                          </h3>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                              blog.isPublished
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {blog.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>

                        {/* Category */}
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Category:</span>{" "}
                          {blog.category?.name || blog.category}
                        </div>

                        {/* Dates */}
                        <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                          <span>
                            Created:{" "}
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                          <span>
                            Updated:{" "}
                            {new Date(blog.updatedAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                          <button
                            onClick={() => handleEdit(blog)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handlePreview(blog)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                          >
                            <Eye size={14} />
                            Preview
                          </button>
                          <button
                            onClick={() => handleDeleteClick(blog._id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">
                  No blogs found
                </div>
              )}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && meta && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t">
            {/* Entries per page and info */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) =>
                    handleEntriesPerPageChange(Number(e.target.value))
                  }
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-gray-700">entries</span>
              </div>

              <div className="text-gray-700 text-center sm:text-left">
                Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
                {Math.min(currentPage * entriesPerPage, meta.totalCount || 0)}{" "}
                of {meta.totalCount || 0} entries
              </div>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>

              <div className="flex items-center gap-1">
                {generatePaginationButtons()}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= (meta?.totalPages || 1)}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewBlog && (
        <PreviewModal blog={previewBlog} onClose={() => setPreviewBlog(null)} />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors order-1 sm:order-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
