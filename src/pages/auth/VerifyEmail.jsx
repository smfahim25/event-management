import { useState, useEffect } from "react";
import {
  Mail,
  CheckCircle,
  XCircle,
  Loader,
  Home,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

const EmailVerificationPage = () => {
  const [verificationState, setVerificationState] = useState("loading");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
      try {
        const payload = JSON.parse(atob(urlToken.split(".")[1]));
        if (payload.email) {
          setUserEmail(payload.email);
        }
      } catch (error) {
        console.log("Could not decode token for email extraction", error);
        setUserEmail("user@example.com");
      }

      verifyEmail(urlToken);
    } else {
      setVerificationState("failed");
      setMessage("No verification token found in URL");
    }
  }, []);

  const verifyEmail = async (token) => {
    try {
      setVerificationState("loading");

      const response = await fetch(
        `${API_BASE}/auth/verify-email?token=${token}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      // Simulate different responses for demo
      setTimeout(() => {
        const randomOutcome = Math.random();
        if (randomOutcome > 0.3) {
          setVerificationState("success");
          setMessage(
            "Your email has been successfully verified! You can now access all features of your account."
          );
        } else {
          setVerificationState("failed");
          setMessage(
            "Email verification failed. The link may have expired or is invalid."
          );
        }
      }, 2000);
    } catch (error) {
      console.error("Email verification error:", error);
      setVerificationState("failed");
      setMessage(
        "An error occurred while verifying your email. Please try again or contact support."
      );
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const renderLoadingState = () => (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Loader className="w-10 h-10 text-violet-600 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Verifying Your Email
            </h1>
            <p className="text-gray-600 text-lg">
              Please wait while we verify your email address...
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-3 text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
              <Mail className="w-5 h-5 text-violet-500" />
              <span className="font-medium">{userEmail}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-500 to-purple-500 h-3 rounded-full animate-pulse transition-all duration-1000"
                style={{ width: "75%" }}
              ></div>
            </div>

            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 text-center transform hover:scale-105 transition-transform duration-300">
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              Email Verified Successfully!
            </h1>
            <p className="text-gray-600 text-lg mb-6">{message}</p>
            <div className="flex items-center justify-center space-x-3 text-sm text-gray-600 bg-green-50 rounded-xl p-4">
              <Mail className="w-5 h-5 text-green-500" />
              <span className="font-medium">{userEmail}</span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoHome}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5" />
              <span>Go to Dashboard</span>
            </button>

            <button
              onClick={handleGoToLogin}
              className="w-full border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 hover:bg-gray-50 transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Login</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
              <span className="font-medium">
                Account verified and ready to use
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFailedState = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-red-100 to-rose-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3">
              Email Verification Failed
            </h1>
            <p className="text-gray-600 text-lg mb-6">{message}</p>
            <div className="flex items-center justify-center space-x-3 text-sm text-gray-600 bg-red-50 rounded-xl p-4">
              <Mail className="w-5 h-5 text-red-500" />
              <span className="font-medium">{userEmail}</span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoToLogin}
              className="w-full border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 hover:bg-gray-50 transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Login</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="bg-amber-50 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-amber-800 mb-2">
                    Common issues:
                  </p>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>
                      • Verification link may have expired (valid for 7 days)
                    </li>
                    <li>• Link may have been used already</li>
                    <li>• Email may be already verified</li>
                    <li>• Network connectivity issues</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {verificationState === "loading" && renderLoadingState()}
      {verificationState === "success" && renderSuccessState()}
      {verificationState === "failed" && renderFailedState()}
    </>
  );
};

export default EmailVerificationPage;
