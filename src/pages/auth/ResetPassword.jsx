import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Shield, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Extract token from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setResetToken(token);
    } else {
      setErrors({ general: "Invalid or missing reset token" });
    }
  }, []);
  console.log(resetToken);
  const validatePassword = (pass) => {
    const minLength = pass.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid:
        minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
    };
  };

  const handleSubmit = async () => {
    const newErrors = {};

    // Check if token exists
    if (!resetToken) {
      newErrors.general = "Reset token is missing";
      setErrors(newErrors);
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = "Password does not meet requirements";
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);

      try {
        const response = await fetch(
          "https://api.lessortiesdediane.com/api/v1/auth/reset-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              newPassword: password,
              token: resetToken,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setIsSuccess(true);
          setPassword("");
          setConfirmPassword("");
        } else {
          // Handle API errors
          setErrors({
            general:
              data.message || "Failed to reset password. Please try again.",
          });
        }
      } catch {
        setErrors({
          general: "Network error. Please check your connection and try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const passwordValidation = validatePassword(password);

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Password Reset Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your password has been successfully updated. You can now sign in
            with your new password.
          </p>
          <a
            href="/login"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 inline-block"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* New Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter new password"
                disabled={!resetToken}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Password Requirements */}
          {password && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Password Requirements:
              </p>
              <div className="space-y-1">
                <div
                  className={`flex items-center text-xs ${
                    passwordValidation.minLength
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      passwordValidation.minLength
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  At least 8 characters
                </div>
                <div
                  className={`flex items-center text-xs ${
                    passwordValidation.hasUpperCase
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      passwordValidation.hasUpperCase
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  One uppercase letter
                </div>
                <div
                  className={`flex items-center text-xs ${
                    passwordValidation.hasLowerCase
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      passwordValidation.hasLowerCase
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  One lowercase letter
                </div>
                <div
                  className={`flex items-center text-xs ${
                    passwordValidation.hasNumbers
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      passwordValidation.hasNumbers
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  One number
                </div>
                <div
                  className={`flex items-center text-xs ${
                    passwordValidation.hasSpecialChar
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      passwordValidation.hasSpecialChar
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  One special character
                </div>
              </div>
            </div>
          )}

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirm new password"
                disabled={!resetToken}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !resetToken}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
