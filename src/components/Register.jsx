import React, { useState } from "react";

export default function Register({ onSuccess, onViewChange }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fixedId = 728729767969;
    const newUser = {
      ...formData,
      id: fixedId,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        "https://charity-minds-backend.onrender.com/api/v1/users",
        { credentials: "include" },
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(
          errorData.message || "Registration failed. Please check your data.",
        );
        setLoading(false);
        return;
      }

      // Syncing with local storage so dashboard can read local submissions
      const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
      localUsers.push(newUser);
      localStorage.setItem("localUsers", JSON.stringify(localUsers));

      const isAdmin =
        formData.username === "admin" &&
        formData.password === "rowland@gomycode";
      onSuccess(newUser, isAdmin);
    } catch (error) {
      console.error("Network error connecting to Render:", error);
      alert("Server is sleeping or unreachable. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-[#f7f6f0]">
      <div className="bg-white p-10 rounded-[24px] w-full max-w-md shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Registration Form
          </h1>
          <button
            onClick={() => onViewChange("dashboard")}
            className="text-xs text-amber-600 hover:underline"
          >
            View Dashboard
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Please fill in the form below
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-3 focus:ring-amber-400/15 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-3 focus:ring-amber-400/15 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-3 focus:ring-amber-400/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-3 focus:ring-amber-400/15 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-3 focus:ring-amber-400/15 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm outline-none text-gray-600 focus:border-amber-400 focus:bg-white focus:ring-3 focus:ring-amber-400/15 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm outline-none text-gray-600 focus:border-amber-400 focus:bg-white focus:ring-3 focus:ring-amber-400/15 transition-all"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-3 focus:ring-amber-400/15 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#242424] text-white p-3.5 rounded-full font-semibold text-sm mt-4 hover:bg-[#fbc02d] hover:text-[#242424] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
