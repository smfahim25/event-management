import { useState } from "react";
import Navbar from "./AdminNav";
import Sidebar from "./Sidebar";

export default function Layout({
  children,
  pendingApprovals,
  dateRange,
  setDateRange,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        pendingApprovals={pendingApprovals}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      <div className="flex flex-1">
        <Sidebar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          pendingApprovals={pendingApprovals}
        />

        {/* Main content */}
        <div className="flex-1 overflow-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
