import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/HomePage";
import SinglePostPage from "./pages/SinglePostPage";
import MostPopularPage from "./pages/MostPopularPage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UpdateUserPage from "./pages/UpdateUserPage";
import AdminPage from "./pages/AdminPage";
import AdminPostsPage from "./pages/AdminPostsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminTransactionsPage from "./pages/AdminTransactionsPage";
import {
  AdminLayout,
  AuthLayout,
  Layout,
  PublicLayout,
} from "./layouts/Layout";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* public layout */}
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="posts/:id" element={<SinglePostPage />} />
            <Route path="popular" element={<MostPopularPage />} />
            <Route path="search" element={<SearchPage />} />

            {/* unauthenticated users only */}
            <Route element={<PublicLayout />}>
              <Route path="register" element={<RegisterPage />} />
              <Route path="login" element={<LoginPage />} />
            </Route>

            {/* authenticated users only */}
            <Route element={<AuthLayout />}>
              <Route path="update-user" element={<UpdateUserPage />} />
            </Route>
          </Route>

          {/* admin layout and admin users only */}
          <Route element={<AdminLayout />}>
            <Route path="admin" element={<AdminPage />} />
            <Route path="admin/users" element={<AdminUsersPage />} />
            <Route path="admin/posts" element={<AdminPostsPage />} />
            <Route
              path="admin/transactions"
              element={<AdminTransactionsPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" />
    </QueryClientProvider>
  </StrictMode>
);
