import { createPortal } from "react-dom";
import { X, Users, Calendar, Heart, Lightbulb } from "lucide-react";

const OrganizerModal = ({ isOpen, onClose, onSkip, onProceed }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-6 z-10 p-2 text-white hover:text-gray-700 bg-black hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        {/* Modal content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header with hero image */}
          <div className="relative h-48 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-3xl font-bold mb-2">
                  Become an organizer with
                </h1>
                <h2 className="text-4xl font-extrabold">
                  Les Sorties de Diane
                </h2>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Subtitle */}
            <div className="text-center mb-8">
              <p className="text-xl text-gray-600 font-medium">
                Join a dynamic and passionate community
              </p>
              <p className="text-gray-500 mt-2">
                Do you enjoy creating unique and convivial moments? Do you want
                to share your passion for event planning and providing memorable
                experiences for others?
              </p>
            </div>

            {/* Community image */}
            <div className="flex justify-center mb-8">
              <img
                src="https://www.naboo.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhero.549ef334.webp&w=1920&q=100"
                alt="Community gathering"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>

            <div className="text-center mb-8">
              <p className="text-gray-600">
                Join Les Sorties de Diane as an organizer and become part of a
                community committed to creating authentic and inspiring
                encounters.
              </p>
            </div>

            {/* Why become an organizer section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Why become an organizer?
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <Lightbulb className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Express your creativity
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Design and host events that reflect your personality, in
                      line with your desires and ideas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-pink-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <Heart className="w-8 h-8 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Share your passions
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Whether it&apos;s gastronomy, culture, wellness, or other
                      themes, share what inspires you.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Expand your network
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Meet people with similar interests and expand your social
                      and professional circle.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <Calendar className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Receive support
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Benefit from the support and advice of the Les Sorties de
                      Diane team to help you organize your events.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How it works section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                How does it work?
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 border-l-4 border-purple-500 bg-gray-50">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Submit your event idea
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Complete the proposal form, detailing the concept,
                      location, date, and target audience.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 border-l-4 border-pink-500 bg-gray-50">
                  <div className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Talk to our team
                    </h4>
                    <p className="text-gray-600 text-sm">
                      We&apos;ll review your proposal and get back to you to
                      discuss it and help you implement it.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 border-l-4 border-blue-500 bg-gray-50">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Organize your event
                    </h4>
                    <p className="text-gray-600 text-sm">
                      With our support, plan and execute your event with
                      complete peace of mind.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 border-l-4 border-green-500 bg-gray-50">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Share the experience
                    </h4>
                    <p className="text-gray-600 text-sm">
                      After the event, share your impressions and those of your
                      attendees to enrich the community.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ready to get started */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to get started?
              </h3>
              <p className="text-gray-600">
                Join us now and help create unforgettable moments within the Les
                Sorties de Diane community.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onSkip}
                className="px-8 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Skip
              </button>
              <button
                onClick={onProceed}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-lg transition-all font-medium shadow-lg text-white"
              >
                Proceed to Organizer Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render the modal at the document body level
  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};

export default OrganizerModal;
