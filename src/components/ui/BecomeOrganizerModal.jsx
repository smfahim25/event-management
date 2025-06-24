import { Users, Calendar, Heart, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav";
import Footer from "../Footer";

const OrganizerPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <Nav />
      <div className="relative h-64 bg-gradient-to-r from-purple-600 to-indigo-600 mt-24">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Become an organizer with
            </h1>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Les Sorties de Diane
            </h2>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Subtitle */}
        <div className="text-center mb-12">
          <p className="text-xl text-gray-700 font-medium mb-4">
            Join a dynamic and passionate community
          </p>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Do you enjoy creating unique and convivial moments? Do you want to
            share your passion for event planning and providing memorable
            experiences for others?
          </p>
        </div>

        {/* Community image */}
        <div className="flex justify-center mb-12">
          <img
            src="https://www.naboo.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhero.549ef334.webp&w=1920&q=100"
            alt="Community gathering"
            className="rounded-xl shadow-xl max-w-full h-auto max-h-96 object-cover"
          />
        </div>

        <div className="text-center mb-12">
          <button
            onClick={() => navigate("/app/create-organizer")}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-xl transition-all font-medium shadow-lg text-white text-lg transform hover:scale-105 border border-white mb-8"
          >
            Proceed to Organizer Form
          </button>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join Les Sorties de Diane as an organizer and become part of a
            community committed to creating authentic and inspiring encounters.
          </p>
        </div>

        {/* Why become an organizer section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Why become an organizer?
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-6 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <Lightbulb className="w-10 h-10 text-purple-600" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">
                  Express your creativity
                </h4>
                <p className="text-gray-600">
                  Design and host events that reflect your personality, in line
                  with your desires and ideas.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <Heart className="w-10 h-10 text-pink-600" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">
                  Share your passions
                </h4>
                <p className="text-gray-600">
                  Whether it&apos;s gastronomy, culture, wellness, or other
                  themes, share what inspires you.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">
                  Expand your network
                </h4>
                <p className="text-gray-600">
                  Meet people with similar interests and expand your social and
                  professional circle.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <Calendar className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">
                  Receive support
                </h4>
                <p className="text-gray-600">
                  Benefit from the support and advice of the Les Sorties de
                  Diane team to help you organize your events.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-md mx-auto mb-10">
          <button
            onClick={() => navigate("/app/create-organizer")}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-xl transition-all font-medium shadow-lg text-white text-lg transform hover:scale-105"
          >
            Proceed to Organizer Form
          </button>
        </div>

        {/* How it works section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            How does it work?
          </h3>

          <div className="space-y-6">
            <div className="flex items-start space-x-6 p-6 bg-white rounded-xl shadow-md border-l-4 border-purple-500">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Submit your event idea
                </h4>
                <p className="text-gray-600">
                  Complete the proposal form, detailing the concept, location,
                  date, and target audience.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 bg-white rounded-xl shadow-md border-l-4 border-pink-500">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Talk to our team
                </h4>
                <p className="text-gray-600">
                  We&apos;ll review your proposal and get back to you to discuss
                  it and help you implement it.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 bg-white rounded-xl shadow-md border-l-4 border-blue-500">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Organize your event
                </h4>
                <p className="text-gray-600">
                  With our support, plan and execute your event with complete
                  peace of mind.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 bg-white rounded-xl shadow-md border-l-4 border-green-500">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Share the experience
                </h4>
                <p className="text-gray-600">
                  After the event, share your impressions and those of your
                  attendees to enrich the community.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ready to get started */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to get started?
          </h3>
          <p className="text-gray-600 text-lg">
            Join us now and help create unforgettable moments within the Les
            Sorties de Diane community.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-md mx-auto">
          <button
            onClick={() => navigate("/app/create-organizer")}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-xl transition-all font-medium shadow-lg text-white text-lg transform hover:scale-105"
          >
            Proceed to Organizer Form
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrganizerPage;
