import { X } from "lucide-react";

export default function PreviewModal({ blog, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Blog Preview</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto">
          <article className="max-w-3xl mx-auto p-8">
            {/* Blog Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {blog.category?.name || blog.category}
                </span>
                <span>•</span>
                <span> {new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {blog.title}
              </h1>

              {blog.featuredImage && (
                <img
                  src={blog.featuredImage || "/placeholder.svg"}
                  alt={blog.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
            </header>

            <div className="blog-content">
              <style>{`
                .blog-content {
                  line-height: 1.7;
                  color: #374151;
                }

                .blog-content h1 {
                  font-size: 2.25rem;
                  font-weight: 700;
                  margin: 2rem 0 1rem 0;
                  color: #111827;
                  line-height: 1.2;
                }

                .blog-content h2 {
                  font-size: 1.875rem;
                  font-weight: 600;
                  margin: 1.75rem 0 0.75rem 0;
                  color: #111827;
                  line-height: 1.3;
                }

                .blog-content h3 {
                  font-size: 1.5rem;
                  font-weight: 600;
                  margin: 1.5rem 0 0.5rem 0;
                  color: #111827;
                  line-height: 1.4;
                }

                .blog-content h4 {
                  font-size: 1.25rem;
                  font-weight: 600;
                  margin: 1.25rem 0 0.5rem 0;
                  color: #111827;
                }

                .blog-content h5 {
                  font-size: 1.125rem;
                  font-weight: 600;
                  margin: 1rem 0 0.5rem 0;
                  color: #111827;
                }

                .blog-content h6 {
                  font-size: 1rem;
                  font-weight: 600;
                  margin: 1rem 0 0.5rem 0;
                  color: #111827;
                }

                .blog-content p {
                  margin: 1rem 0;
                  line-height: 1.7;
                }

                .blog-content ul {
                  margin: 1rem 0;
                  padding-left: 1.5rem;
                  list-style-type: disc;
                }

                .blog-content ol {
                  margin: 1rem 0;
                  padding-left: 1.5rem;
                  list-style-type: decimal;
                }

                .blog-content li {
                  margin: 0.5rem 0;
                  line-height: 1.6;
                }

                .blog-content li ul {
                  margin: 0.5rem 0;
                  list-style-type: circle;
                }

                .blog-content li ol {
                  margin: 0.5rem 0;
                  list-style-type: lower-alpha;
                }

                .blog-content a {
                  color: #3b82f6;
                }

                .blog-content a:hover {
                  color: #1d4ed8;
                }

                .blog-content strong {
                  font-weight: 800;
                }

                .blog-content em {
                  font-style: italic;
                }

                .blog-content blockquote {
                  border-left: 4px solid #e5e7eb;
                  padding-left: 1rem;
                  margin: 1.5rem 0;
                  font-style: italic;
                  color: #6b7280;
                  background-color: #f9fafb;
                  padding: 1rem;
                  border-radius: 0.25rem;
                }

                .blog-content code {
                  background-color: #f3f4f6;
                  padding: 0.125rem 0.25rem;
                  border-radius: 0.25rem;
                  font-family: "Courier New", monospace;
                  font-size: 0.875rem;
                  color: #dc2626;
                }

                .blog-content pre {
                  background-color: #1f2937;
                  color: #f9fafb;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  margin: 1rem 0;
                  overflow-x: auto;
                  font-family: "Courier New", monospace;
                  font-size: 0.875rem;
                  line-height: 1.5;
                }

                .blog-content pre code {
                  background-color: transparent;
                  padding: 0;
                  color: inherit;
                }

                .blog-content img {
                  max-width: 100%;
                  height: auto;
                  margin: 1.5rem 0;
                  border-radius: 0.5rem;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }

                .blog-content table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 1.5rem 0;
                  border: 1px solid #e5e7eb;
                }

                .blog-content th {
                  background-color: #f9fafb;
                  padding: 0.75rem;
                  text-align: left;
                  font-weight: 600;
                  border-bottom: 1px solid #e5e7eb;
                }

                .blog-content td {
                  padding: 0.75rem;
                  border-bottom: 1px solid #e5e7eb;
                }

                .blog-content hr {
                  margin: 2rem 0;
                  border: none;
                  border-top: 1px solid #e5e7eb;
                }

                .blog-content iframe {
                  max-width: 100%;
                  margin: 1rem 0;
                }

                .blog-content video {
                  max-width: 100%;
                  height: auto;
                  margin: 1.5rem 0;
                  border-radius: 0.5rem;
                }

                .blog-content sup {
                  vertical-align: super;
                  font-size: 0.75rem;
                }

                .blog-content sub {
                  vertical-align: sub;
                  font-size: 0.75rem;
                }

                .blog-content mark {
                  background-color: #fef3c7;
                  padding: 0.125rem 0.25rem;
                  border-radius: 0.125rem;
                }

                .blog-content del {
                  text-decoration: line-through;
                  color: #6b7280;
                }

                .blog-content ins {
                  text-decoration: underline;
                  background-color: #dcfce7;
                  padding: 0.125rem 0.25rem;
                  border-radius: 0.125rem;
                }

                .blog-content small {
                  font-size: 0.875rem;
                  color: #6b7280;
                }

                .blog-content figure {
                  margin: 1.5rem 0;
                  text-align: center;
                }

                .blog-content figcaption {
                  font-size: 0.875rem;
                  color: #6b7280;
                  margin-top: 0.5rem;
                  font-style: italic;
                }

                .blog-content details {
                  margin: 1rem 0;
                  padding: 1rem;
                  border: 1px solid #e5e7eb;
                  border-radius: 0.5rem;
                  background-color: #f9fafb;
                }

                .blog-content summary {
                  font-weight: 600;
                  cursor: pointer;
                  margin-bottom: 0.5rem;
                }

                .blog-content kbd {
                  background-color: #f3f4f6;
                  border: 1px solid #d1d5db;
                  border-radius: 0.25rem;
                  padding: 0.125rem 0.25rem;
                  font-family: "Courier New", monospace;
                  font-size: 0.75rem;
                  font-weight: 600;
                }
              `}</style>

              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>

            {/* Blog Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  <p>
                    Published on {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                  {blog.updatedAt !== blog.createdAt && (
                    <p>
                      Last updated on{" "}
                      {new Date(blog.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      blog.published || blog.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {blog.published || blog.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
}
