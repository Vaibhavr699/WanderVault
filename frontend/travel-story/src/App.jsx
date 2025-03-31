import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import StartupHome from "./pages/Home/StartupHome"; 

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<Root/>} />
          <Route path="/Home" exact element={<StartupHome />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  );
};

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? (
    <Navigate to="/Home " />
  ) : (
    <Navigate to="/dashboard" />
  );
};

export default App;
