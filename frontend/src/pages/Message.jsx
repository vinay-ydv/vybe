import React from "react";
import Nav from "../components/Nav";

const Message = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[#00030e] text-gray-100">
      {/* Navbar */}
      <Nav />

      {/* Page Content */}
      <div className="flex flex-1 flex-col items-center justify-center text-center lg:ml-[200px] px-4">
        <div className="text-6xl mb-4">👨‍💻</div>
        <h2 className="text-xl font-semibold text-white">Message Page</h2>
        <p className="text-gray-400 mt-1">
          This feature is currently under development.
        </p>
      </div>
    </div>
  );
};

export default Message;

