import { Home, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StripeConnectFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-red-400 to-rose-500 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
            Connection Failed
          </h1>

          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            We couldn&#39;t connect your Stripe account at this time. This might
            be due to incomplete information or a temporary issue.
          </p>

          <div className="bg-red-50 rounded-xl p-4 mb-8 text-left">
            <h3 className="font-semibold text-red-800 mb-3 text-center">
              Common Issues:
            </h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Incomplete business information</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Invalid bank account details</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Network connectivity issues</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeConnectFailure;
