import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditResume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Analyzing...");
  const navigate = useNavigate();

  // 🔥 Animated AI messages
  useEffect(() => {
    if (!loading) return;

    const steps = [
      "Reading your resume...",
      "Analyzing content...",
      "Fixing grammar & structure...",
      "Optimizing for ATS...",
      "Generating professional resume..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      setLoadingText(steps[i % steps.length]);
      i++;
    }, 1500);

    return () => clearInterval(interval);
  }, [loading]);

  const handleUpload = async () => {
    if (!file) return alert("Please upload your resume");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await axios.post(
         "https://role-rador-backend.onrender.com/api/resume/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTimeout(() => {
        navigate("/resume-result", {
          state: { resumeData: res.data.data },
        });
      }, 1000);

    } catch (err) {
      alert("Upload failed");
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  // 🧠 AI LOADING SCREEN
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">

        {/* Glow */}
        <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-20 blur-[120px]"></div>

        {/* Loader */}
        <div className="relative z-10 flex flex-col items-center">

          {/* Animated Circle */}
          <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-6"></div>

          <h1 className="text-2xl font-semibold mb-2">
            {loadingText}
          </h1>

          <p className="text-gray-400 text-sm">
            AI is working on your resume...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">

      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[120px] top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-600 opacity-20 blur-[120px] bottom-[-100px] right-[-100px]"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-3xl p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-center">

        <h1 className="text-5xl font-bold mb-4">
          Upload Your Resume 🚀
        </h1>

        <p className="text-gray-400 mb-8">
          Transform your resume into a professional format instantly
        </p>

        {/* Upload Box */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative group border border-white/20 rounded-2xl p-12 cursor-pointer transition hover:border-purple-400 hover:bg-white/10"
        >
          {!file ? (
            <>
              <div className="text-6xl mb-4 group-hover:scale-110 transition">
                📤
              </div>

              <p className="text-xl font-semibold">
                Drag & Drop your resume
              </p>

              <p className="text-gray-400 text-sm mt-2">
                or click to browse (PDF, DOCX)
              </p>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </>
          ) : (
            <>
              <div className="text-5xl mb-2 animate-pulse">✅</div>
              <p className="font-semibold text-lg">{file.name}</p>
              <p className="text-green-400 text-sm">Ready to analyze</p>
            </>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleUpload}
          className="mt-10 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-lg font-semibold hover:scale-105 transition"
        >
          Analyze with AI
        </button>

      </div>
    </div>
  );
}

export default EditResume;