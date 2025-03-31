import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import "../Auth/Firebase.jsx";

const firebaseConfig = {
  apiKey: "AIzaSyAQqEIXaGPHS6Ji7ngbI-sOUn-o1YDvCTA",
  authDomain: "blog-websiteb-react.firebaseapp.com",
  projectId: "blog-websiteb-react",
  storageBucket: "blog-websiteb-react.firebasestorage.app",
  messagingSenderId: "965474575146",
  appId: "1:965474575146:web:da9ee470e10717732fb453"
};

initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

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
      // Implement Firebase email/password login if needed
      toast.success("Logged In Successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        localStorage.setItem("token", token);
        toast.success("Logged In Successfully!");
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Google Login Error:", error);
        toast.error("Google login failed. Please try again.");
      });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#F9FAFB] to-[#E7E9EB] text-gray-800 overflow-hidden relative">
      <div className="container h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 mx-auto">
        <div className="w-full md:w-2/4 h-auto md:h-[75vh] bg-white text-gray-900 rounded-lg md:rounded-r-lg p-8 md:p-16 shadow-2xl">
          <form onSubmit={handleLogin}>
            <h4 className="text-3xl font-semibold mb-7 text-[#374151]">Welcome Back</h4>

            <input
              type="text"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
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

            {error && <p className="text-red-500 text-sm pb-2">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#3B82F6] text-white py-3 rounded-md mt-4 shadow-lg hover:bg-[#2563EB] transition duration-300"
            >
              Login
            </button>
            <p className="text-sm text-gray-500 text-center my-4">Or</p>

            <button
              type="button"
              className="w-full bg-gray-100 text-gray-800 py-3 rounded-md shadow-lg hover:bg-[#10B981] hover:text-white transition duration-300"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>

            <div className="my-4 flex justify-center">
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-red-500 text-white py-3 rounded-md shadow-lg hover:bg-red-600 transition duration-300"
              >
                Login with Google
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;