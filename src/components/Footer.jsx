import { useData } from "../context/DataContext";

const Footer = () => {
  const { defaultTexts } = useData();

  return (
    <footer className="bg-[#3D004D] text-white py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12">
          {/* Left Section - Company Name */}
          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#E167FF] qwigley-regular leading-tight">
              {defaultTexts.footer.companyName}
            </h1>
            <p className="text-sm sm:text-base text-white mt-2 max-w-xs">
              {defaultTexts.footer.tagline}
            </p>
          </div>

          {/* Center Section - Navigation Links */}
          <div className="w-full lg:flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 text-sm sm:text-base">
              {/* Quick Links */}
              <div>
                <h2 className="text-[#E167FF] font-semibold mb-3 text-base sm:text-lg">
                  {defaultTexts.footer.quickLinks.title}
                </h2>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#E167FF] transition-colors duration-200"
                    >
                      {defaultTexts.footer.quickLinks.items[0]}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/app/events"
                      className="hover:text-[#E167FF] transition-colors duration-200"
                    >
                      {defaultTexts.footer.quickLinks.items[1]}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact-us"
                      className="hover:text-[#E167FF] transition-colors duration-200"
                    >
                      {defaultTexts.footer.quickLinks.items[2]}
                    </a>
                  </li>
                </ul>
              </div>

              {/* User Links */}
              <div>
                <h2 className="text-[#E167FF] font-semibold mb-3 text-base sm:text-lg">
                  {defaultTexts.footer.userLinks.title}
                </h2>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/app/profile"
                      className="hover:text-[#E167FF] transition-colors duration-200"
                    >
                      {defaultTexts.footer.userLinks.items[0]}
                    </a>
                  </li>

                  <li>
                    <a
                      href="/app/my-tickets"
                      className="hover:text-[#E167FF] transition-colors duration-200"
                    >
                      {defaultTexts.footer.userLinks.items[2]}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal Links */}
              <div className="sm:col-span-2 lg:col-span-1">
                <h2 className="text-[#E167FF] font-semibold mb-3 text-base sm:text-lg">
                  {defaultTexts.footer.legal.title}
                </h2>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="hover:text-[#E167FF] transition-colors duration-200"
                    >
                      {defaultTexts.footer.legal.items[0]}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-[#E167FF] transition-colors duration-200"
                    >
                      {defaultTexts.footer.legal.items[1]}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Section - Social Media & Newsletter */}
          <div className="w-full lg:w-auto lg:flex-shrink-0 lg:min-w-[280px]">
            {/* Social Media */}
            <div className="mb-6">
              <h3 className="text-[#E167FF] font-semibold mb-3 text-base sm:text-lg">
                Follow Us
              </h3>
              <div className="flex gap-4 sm:gap-6">
                <a
                  href="#"
                  className="text-[#E167FF] hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  {defaultTexts.footer.socialMedia[0]}
                </a>
                <a
                  href="#"
                  className="text-[#E167FF] hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  {defaultTexts.footer.socialMedia[1]}
                </a>
                <a
                  href="#"
                  className="text-[#E167FF] hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  {defaultTexts.footer.socialMedia[2]}
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-[#E167FF] font-semibold mb-3 text-base sm:text-lg">
                Newsletter
              </h3>
              <form className="space-y-3">
                <label
                  htmlFor="newsletter"
                  className="block text-sm sm:text-base text-white"
                >
                  {defaultTexts.footer.newsletter.label}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    id="newsletter"
                    placeholder="Email address"
                    className="flex-1 p-3 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#E167FF] text-sm sm:text-base"
                  />
                  <button
                    type="submit"
                    className="px-4 sm:px-5 py-3 bg-[#E167FF] text-white rounded-md hover:bg-white hover:text-[#3D004D] transition-colors duration-200 font-medium text-sm sm:text-base whitespace-nowrap"
                  >
                    {defaultTexts.footer.newsletter.buttonText}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 sm:mt-10 lg:mt-12 pt-6 text-center">
          <p className="text-xs sm:text-sm lg:text-base text-white">
            © {new Date().getFullYear()} {defaultTexts.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
