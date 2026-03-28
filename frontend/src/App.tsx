
import "./App.css";
import {Route, BrowserRouter, Routes} from "react-router-dom"
import SignUpPage from "./pages/Auth/SignUp";
import SignInPage from "./pages/Auth/SignIn"
import Header from "./components/Header";
import PaymentCheckOut from "./pages/Clients/PaymentCheckOut";
import CreateLink from "./pages/Merchant/CreateLink";

const App = () => {

  return (
    <BrowserRouter>
      <Header></Header>

      <Routes>
        <Route>
          <Route path="/" element={<h1>Home</h1>}></Route>
          <Route path="/sign-up" element={<SignUpPage />}></Route>
          <Route path="/sign-in" element={<SignInPage />}></Route>
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
  );
}

export default App;
