import { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import Nav from "../../components/Nav";
import OrganizerProfileComponent from "../../components/OrganizerProfile";
import UserProfileComponent from "../../components/UserProfile";

export default function ProfileManager() {
  const { setLoading } = useData();
  const [profile, setProfile] = useState(null);

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setProfile({
          _id: "user123",
          isOrganizer: true, // Change to true to test organizer view
          fullName: "Jane Doe",
          imageUrl: "https://randomuser.me/api/portraits/women/12.jpg",
          email: "jane.doe@example.com",
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <Nav />
        <div className="px-4 py-8 pt-[15vh] max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Nav />
      <div className="px-4 py-8 pt-[15vh] max-w-7xl mx-auto">
        {profile.isOrganizer ? (
          <OrganizerProfileComponent profile={profile} />
        ) : (
          <UserProfileComponent profile={profile} />
        )}
      </div>
    </div>
  );
}
