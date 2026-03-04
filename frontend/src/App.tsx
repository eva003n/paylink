
import "./App.css";
import { Router, Route, BrowserRouter, Routes} from "react-router-dom"
import { SignIn, SignUp } from "@clerk/clerk-react";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route >
          <Route path="/" element={<h1>Home</h1>}></Route>
          <Route path="/sign-up" element={<SignUp />}></Route>
          <Route path="/sign-in" element={<SignIn />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
