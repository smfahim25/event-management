import Nav from "../../components/Nav";
import UserProfileComponent from "../../components/UserProfile";
import OrganizerProfile from "../../components/organization/OrganizerProfile";
import { useAuthStore } from "../../store/AuthStore";
import { useOrganizerStore } from "../../store/OrganizerStore";

export default function ProfileManager() {
  const { user, loading: authLoading } = useAuthStore();
  const { loading: organizerLoading } = useOrganizerStore();
  const isLoading = authLoading || organizerLoading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white relative">
      <Nav />
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="px-4 py-8 pt-[15vh] max-w-7xl mx-auto">
        {user.role === "organizer" ? (
          <OrganizerProfile />
        ) : (
          <UserProfileComponent />
        )}
      </div>
    </div>
  );
}
