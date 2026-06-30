import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch(
          "https://charity-minds-backend.onrender.com/api/v1/users",
        ); //[cite: 2, 4]
        if (!response.ok) throw new Error("API down");

        const data = await response.json();
        let remoteUsers = data.data || [];

        remoteUsers.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        ); //[cite: 4]
        const localUsers = JSON.parse(localStorage.getItem("localUsers")) || []; //[cite: 4]

        const combined = [...remoteUsers, ...localUsers]; //[cite: 4]
        setAllUsers(combined);
        setFilteredUsers(combined);
        setError(false);
      } catch (err) {
        console.error(err);
        setError(true);
        const localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
        setAllUsers(localUsers);
        setFilteredUsers(localUsers);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  // Sync Search & Gender Filter States
  useEffect(() => {
    const filtered = allUsers.filter((user) => {
      const matchesGender =
        activeFilter === "all" || user.gender?.toLowerCase() === activeFilter;
      const cleanSearch = searchTerm.toLowerCase();
      const matchesText =
        (user.firstName || "").toLowerCase().includes(cleanSearch) ||
        (user.lastName || "").toLowerCase().includes(cleanSearch) ||
        (user.username || "").toLowerCase().includes(cleanSearch) ||
        (user.email || "").toLowerCase().includes(cleanSearch); //[cite: 4]

      return matchesGender && matchesText;
    });
    setFilteredUsers(filtered);
  }, [searchTerm, activeFilter, allUsers]);

  // UI Utilities
  const maskId = (id) =>
    id ? `${id.slice(0, 4)}****${id.slice(-4)}` : "loca****user"; //[cite: 4]

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleDateString("en-KE", {
          //[cite: 4]
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  // Metrics Calculations
  const stats = {
    total: allUsers.length, //[cite: 4]
    male: allUsers.filter((u) => u.gender?.toLowerCase() === "male").length, //[cite: 4]
    female: allUsers.filter((u) => u.gender?.toLowerCase() === "female").length, //[cite: 4]
    other: allUsers.filter((u) => u.gender?.toLowerCase() === "other").length, //[cite: 4]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e4e7eb] via-[#fef9c3] to-[#fef08a] p-10 font-sans text-slate-800">
      {" "}
      {/* HEADER */}
      <header className="flex justify-between items-center py-5 px-2.5 mb-6">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-slate-900 font-['DM_Sans']">
            User Management
          </h1>{" "}
        </div>
        <div className="flex items-center gap-4">
          <div className="border border-black/10 text-sm font-medium px-4 py-1.5 rounded-full">
            Admin
          </div>{" "}
        </div>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-7">
        {" "}
        <div className="bg-gradient-to-br from-white to-amber-50/50 p-5 px-6 rounded-2xl border border-black/5 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-0.5">
          {" "}
          <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold bg-[#fde047]">
            Σ
          </div>{" "}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-500">
              Total Users
            </span>
            <span className="text-3xl font-semibold leading-none mt-1">
              {stats.total}
            </span>
          </div>{" "}
        </div>
        {["Male", "Female", "Other"].map((gen) => (
          <div
            key={gen}
            className="bg-white p-5 px-6 rounded-2xl border border-black/5 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-0.5"
          >
            {" "}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-500">{gen}</span>{" "}
              <span className="text-3xl font-semibold leading-none mt-1">
                {stats[gen.toLowerCase()]}
              </span>
            </div>
          </div>
        ))}
      </section>
      {/* Controls Area */}
      <div className="bg-white/45 backdrop-blur-md border border-white/50 p-2.5 px-3.5 rounded-full flex flex-col sm:flex-row justify-between items-center gap-3 mb-5 shadow-sm">
        {" "}
        <div className="flex gap-1.5">
          {["all", "male", "female", "other"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider cursor-pointer transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-[#2d2d2d] text-white shadow-md shadow-black/10" //[cite: 3]
                  : "text-zinc-500 hover:text-slate-800 hover:bg-white/50" //[cite: 3]
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-5 py-2 border-0 rounded-full text-xs text-slate-800 bg-white outline-none w-full sm:w-[300px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] focus:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all" //[cite: 3]
        />
      </div>
      {/* Error Notification */}
      {error && (
        <div className="mb-4 p-3 bg-amber-500/20 border border-amber-500/30 text-amber-900 rounded-xl text-xs text-center font-medium">
          ERRROR... Failed to retrieve Users.Please refresh the page
        </div>
      )}
      {/* Table Section Container */}
      <div className="bg-white border border-black/5 rounded-[32px] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-x-auto">
        {" "}
        <table className="w-full border-separate border-spacing-y-1.5 text-left text-sm">
          {" "}
          <thead>
            <tr className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
              <th className="p-4 px-5">#</th>
              <th className="p-4 px-5">User ID</th>
              <th className="p-4 px-5">Full Name</th>
              <th className="p-4 px-5">Username</th>
              <th className="p-4 px-5">Email</th>
              <th className="p-4 px-5">Phone</th>
              <th className="p-4 px-5">Gender</th>
              <th className="p-4 px-5">Date of Birth</th>
              <th className="p-4 px-5">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center p-14 text-zinc-400">
                  Loading live user database rows...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-14 text-zinc-400">
                  No matching user records located.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => {
                const isSecondRowItem = index === 1;
                return (
                  <tr
                    key={user._id || index}
                    className={`transition-colors duration-150 ${
                      isSecondRowItem
                        ? "bg-[#fcd34d] text-black rounded-xl" //[cite: 3]
                        : "bg-transparent hover:bg-zinc-50" //[cite: 3]
                    }`}
                  >
                    <td
                      className={`p-4 px-5 font-medium rounded-l-2xl ${isSecondRowItem ? "text-black" : "text-zinc-400"}`}
                    >
                      {index + 1}
                    </td>
                    <td className="p-4 px-5">
                      <span
                        className={`font-mono text-xs px-2 py-1 rounded-md ${isSecondRowItem ? "bg-black/10" : "bg-black/5"}`}
                      >
                        {" "}
                        {user._id ? maskId(user._id) : "loca****user"}
                      </span>
                    </td>
                    <td className="p-4 px-5 font-medium whitespace-nowrap">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-4 px-5">{user.username}</td>
                    <td className="p-4 px-5 text-xs font-mono">{user.email}</td>
                    <td className="p-4 px-5 whitespace-nowrap">
                      {user.phone || "—"}
                    </td>
                    <td className="p-4 px-5">
                      <span
                        className={`text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full ${isSecondRowItem ? "bg-black/10" : "bg-black/5"}`}
                      >
                        {" "}
                        {user.gender || "unspecified"}
                      </span>
                    </td>
                    <td className="p-4 px-5 whitespace-nowrap">
                      {formatDate(user.dob)}
                    </td>
                    <td className="p-4 px-5 whitespace-nowrap rounded-r-2xl">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
