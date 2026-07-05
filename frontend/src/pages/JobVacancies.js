import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

function JobVacancies() {
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // 🔥 NEW: Saved Jobs
  const [savedJobs, setSavedJobs] = useState([]);

  // 🔥 Load saved jobs
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setSavedJobs(saved);
  }, []);

  // 🔥 Toggle Save
  const toggleSaveJob = (job) => {
    let updated;

    const exists = savedJobs.find(
      (item) => item.job_id === job.job_id
    );

    if (exists) {
      updated = savedJobs.filter(
        (item) => item.job_id !== job.job_id
      );
    } else {
      updated = [...savedJobs, job];
    }

    setSavedJobs(updated);
    localStorage.setItem("savedJobs", JSON.stringify(updated));
  };

  const isSaved = (job) => {
    return savedJobs.some((item) => item.job_id === job.job_id);
  };

  // 🔥 Fetch Jobs with cache
  const fetchJobs = useCallback(async (searchQuery) => {
    if (!searchQuery) return;

    const cacheKey = `${searchQuery}_${location}_${remoteOnly}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setJobs(JSON.parse(cached));
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        "https://jsearch.p.rapidapi.com/search",
        {
          params: {
            query: searchQuery,
            location: location || "India",
            page: "1",
            num_pages: "1",
          },
          headers: {
            "X-RapidAPI-Key": "9cb9231151msh3df96e3e1ba6114p17df07jsn7516d3d916a1",
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
          },
        }
      );

      let results = response.data.data || [];

      if (remoteOnly) {
        results = results.filter((job) => job.job_is_remote);
      }

      localStorage.setItem(cacheKey, JSON.stringify(results));
      setJobs(results);
    } catch (err) {
      console.error(err);
      alert("Error fetching jobs");
    }

    setLoading(false);
  }, [location, remoteOnly]);

  // Load resume skills
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("resumeData"));
    if (data?.skills) {
      setSkills(Array.isArray(data.skills) ? data.skills.join(" ") : data.skills);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-10 relative overflow-hidden">

      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600 opacity-20 blur-3xl top-10 left-10"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-600 opacity-20 blur-3xl bottom-10 right-10"></div>

      <h1 className="text-4xl font-bold mb-6 z-10">
        🔍 Smart Job Finder
      </h1>

      {/* Search */}
      <div className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-6 w-full max-w-md z-10">

        <input
          type="text"
          placeholder="Skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/50 border border-white/20"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 mt-3 rounded-lg bg-black/50 border border-white/20"
        />

        <label className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            checked={remoteOnly}
            onChange={() => setRemoteOnly(!remoteOnly)}
          />
          Remote Only
        </label>

        <button
          onClick={() => fetchJobs(skills)}
          className="mt-4 w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"
        >
          Search Jobs
        </button>
      </div>

      {/* Jobs */}
      <div className="mt-10 w-full max-w-3xl z-10">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : jobs.length > 0 ? (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div
                key={job.job_id}
                className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-xl p-5"
              >
                <h2
                  onClick={() => setSelectedJob(job)}
                  className="text-xl font-semibold cursor-pointer"
                >
                  {job.job_title}
                </h2>

                <p className="text-gray-300">{job.employer_name}</p>

                <button
                  onClick={() => toggleSaveJob(job)}
                  className={`mt-2 px-3 py-1 rounded ${
                    isSaved(job)
                      ? "bg-green-500"
                      : "bg-gray-700"
                  }`}
                >
                  {isSaved(job) ? "Saved ✓" : "Save"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-6 text-gray-400">
            Click search to find jobs
          </p>
        )}
      </div>

      {/* Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white/10 p-6 rounded-2xl w-full max-w-2xl">

            <h2 className="text-2xl font-bold">
              {selectedJob.job_title}
            </h2>

            <p>{selectedJob.employer_name}</p>

            <p className="text-sm text-gray-400">
              {selectedJob.job_city}, {selectedJob.job_country}
            </p>

            <p className="mt-4 text-sm">
              {selectedJob.job_description?.slice(0, 800)}
            </p>

            <div className="flex justify-between mt-6">
              <a
                href={selectedJob.job_apply_link}
                target="_blank"
                rel="noreferrer"
                className="bg-purple-500 px-4 py-2 rounded"
              >
                Apply
              </a>

              <button
                onClick={() => setSelectedJob(null)}
                className="bg-gray-700 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default JobVacancies;