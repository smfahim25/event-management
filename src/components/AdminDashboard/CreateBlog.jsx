import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ArrowLeft, X } from "lucide-react";
import PreviewModal from "./PreviewModal";
import BlocknoteEditor from "../../blocknote/components/BlocknoteEditor";
import { useBlogStore } from "../../store/BlogStore";
import toast from "react-hot-toast";

export default function CreateBlog() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [published, setPublished] = useState(true);
  const [featuredImage, setFeaturedImage] = useState("");
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [slug, setSlug] = useState("");
  const [editorData, setEditorData] = useState("");

  const { categories, fetchCategories, createBlog } = useBlogStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const hanldeText = (text) => {
    console.log("Text changed:", text);
  };

  const handleChangeHtml = (html) => {
    setEditorData(html);
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

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
    setFeaturedImageFile(null);
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

    if (!editorData.trim()) {
      toast.error("Please add blog content");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("slug", slug || generateSlug(title));
      formData.append("category", category);
      formData.append("content", editorData);
      formData.append(
        "publishDate",
        publishDate || new Date().toISOString().split("T")[0]
      );
      formData.append("isPublished", published.toString());

      if (featuredImageFile) {
        formData.append("featuredImage", featuredImageFile);
      }

      const result = await createBlog(formData);
      if (result.success) {
        navigate("/admin/blogs");
      } else {
        toast.error(
          "Failed to create blog: " + (result.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Failed to create blog. Please try again.");
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const initialContent = [
    {
      content: [
        {
          type: "text",
          text: "Hello",
          styles: {},
        },
      ],
      children: [],
    },
  ];

  return (
    <div className="py-4">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex md:flex-row flex-col items-center justify-between gap-5 p-6 border-b">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/blogs")}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-semibold">Create New Blog</h1>
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
              Create Blog
            </button>
          </div>
        </div>

        <div className="flex md:flex-row flex-col">
          <div className="md:w-2/3 p-6">
            <input
              type="text"
              placeholder="Enter blog title..."
              value={title}
              onChange={(e) => {
                const newTitle = e.target.value;
                setTitle(newTitle);
                setSlug(generateSlug(newTitle));
              }}
              className="w-full text-2xl font-semibold border-none outline-none mb-6 placeholder-gray-400"
            />

            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm mb-2">
                <label className="text-md font-bold">🔗 Blog Slug</label>
                <span
                  className="text-blue-500"
                  title="URL-friendly version of your title"
                >
                  ℹ️
                </span>
              </div>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="blog-title-will-appear-here"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className=" text-md font-bold">Featured Image</label>
                <button
                  onClick={handleImageClick}
                  className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  📎 Upload Image
                </button>
              </div>

              {featuredImage ? (
                <div className="relative">
                  <img
                    src={featuredImage || "/placeholder.svg"}
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
              <label className="block text-md font-bold">Blog Content</label>
              <div className="mt-2 mb-5">
                <BlocknoteEditor
                  initialContent={initialContent}
                  onChangeText={hanldeText}
                  onChangeHtml={handleChangeHtml}
                  showToolbar={true}
                  onSave={() => console.log("Save clicked")}
                />
              </div>
            </div>
          </div>

          <div className="md:w-80 border-l bg-gray-50 p-6">
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
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
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
                    <span className="text-blue-500 mt-1">ℹ️</span>
                    <p>
                      Break text into smaller paragraphs and use subheadings for
                      better readability.
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
            id: "preview",
            title: title || "Enter blog title...",
            category: category || "Uncategorized",
            createdAt: new Date().toLocaleDateString(),
            updatedAt: new Date().toLocaleDateString(),
            published: published,
            slug: slug || generateSlug(title),
            content: editorData || "Compose your blog post...",
            featuredImage,
          }}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
