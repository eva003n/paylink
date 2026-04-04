import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignUpPage from "./pages/Auth/SignUp";
import SignInPage from "./pages/Auth/SignIn";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthProvider";
import PublicRoute from "./components/PublicRoute";
import ProtectRoute from "./components/ProtectRoute";
import DashboardPage from "./pages/Dashboard";
import LinksPage from "./pages/Links";
import TransactionsPage from "./pages/Transactions";
import Applayout from "./components/Layout/Applayout";
import SettingsPage from "./pages/Settings";
import CheckoutPage from "./pages/Checkout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="bottom-center" />
        <BrowserRouter>
          <Routes>
            {/* Public route to be accessed by anyone */}
            <Route path="/pay/:reference" element={<CheckoutPage />}></Route>

            <Route element={<PublicRoute />}>
              <Route path="/sign-up" element={<SignUpPage />}></Route>
              <Route path="/sign-in" element={<SignInPage />}></Route>
            </Route>
            <Route element={<ProtectRoute />}>
              <Route element={<Applayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/links" element={<LinksPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
