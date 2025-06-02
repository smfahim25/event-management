import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/public/LandingPage";
import EventsPage from "./pages/private/EventsPage";
import ProfilePage from "./pages/private/ProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import EventsDetails from "./pages/private/EventsDetails";

import SuccessSplit from "./pages/payment/SuccessSplit";
import ContactPage from "./pages/public/ContactPage";
import EditEvent from "./components/EditEvent";
// import AdminRouteGuard from "./pages/private/AdminRouteGuard";
import OrganizerDashboard from "./pages/private/OrganizationDashboard";
import CreateEventForm from "./components/CreateEventForm";
import AdminDashboard from "./pages/private/AdminPanel";
import Dashboard from "./components/AdminDashboard/Dashboard";
import UserManagement from "./components/AdminDashboard/UserManagement";
import OrganizerApprovals from "./components/AdminDashboard/OrganizerApproval";
import EventApprovals from "./components/AdminDashboard/EventApprovals";
import CommissionSettings from "./components/AdminDashboard/CommissionSettings";
import RefundResolution from "./components/AdminDashboard/RefundResulation";
import ContentManagement from "./components/AdminDashboard/ContentManagement";
import OrganizerRegistrationForm from "./components/organization/OrganizerRegister";
import SettingsPage from "./components/AdminDashboard/Settings";
import EventPreferences from "./pages/private/EventPreference";
import CategoryManagement from "./components/AdminDashboard/CategoryManagement";
import RequireUser from "./pages/private/RequireUser";
import RequireOrganizer from "./pages/private/RequireOrganizer";
import RequireAdmin from "./pages/private/RequireAdmin";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFailed from "./pages/payment/PaymentFailed";
import EmailVerificationPage from "./pages/auth/VerifyEmail";
import TicketPage from "./pages/private/TicketPage";
import SignupSuccess from "./pages/auth/SignupSuccess";
import AdminProfile from "./components/AdminDashboard/AdminProfile";
import NewsletterSubscribers from "./components/AdminDashboard/NewLetter";
import PrivacyPolicyPage from "./pages/public/Privacy";
import TermsConditionPage from "./pages/public/Terms";
import StripeConnectSuccess from "./pages/payment/StripeConnectSuccess";
import StripeConnectFailure from "./pages/payment/StripeConnectFailed";

function RoutesManager() {
  // useEffect(()=>{
  //   checkIfUserExists(user)
  // },[])

  // if (loading) {
  //   return <div><FullScreenLoader /></div>;
  // }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/event-prefer" element={<EventPreferences />} />
      <Route path="/contact-us" element={<ContactPage />} />

      {/* Protected Routes */}
      <Route path="/app/events" element={<EventsPage />} />
      <Route
        path="/app/profile"
        element={
          <RequireUser>
            <ProfilePage />
          </RequireUser>
        }
      />
      <Route
        path="/app/my-tickets"
        element={
          <RequireUser>
            <TicketPage />
          </RequireUser>
        }
      />

      <Route
        path="/app/eventDetails/:eventID"
        element={
          <RequireUser>
            <EventsDetails />
          </RequireUser>
        }
      />
      <Route
        path="/app/edit-Event/:eventID"
        element={
          <RequireOrganizer>
            <EditEvent />
          </RequireOrganizer>
        }
      />
      <Route
        path="/app/create-event"
        element={
          <RequireOrganizer>
            <CreateEventForm />
          </RequireOrganizer>
        }
      />
      <Route
        path="/app/create-organizer"
        element={
          <RequireUser>
            <OrganizerRegistrationForm />
          </RequireUser>
        }
      />

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="organizers" element={<OrganizerApprovals />} />
        <Route path="events" element={<EventApprovals />} />
        <Route path="commission" element={<CommissionSettings />} />
        <Route path="category" element={<CategoryManagement />} />
        <Route path="refunds" element={<RefundResolution />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="newsletter" element={<NewsletterSubscribers />} />
      </Route>
      <Route
        path="/dashboard"
        element={
          <RequireOrganizer>
            <OrganizerDashboard />
          </RequireOrganizer>
        }
      />

      {/* Catch-all Route */}
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailed />} />
      <Route path="/success-split" element={<SuccessSplit />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
      <Route path="/signup-success" element={<SignupSuccess />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsConditionPage />} />
      <Route path="/stripe-success" element={<StripeConnectSuccess />} />
      <Route path="/stripe-failed" element={<StripeConnectFailure />} />
    </Routes>
  );
}

export default RoutesManager;
