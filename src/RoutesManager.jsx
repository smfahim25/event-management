// src/RoutesManager.js

import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/public/LandingPage";
import EventsPage from "./pages/private/EventsPage";
import ProfilePage from "./pages/private/ProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

import EventsDetails from "./pages/private/EventsDetails";

import SuccessPage from "./pages/payment/SuccessPage";
import CancelPage from "./pages/payment/CancelPage";
import RegisterEvent from "./pages/private/RegisterEvent";
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
      <Route path="/contact-us" element={<ContactPage />} />

      {/* Protected Routes */}
      <Route path="/app/events" element={<EventsPage />} />
      <Route path="/app/profile" element={<ProfilePage />} />
      <Route path="/app/register-event/:eventID" element={<RegisterEvent />} />

      <Route path="/app/eventDetails/:eventID" element={<EventsDetails />} />
      <Route path="/app/edit-Event/:eventID" element={<EditEvent />} />
      <Route path="/app/create-event" element={<CreateEventForm />} />

      <Route path="/admin" element={<AdminDashboard />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="organizers" element={<OrganizerApprovals />} />
        <Route path="events" element={<EventApprovals />} />
        <Route path="commission" element={<CommissionSettings />} />
        <Route path="refunds" element={<RefundResolution />} />
        <Route path="content" element={<ContentManagement />} />
      </Route>
      <Route path="/dashboard" element={<OrganizerDashboard />} />

      {/* Catch-all Route */}
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/cancel" element={<CancelPage />} />
      <Route path="/success-split" element={<SuccessSplit />} />

      {/* <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes>
  );
}

export default RoutesManager;
