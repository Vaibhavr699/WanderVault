import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your Name!");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address!");
      return;
    }
    setError(null);

    if (!password) {
      setError("Please enter the password!");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        toast.success("Account Registered Successfully. Login Now.");
        navigate("/login");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential; // Google credential
      const response = await axiosInstance.post("/google-signup", { token });
      
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        toast.success("Signed up with Google successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setError("Google sign-up failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-Up Failed. Please try again.");
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40" />
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2" />
      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        <div className="w-2/4 h-[98vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50">
          <div className="absolute top-8 left-24 p-4 rounded-lg max-w-sm">
            <h4 className="text-5xl text-black font-semibold leading-[58px]">
              Join the <br /> Adventure!
            </h4>
            <p className="text-[15px] text-black leading-6 pr-7 mt-4">
              Create an account to start documenting your travels and preserving your memories.
            </p>
          </div>
        </div>
        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-semibold mb-7">SignUp</h4>

            <input
              type="text"
              placeholder="Full Name"
              className="input-box"
              value={name}
              onChange={({ target }) => setName(target.value)}
            />

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />

            <PasswordInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Create Account
            </button>
            <p className="text-xs text-slate-500 text-center my-4"> Or</p>

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signup_with"
              useOneTap
            />

            <button
              type="button"
              className="btn-primary btn-light"
              onClick={() => navigate("/login")}
            >
              LogIn
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
