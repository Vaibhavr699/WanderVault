import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import "../Auth/Firebase.jsx";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your Name!");
      toast.error("Please enter your Name!");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address!");
      toast.error("Please enter a valid email address!");
      return;
    }
    setError(null);

    if (!password) {
      setError("Please enter the password!");
      toast.error("Please enter the password!");
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
      const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await axiosInstance.post("/google-signup", {
        email: user.email,
        fullName: user.displayName,
        uid: user.uid,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        toast.success("Signed up with Google successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Google Sign-Up Failed. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-[#E3F2FD] text-gray-900 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40 bg-[#BBDEFB]" />
      <div className="login-ui-box bg-[#90CAF9] -bottom-40 right-1/2" />

      <div className="container h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 mx-auto">
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
              <button
                type="button"
                className="w-full bg-gray-300 text-gray-900 py-2 rounded-md hover:bg-[#4CAF50] hover:text-white transition duration-300"
                onClick={handleGoogleSignup}
              >
                Sign Up with Google
                
              </button>
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
