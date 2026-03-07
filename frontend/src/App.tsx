
import "./App.css";
import { Router, Route, BrowserRouter, Routes} from "react-router-dom"
import { SignIn, SignUp } from "@clerk/clerk-react";
import SignUpPage from "./pages/Auth/SignUp";
import SignInPage from "./pages/Auth/SignIn"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route >
          <Route path="/" element={<h1>Home</h1>}></Route>
          <Route path="/sign-up" element={<SignUpPage/>}></Route>
          <Route path="/sign-in" element={<SignInPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
