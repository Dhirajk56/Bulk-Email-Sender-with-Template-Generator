import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-xl w-full">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4">
          Welcome to <span className="text-blue-500">Email Sender</span>
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Effortlessly generate and send personalized emails with ease.
        </p>
        <a
          href="/send"
          className="inline-block bg-blue-600 text-white text-lg px-8 py-3 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
        >
          🚀 Get Started
        </a>
      </div>
    </div>
  );
};

export default Home;
