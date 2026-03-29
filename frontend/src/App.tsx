
import "./App.css";
import {Route, BrowserRouter, Routes} from "react-router-dom"
import SignUpPage from "./pages/Auth/SignUp";
import SignInPage from "./pages/Auth/SignIn"
import Header from "./components/Header";
import PaymentCheckOut from "./pages/Clients/PaymentCheckOut";
import CreateLink from "./pages/Merchant/CreateLink";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import { AuthProvider } from "./context/AuthContext";
import PublicRoute from "./components/PublicRoute";
import ProtectRoute from "./components/ProtectRoute";
import DashboardPage from "./pages/Dashboard";
import LinksPage from "./pages/Links";
import TransactionsPage from "./pages/Transactions";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            30_000,
      retry:                1,
      refetchOnWindowFocus: false
    }
  }
})
const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <BrowserRouter>
      {/* <Header></Header> */}

      <Routes>
        <Route element={<PublicRoute/>}>
          <Route path="/sign-up" element={<SignUpPage />}></Route>
          <Route path="/sign-in" element={<SignInPage />}></Route>
        </Route>
        <Route element={<ProtectRoute/>}>
        <Route index path="/dashboard" element={<DashboardPage/>}/>
        <Route path="/dashboard" element={<DashboardPage/>}/>
        <Route path="/links" element={<LinksPage/>}/>
        <Route path="/transactions" element={<TransactionsPage/>}/>

        </Route>
        <Route path="payment">
          <Route path="status"></Route>
          <Route path="link">
            <Route path="create" element={<CreateLink/>}></Route>
            <Route path=":id" element={<PaymentCheckOut/>}></Route>
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
