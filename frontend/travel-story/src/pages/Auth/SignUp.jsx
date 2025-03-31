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
      const token = credentialResponse.credential;
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
    <div className="h-screen bg-[#E3F2FD] text-gray-900 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40 bg-[#BBDEFB]" />
      <div className="login-ui-box bg-[#90CAF9] -bottom-40 right-1/2" />

      <div className="container h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 mx-auto">
        {/* Left Side Image Section 
        <div className="w-full md:w-2/4 h-[60vh] md:h-[98vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-6 md:p-10 z-50">
          <div className="absolute top-8 left-6 md:left-24 p-4 rounded-lg max-w-sm bg-white bg-opacity-50 backdrop-blur-md shadow-lg">
            <h4 className="text-3xl md:text-5xl text-[#3949AB] font-semibold leading-tight">
              Join the <br /> Adventure!
            </h4>
            <p className="text-sm md:text-[15px] text-gray-700 leading-6 pr-7 mt-4">
              Create an account to start documenting your travels and preserving
              your memories.
            </p>
          </div>
        </div>
        */}
        

        {/* Right Side SignUp Form */}
        <div className="w-full md:w-2/4 h-auto md:h-[75vh] bg-[#F5F5F5] text-gray-900 rounded-lg md:rounded-r-lg relative p-8 md:p-16 shadow-lg">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-semibold mb-7">Sign Up</h4>

            <input
              type="text"
              placeholder="Full Name"
              className="input-box w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3949AB]"
              value={name}
              onChange={({ target }) => setName(target.value)}
            />

            <input
              type="text"
              placeholder="Email"
              className="input-box w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3949AB]"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />

            <PasswordInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#3949AB] text-white py-3 rounded-md mt-4 hover:bg-[#303F9F] transition duration-300"
            >
              Create Account
            </button>
            <p className="text-xs text-gray-500 text-center my-4"> Or</p>

            <div className="flex justify-center my-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signup_with"
                useOneTap
              />
            </div>

            <button
              type="button"
              className="w-full bg-gray-300 text-gray-900 py-2 rounded-md hover:bg-[#4CAF50] hover:text-white transition duration-300"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
