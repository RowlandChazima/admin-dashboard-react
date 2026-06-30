import React from "react";

const Welcome = ({ user, onNavigate }) => {
  const displayName = user?.firstName || "User";
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fffdf0] to-[#fdf3c7] p-5">
      <div className="bg-white w-full max-w-md p-12 rounded-[30px] text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-yellow-500/20">
        <div className="w-16 height-16 w-16 h-16 bg-[#facc15] text-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-[0_8px_20px_rgba(250,204,21,0.25)]">
          ✓
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
          Welcome,{" "}
          <span className="bg-yellow-400/25 px-2.5 py-0.5 rounded-lg">
            {displayName}
          </span>
          !
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed mb-8">
          Thank you for registering. Your account has been successfully created
          and saved.
        </p>
        <button
          onClick={onNavigate}
          className="inline-block w-full p-3.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-full hover:bg-black active:scale-[0.98] transition-all cursor-pointer"
        >
          Back to Registration
        </button>
      </div>
    </div>
  );
};

export default Welcome;
