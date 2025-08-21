import React from "react";

// Main App component for the landing page with a static, cool UI.
const LurphLanding = () => {
  // Function to handle the button click.
  // This function is where you would add your navigation logic.
  const handleGoToLurph = () => {
    window.location.href = "https://explified-home.web.app/lurphchat";
  };

  return (
    // Main container for the entire page with a static dark background.
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-white font-['Outfit']">
      {/* The main content card with a frosted glass effect */}
      <div className="text-center bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-full transform transition-transform duration-500 hover:scale-105">
        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
          Welcome to lurph
        </h1>

        {/* Paragraph with a brief message */}
        <p className="text-md md:text-lg text-white text-opacity-80 mb-8 font-light">
          Your journey starts here. Click the button to explore what lurph has
          to offer.
        </p>

        {/* The button with a gradient and hover effects */}
        <button
          onClick={handleGoToLurph}
          className="relative overflow-hidden px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-70"
        >
          Go To Lurph
          {/* A subtle glowing effect on hover */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transform -skew-x-12 transition-all duration-500 group-hover:opacity-20 group-hover:skew-x-0"></span>
        </button>
      </div>
    </div>
  );
};

export default LurphLanding;
