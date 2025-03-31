import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

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
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        toast.success("Logged In Successfully!");
        navigate("/dashboard");
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

  const handleGoogleSuccess = (credentialResponse) => {
    const { credential } = credentialResponse;

    if (credential) {
      axiosInstance
        .post("/google-login", { token: credential })
        .then((response) => {
          if (response.data && response.data.accessToken) {
            localStorage.setItem("token", response.data.accessToken);
            toast.success("Logged In Successfully!");
            navigate("/dashboard");
          }
        })
        .catch((error) => {
          console.error("Google Login Error:", error);
          toast.error("Google login failed. Please try again.");
        });
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className="h-screen bg-[#FFFFFF] text-white overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40 bg-gray-600" />
      <div className="login-ui-box bg-[#475569] -bottom-40 right-1/2" />

      <div className="container h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 mx-auto ">
        {/* Left Side Image Section 
        <div className="w-full md:w-2/4 h-[60vh] md:h-[98vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-6 md:p-10 z-50 ">
          <div className="absolute top-8 left-6 md:left-24 p-4 rounded-lg max-w-sm bg-white bg-opacity-20 backdrop-blur-md shadow-lg">
            <h4 className="text-3xl md:text-5xl text-[#E0F2FE] font-semibold leading-tight">
              Capture Your <br /> Journeys!
            </h4>
            <p className="text-sm md:text-[15px] text-gray-300 leading-6 pr-7 mt-4">
              Record your travel experiences and memories in your personal
              travel journals.
            </p>
          </div>
        </div>
        */}

        {/* Right Side Login Form */}
        <div className="w-full md:w-2/4 h-auto md:h-[75vh] bg-[#F4F2EF] text-gray-900 rounded-lg md:rounded-r-lg relative p-8 md:p-16 shadow-lg">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-7 text-[#1E293B]">Login</h4>

            <input
              type="text"
              placeholder="Email"
              className="input-box w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#475569]"
              value={email}
              onChange={({ target }) => {
                setEmail(target.value);
              }}
            />

            <PasswordInput
              value={password}
              onChange={({ target }) => {
                setPassword(target.value);
              }}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#2563EB] text-white py-3 rounded-md mt-4 hover:bg-[#1E40AF] transition duration-300"
            >
              Login
            </button>
            <p className="text-xs text-gray-500 text-center my-4"> Or</p>

            <button
              type="button"
              className="w-full bg-[#CBD5E1] text-black py-3 rounded-md hover:bg-[#10B981] hover:text-white transition duration-300"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>

            <div className="my-4 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
