import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden px-4">

      {/* 🌈 BACKGROUND GLOW */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600 opacity-20 blur-[150px] top-[-150px] left-[-150px]" />
      <div className="absolute w-[600px] h-[600px] bg-blue-600 opacity-20 blur-[150px] bottom-[-150px] right-[-150px]" />

      {/* 🔥 HEADER */}
      <div className="text-center mb-12 z-10">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Role Radar
        </h1>
        <p className="text-sm opacity-70 mt-2">
          Build, improve, and grow your career with smart tools
        </p>
      </div>

      {/* 🔥 ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 z-10">

        {[
          {
            title: "Create Resume",
            desc: "Build a professional resume step-by-step with guided inputs",
            path: "/create",
            color: "purple",
          },
          {
            title: "Edit Resume",
            desc: "Improve and optimize your existing resume instantly",
            path: "/edit",
            color: "blue",
          },
          {
            title: "Job Vacancies",
            desc: "Discover job roles based on your skills and interests",
            path: "/jobs",
            color: "green",
          },
          {
            title: "Saved Jobs",
            desc: "View and manage your saved job listings",
            path: "/saved-jobs",
            color: "yellow",
          },
          {
            title: "Interview Prep",
            desc: "Practice role-based questions and prepare confidently",
            path: "/interview",
            color: "pink",
          },
        ].map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className={`
              group relative cursor-pointer w-[320px] p-8 rounded-2xl 
              bg-white/5 backdrop-blur-xl border border-white/10 
              transition duration-300 hover:scale-105

              ${item.color === "purple" && "hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:border-purple-400"}
              ${item.color === "blue" && "hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:border-blue-400"}
              ${item.color === "green" && "hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] hover:border-green-400"}
              ${item.color === "pink" && "hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] hover:border-pink-400"}
              ${item.color === "yellow" && "hover:shadow-[0_0_25px_rgba(234,179,8,0.6)] hover:border-yellow-400"}
            `}
          >
            <h2 className={`
              text-2xl font-semibold mb-2 
              ${item.color === "purple" && "group-hover:text-purple-400"}
              ${item.color === "blue" && "group-hover:text-blue-400"}
              ${item.color === "green" && "group-hover:text-green-400"}
              ${item.color === "pink" && "group-hover:text-pink-400"}
              ${item.color === "yellow" && "group-hover:text-yellow-400"}
            `}>
              {item.title}
            </h2>

            <p className="text-sm opacity-70">
              {item.desc}
            </p>
          </div>
        ))}

      </div>

      {/* 🔥 FOOTER */}
      <p className="mt-12 text-xs opacity-50 z-10">
        © 2026 Role Radar — Smart resumes, smarter careers
      </p>

    </div>
  );
}

export default Dashboard;