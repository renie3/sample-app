import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";
import useAuthStore from "../zustand/useAuthStore";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-bg sticky top-0 z-50 w-full">
        <div className="max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-5">
          <Navbar />
        </div>
      </div>
      <div className="flex-1 max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-5 w-full">
        <Outlet />
      </div>
      <div className="max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-5 w-full">
        <Footer />
      </div>
    </div>
  );
};

export const AuthLayout = () => {
  const { currentUser } = useAuthStore();
  if (!currentUser) return <Navigate to="/" />;

  return <Outlet />;
};

export const PublicLayout = () => {
  const { currentUser } = useAuthStore();
  if (currentUser) return <Navigate to="/" />;

  return <Outlet />;
};

export const AdminLayout = () => {
  const { currentUser } = useAuthStore();
  if (!currentUser?.isAdmin) return <Navigate to="/" />;

  return (
    <>
      <div className="bg-bg sticky top-0 z-50 w-full">
        <div className="max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-5">
          <Navbar />
        </div>
      </div>
      <div className="flex">
        <Sidebar />
        <div className="w-full px-5 lg:px-10">
          <Outlet />
        </div>
      </div>
    </>
  );
};
