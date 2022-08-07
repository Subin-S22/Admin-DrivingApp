import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center absolute min-h-screen min-w-full">
      <div
        className="border-b-4 animate-spin inline-block w-8 h-8 border-gray-700 rounded-full"
        role="status"
      >
        <span className="invisible">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
