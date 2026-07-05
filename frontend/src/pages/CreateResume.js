import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateResume() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    skills: "",
    education: "",
    projects: "",
    objective: "",
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let err = {};
    if (!formData.name.trim()) err.name = "Required";
    if (!formData.email.trim()) err.email = "Required";
    if (!formData.skills.trim()) err.skills = "Required";
    if (!formData.education.trim()) err.education = "Required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // 🔥 NEW: Extract degree & branch from education text
  const extractEducationDetails = (educationText) => {
    const text = educationText.toLowerCase();

    let degree = "";
    let branch = "";

    // Degree detection
    if (text.includes("be")) degree = "be";
    else if (text.includes("b.tech") || text.includes("btech")) degree = "btech";
    else if (text.includes("bsc")) degree = "bsc";
    else if (text.includes("bca")) degree = "bca";

    // Branch detection
    if (text.includes("cse")) branch = "cse";
    else if (text.includes("ece")) branch = "ece";
    else if (text.includes("it")) branch = "it";
    else if (text.includes("mechanical")) branch = "mechanical";

    return { degree, branch };
  };

  const handleGenerate = () => {
    if (!validate()) return;

    const skillsArray = formData.skills
      .replace(/,/g, " ")
      .split(" ")
      .map((s) => s.trim())
      .filter(Boolean);

    // 🔥 NEW: Extract qualification
    const { degree, branch } = extractEducationDetails(formData.education);

    const data = {
      ...formData,
      skills: skillsArray,
      degree,
      branch,
      objective:
        formData.objective ||
        `Motivated professional skilled in ${skillsArray.join(
          ", "
        )}, seeking to contribute effectively in a growth-focused organization.`,
      image,
    };

    // 🔥 IMPORTANT: Save to localStorage (AUTO JOB MATCHING)
    localStorage.setItem("resumeData", JSON.stringify(data));

    navigate("/resume-result", {
      state: { resumeData: data },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">

      {/* 🌈 BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[120px] top-[-100px] left-[-100px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-600 opacity-20 blur-[120px] bottom-[-100px] right-[-100px]" />

      {/* 🔥 MAIN CARD */}
      <div className="relative z-10 w-full max-w-4xl p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">

        <h1 className="text-3xl font-semibold mb-8 text-center">
          Create Resume
        </h1>

        {/* PROFILE IMAGE */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition">

              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">Upload</span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* FORM */}
        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <input name="name" placeholder="Full Name *" onChange={handleChange} className="input" />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div>
            <input name="email" placeholder="Email *" onChange={handleChange} className="input" />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <input name="phone" placeholder="Phone" onChange={handleChange} className="input" />
          <input name="location" placeholder="Location" onChange={handleChange} className="input" />

          <div className="md:col-span-2">
            <input name="skills" placeholder="Skills *" onChange={handleChange} className="input" />
            {errors.skills && <p className="error">{errors.skills}</p>}
          </div>

          <div className="md:col-span-2">
            <textarea name="education" placeholder="Education * (e.g. B.E ECE)" onChange={handleChange} className="input h-24" />
            {errors.education && <p className="error">{errors.education}</p>}
          </div>

          <textarea name="projects" placeholder="Projects" onChange={handleChange} className="input md:col-span-2 h-24" />
          <textarea name="objective" placeholder="Professional Summary" onChange={handleChange} className="input md:col-span-2 h-24" />

        </div>

        {/* BUTTON */}
        <button
          onClick={handleGenerate}
          className="mt-10 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition"
        >
          Generate Resume
        </button>

      </div>

      {/* STYLE */}
      <style>
        {`
          .input {
            width: 100%;
            padding: 14px;
            border-radius: 10px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
          }

          .input::placeholder {
            color: #aaa;
          }

          .input:focus {
            border: 1px solid #a855f7;
            box-shadow: 0 0 10px rgba(168,85,247,0.4);
          }

          .error {
            color: #f87171;
            font-size: 12px;
            margin-top: 4px;
          }
        `}
      </style>

    </div>
  );
}

export default CreateResume;