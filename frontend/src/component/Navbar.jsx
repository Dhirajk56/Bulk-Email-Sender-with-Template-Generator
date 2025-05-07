import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg fixed w-full z-20 p-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <a
          href="/"
          className="text-white text-2xl font-bold tracking-wide hover:text-yellow-300 transition duration-200"
        >
          📧 Email Sender
        </a>

        <div className="space-x-6 flex text-sm sm:text-base">
          <a
            href="/"
            className="text-white hover:text-yellow-300 transition duration-200 font-medium"
          >
            Home
          </a>
          <a
            href="/send"
            className="text-white hover:text-yellow-300 transition duration-200 font-medium"
          >
            Send Email
          </a>
          <a
            href="/generate-email"
            className="text-white hover:text-yellow-300 transition duration-200 font-medium"
          >
            Generate Email
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
