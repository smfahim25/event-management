import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import LoadingState from "../../components/AdminDashboard/LoadingState";
import Layout from "../../components/AdminDashboard/Layout";

export default function AdminDashboard() {
  return (
    <Layout>
      <Suspense fallback={<LoadingState />}>
        <Outlet />
      </Suspense>
    </Layout>
  );
}
