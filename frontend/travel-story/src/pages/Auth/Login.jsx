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
      // Send the Google credential to your server for verification or authentication
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
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40" />
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2" />
      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        <div className="w-2/4 h-[98vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50">
          <div className="absolute top-8 left-24 p-4 rounded-lg max-w-sm">
            <h4 className="text-5xl text-white font-semibold leading-[58px]">
              Capture Your <br /> Journeys!
            </h4>
            <p className="text-[15px] text-white leading-6 pr-7 mt-4">
              Record your travel experiences and memories in your personal
              travel journals.
            </p>
          </div>
        </div>
        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-7">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
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

            <button type="submit" className="btn-primary">
              LOGIN
            </button>
            <p className="text-xs text-slate-500 text-center my-4"> Or</p>

            <button
              type="button"
              className="btn-primary btn-light"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>

            <div className="my-4">
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
