import { useNavigate } from "react-router-dom";

function AIChat() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold mb-8">🚀 Role Radar</h1>
      <p className="text-gray-300 mb-10">
        What would you like to do today?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[80%] max-w-3xl">

        {/* Edit Resume */}
        <div
          onClick={() => navigate("/edit")}
          className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 cursor-pointer hover:scale-105 transition"
        >
          <h2 className="text-xl font-semibold mb-2">📄 Edit Resume</h2>
          <p className="text-gray-300 text-sm">
            Upload your resume and improve it professionally
          </p>
        </div>

        {/* Create Resume */}
        <div
          onClick={() => navigate("/create")}
          className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 cursor-pointer hover:scale-105 transition"
        >
          <h2 className="text-xl font-semibold mb-2">🆕 Create Resume</h2>
          <p className="text-gray-300 text-sm">
            Build a new professional resume from scratch
          </p>
        </div>

        {/* Jobs */}
        <div
          onClick={() => alert("Job module coming next 🚀")}
          className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 cursor-pointer hover:scale-105 transition"
        >
          <h2 className="text-xl font-semibold mb-2">🌍 Job Vacancies</h2>
          <p className="text-gray-300 text-sm">
            Find jobs based on your skills and location
          </p>
        </div>

        {/* Interview */}
        <div
          onClick={() => alert("Interview module coming next 🎯")}
          className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 cursor-pointer hover:scale-105 transition"
        >
          <h2 className="text-xl font-semibold mb-2">🎯 Interview Prep</h2>
          <p className="text-gray-300 text-sm">
            Practice and prepare for interviews
          </p>
        </div>

      </div>
    </div>
  );
}

export default AIChat;