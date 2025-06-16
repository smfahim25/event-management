import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, ArrowLeft, X } from "lucide-react";
import PreviewModal from "./PreviewModal";
import { useBlogStore } from "../../store/BlogStore";
import toast from "react-hot-toast";
import BlockNoteViewer from "../../blocknote/components/BlocknoteViewer";

export default function EditBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [published, setPublished] = useState(true);
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState(null);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);

  const { categories, fetchCategories, getBlogById, updateBlog } =
    useBlogStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const hanldeText = (text) => {
    console.log(text);
  };

  const handleChangeHtml = (html) => {
    setContent(html);
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const fetchBlogData = useCallback(async () => {
    try {
      setLoading(true);
      const blog = await getBlogById(id);

      if (blog) {
        setBlogData(blog);
        setTitle(blog.title || "");
        setCategory(blog.category?._id || blog.category || "");
        setSlug(blog.slug || "");
        setContent(blog.content || "");
        setFeaturedImage(blog.featuredImage || "");
        setPublished(blog.isPublished || false);

        if (blog.publishDate || blog.createdAt) {
          const dateToUse = blog.publishDate || blog.createdAt;
          const date = new Date(dateToUse);
          if (!isNaN(date.getTime())) {
            setPublishDate(date.toISOString().split("T")[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  }, [getBlogById, id]);

  useEffect(() => {
    if (id) {
      fetchBlogData();
    }
  }, [id, fetchBlogData]);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setFeaturedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFeaturedImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setFeaturedImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a blog title");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("category", category);
      formData.append("content", content);
      formData.append("slug", slug.trim());
      formData.append("isPublished", published.toString());

      if (publishDate) {
        formData.append("publishDate", publishDate);
      }

      if (featuredImageFile) {
        formData.append("featuredImage", featuredImageFile);
      } else if (featuredImage && !featuredImage.startsWith("data:")) {
        formData.append("featuredImageUrl", featuredImage);
      }

      if (updateBlog) {
        await updateBlog(id, formData);
      }

      navigate("/admin/blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Failed to save blog. Please try again.");
    }
  };
  const handlePreview = () => {
    setShowPreview(true);
  };

  useEffect(() => {
    if (title && (!slug || slug === generateSlug(blogData?.title || ""))) {
      setSlug(generateSlug(title));
    }
  }, [title, blogData, slug]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading blog data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && !blogData) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <p className="text-red-600 mb-4">Blog not found</p>
              <button
                onClick={() => navigate("/admin/blogs")}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Back to Blogs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/blogs")}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-semibold">Edit Blog Details</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
            >
              <Eye size={16} />
              Preview
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="flex md:flex-row flex-col">
          <div className="md:w-2/3 p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setTitle(newTitle);
                  setSlug(generateSlug(newTitle));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl font-semibold"
                placeholder="Enter blog title..."
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>🔗 Blog Slug</span>
                <span
                  className="text-blue-500 cursor-help"
                  title="URL-friendly version of your title"
                >
                  ℹ️
                </span>
              </div>
              <input
                type="text"
                value={slug}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="blog-url-slug"
              />
              <p className="text-xs text-gray-500 mt-1">
                Preview URL: /blog/{slug || "blog-url-slug"}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Featured Image
                </label>
                <button
                  onClick={handleImageClick}
                  className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
                >
                  📎 Upload Image
                </button>
              </div>

              {featuredImage ? (
                <div className="relative">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 border"
                  >
                    <X size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={handleImageClick}
                    className="absolute bottom-2 right-2 px-3 py-1 bg-white rounded-md shadow-md hover:bg-gray-100 border text-sm"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <div
                  onClick={handleImageClick}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <div className="text-gray-400 mb-2 text-4xl">📁</div>
                  <p className="text-gray-600 mb-1">
                    Click to upload a featured image
                  </p>
                  <p className="text-sm text-gray-400">
                    SVG, PNG, JPG or GIF (Max 2MB)
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="mb-6">
              <label className="block text-md font-bold  mb-2">
                Blog Content
              </label>
              <div className="mt-2 mb-5">
                <BlockNoteViewer
                  html={content}
                  onHtmlChange={handleChangeHtml}
                  onChangeText={hanldeText}
                />
              </div>
            </div>
          </div>

          <div className="w-80 border-l bg-gray-50 p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Blog Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      🏷️ Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      📅 Publish Date
                    </label>
                    <input
                      type="date"
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="publish"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="publish"
                      className="text-sm font-medium text-gray-700"
                    >
                      Publish this blog
                    </label>
                  </div>
                </div>
              </div>

              {blogData && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Blog Info</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(blogData.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>{" "}
                      {new Date(blogData.updatedAt).toLocaleDateString()}
                    </div>
                    {blogData.author && (
                      <div>
                        <span className="font-medium">Author:</span>{" "}
                        {blogData.author.name || blogData.author}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-4">Help & Tips</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">ℹ️</span>
                    <p>
                      Use a compelling title that grabs attention and includes
                      keywords.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✅</span>
                    <p>
                      The slug will be auto-generated from your title, but you
                      can customize it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <PreviewModal
          blog={{
            id: id,
            title,
            category: categories.find((cat) => cat._id === category) || {
              name: category,
            },
            createdAt: blogData?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            published,
            slug,
            content,
            featuredImage,
          }}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
