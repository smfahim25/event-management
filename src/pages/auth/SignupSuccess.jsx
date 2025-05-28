import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaEnvelope } from "react-icons/fa";

function SignupSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center">
            <FaCheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
            Registration Successful!
          </h1>
          <div className="mt-6 flex items-center justify-center text-gray-600">
            <FaEnvelope className="mr-2 h-5 w-5" />
            <p className="text-lg">Please check your email inbox</p>
          </div>
          <p className="mt-2 text-gray-600">
            We&#39;ve sent a verification link to your email address. Click the
            link to verify your account.
          </p>

          <div className="mt-10">
            <button
              onClick={() => navigate("/")}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupSuccess;
