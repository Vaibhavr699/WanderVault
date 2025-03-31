import React from "react";

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-black text-white">
        <div className="text-2xl font-bold ">WanderVault</div>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-100"
            onClick={() => handleClick("login")}
          >
            Login
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => handleClick("signup")}
          >
            Signup
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between flex-grow">
        <div className="relative w-full h-screen flex flex-col justify-center items-center text-center md:text-left">
          <img
            src="https://images.unsplash.com/photo-1523752057293-c00f176280ce?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-10 bg-black bg-opacity-50 p-6 rounded-lg max-w-2xl text-white">
            <h1 className="text-4xl font-bold mb-4">
              Discover, Learn, and Share
            </h1>
            <p className="text-lg">
              Dive into a world of ideas and stories. Join our community today
              and start sharing your insights.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-4 bg-black text-white text-center">
        <p>&copy; 2025 MyBlog. All rights reserved.</p>
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
