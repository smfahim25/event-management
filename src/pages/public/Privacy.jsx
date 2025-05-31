import { useEffect, useState } from "react";
import { useSettingsStore } from "../../store/SettingsStore";
import {
  Shield,
  Eye,
  Lock,
  Calendar,
  Clock,
  Mail,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicyPage = () => {
  const { policy, fetchPolicy, loading } = useSettingsStore();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    fetchPolicy("privacyPolicy");

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const parseMarkdown = (content) => {
    if (!content) return "";

    let html = content

      .replace(/### \*\*(.*?)\*\*/g, "<h3>$1</h3>")
      .replace(/## \*\*(.*?)\*\*/g, "<h2>$1</h2>")
      .replace(/### (.*?)$/gm, "<h3>$1</h3>")
      .replace(/## (.*?)$/gm, "<h2>$1</h2>")

      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

      .replace(/---/g, "<hr />")

      .replace(/^\* (.*?)$/gm, "<li>$1</li>")

      .replace(/(<li>.*<\/li>)/gs, (match) => {
        return "<ul>" + match + "</ul>";
      })

      .replace(/\n\n/g, "</p><p>")
      .replace(/^\s*$/gm, "");

    html = "<p>" + html + "</p>";

    html = html.replace(/<p><\/p>/g, "").replace(/<p>\s*<\/p>/g, "");

    return html;
  };

  const policys = policy?.find((p) => p.page === "privacyPolicy");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="text-center z-10">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-2xl font-light">
            Loading terms and conditions...
          </div>
        </div>
      </div>
    );
  }

  if (!policys) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="text-center z-10">
          <Shield className="w-16 h-16 text-white/70 mx-auto mb-4 animate-bounce" />
          <div className="text-white text-2xl font-light">
            No privacy policy found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-50 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-50 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating header with parallax effect */}
      <div
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-sm"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-gray-800 font-semibold text-lg">
              Privacy Policy
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-gray-600 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Updated {formatDate(policy[0].updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 backdrop-blur-md rounded-2xl mb-8 border border-gray-200 shadow-lg">
            <Lock className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extralight text-gray-800 mb-6 tracking-tight">
            Privacy
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-light">
              {" "}
              Policy
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your privacy matters to us. Learn how we protect, collect, and use
            your information.
          </p>
          <ChevronDown className="w-6 h-6 text-gray-400 mx-auto mt-8 animate-bounce" />
        </div>

        {/* Policy Metadata Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="group bg-gray-50/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200 hover:bg-gray-100/80 transition-all duration-500 hover:scale-105 shadow-sm hover:shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Created</p>
                <p className="text-gray-800 font-semibold">
                  {formatDate(policy[0].createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-gray-50/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200 hover:bg-gray-100/80 transition-all duration-500 hover:scale-105 shadow-sm hover:shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Effective</p>
                <p className="text-gray-800 font-semibold">
                  {formatDate(policy[0].effectiveDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-gray-50/80 backdrop-blur-md rounded-3xl p-6 border border-gray-200 hover:bg-gray-100/80 transition-all duration-500 hover:scale-105 shadow-sm hover:shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Updated</p>
                <p className="text-gray-800 font-semibold">
                  {formatDate(policy[0].updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Content */}
        <div className="bg-white backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Privacy Protection
                </h2>
                <p className="text-blue-100">
                  Effective as of {formatDate(policy[0].effectiveDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 bg-gray-50/30">
            <div
              className="prose prose-lg prose-slate max-w-none"
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(policy[0].content),
              }}
            />
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50/80 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-gray-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">
                Questions?
              </h3>
            </div>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              This policy is effective as of{" "}
              {formatDate(policy[0].effectiveDate)} and was last updated on{" "}
              {formatDate(policy[0].updatedAt)}.
            </p>
            <Link
              to={"/contact-us"}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .prose h2 {
          color: #1e293b;
          font-size: 2.25rem;
          font-weight: 700;
          margin: 3rem 0 1.5rem 0;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;
        }

        .prose h2::after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          width: 4rem;
          height: 4px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 2px;
        }

        .prose h3 {
          color: #475569;
          font-size: 1.75rem;
          font-weight: 600;
          margin: 2rem 0 1rem 0;
          position: relative;
          padding-left: 1rem;
        }

        .prose h3::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 1.5rem;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          border-radius: 2px;
        }

        .prose p {
          margin-bottom: 1.5rem;
          text-align: justify;
          line-height: 1.8;
          color: #374151;
        }

        .prose ul {
          margin: 1.5rem 0 1.5rem 0;
          padding-left: 0;
        }

        .prose li {
          margin-bottom: 0.75rem;
          padding: 0.75rem 1rem 0.75rem 3rem;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 12px;
          border-left: 4px solid #3b82f6;
          list-style: none;
          position: relative;
          transition: all 0.3s ease;
        }

        .prose li:hover {
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          transform: translateX(4px);
        }

        .prose li::before {
          content: '✓';
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.5rem;
          height: 1.5rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .prose hr {
          border: none;
          height: 4px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
          margin: 3rem 0;
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }

        .prose hr::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .prose strong {
          font-weight: 600;
          background: linear-gradient(135deg, #1e293b, #475569);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @media (max-width: 768px) {
          .prose h2 {
            font-size: 1.875rem;
          }
          
          .prose h3 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicyPage;
