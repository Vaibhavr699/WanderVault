import React from "react";
import MainImage from "../../assets/images/main.jpg";

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-black">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-black/50 shadow-md sticky top-0 z-10">
        <div className="text-2xl font-extrabold text-white">WanderVault</div>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 w-full md:w-auto"
            onClick={() => handleClick("login")}
          >
            Login
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 w-full md:w-auto"
            onClick={() => handleClick("signup")}
          >
            Signup
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container h-[350px]">
        <img
          src={MainImage}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 flex flex-col justify-center items-center text-center text-white p-6  bg-opacity-80 min-h-[calc(100vh-136px)]">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Preserve Your Precious Memories
          </h1>
          <p className="text-lg mb-4">
            Capture your moments with images, stories, and locations. Revisit
            them anytime and relive the joy.
          </p>
          <button
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl rounded-full hover:shadow-lg hover:scale-105 transition duration-300 shadow-md w-full md:w-auto"
            onClick={() => handleClick("signup")}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-4 bg-emerald-900 text-center shadow-inner">
        <p className="text-gray-400">&copy; 2025 WanderVault. All rights reserved.</p>
      </footer>
    </div>
  );
}

function handleClick(type) {
  if (type === "login") {
    window.location.href = "/login"; // Redirect to login page
  } else if (type === "signup") {
    window.location.href = "/signup"; // Redirect to signup page
  }
}

export default HomePage;
