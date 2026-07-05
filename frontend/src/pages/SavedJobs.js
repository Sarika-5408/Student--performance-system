import React, { useEffect, useState } from "react";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // 🔥 Load saved jobs
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setSavedJobs(data);
  }, []);

  // 🔥 Remove job
  const removeJob = (jobId) => {
    const updated = savedJobs.filter((job) => job.job_id !== jobId);
    setSavedJobs(updated);
    localStorage.setItem("savedJobs", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-10 relative overflow-hidden">

      {/* 🌈 Glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600 opacity-20 blur-3xl top-10 left-10"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-600 opacity-20 blur-3xl bottom-10 right-10"></div>

      <h1 className="text-4xl font-bold mb-6 z-10">
        💾 Saved Jobs
      </h1>

      {/* Jobs List */}
      <div className="w-full max-w-3xl z-10">
        {savedJobs.length > 0 ? (
          <div className="grid gap-6">
            {savedJobs.map((job) => (
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

                <p className="text-gray-300">
                  {job.employer_name}
                </p>

                <p className="text-sm text-gray-400">
                  {job.job_city
                    ? `${job.job_city}, ${job.job_country}`
                    : job.job_country || "Location not specified"}
                </p>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => removeJob(job.job_id)}
                    className="bg-red-500 px-3 py-1 rounded"
                  >
                    Remove
                  </button>

                  <a
                    href={job.job_apply_link}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-purple-500 px-3 py-1 rounded"
                  >
                    Apply
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">
            No saved jobs yet
          </p>
        )}
      </div>

      {/* 🔥 Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">

            <h2 className="text-2xl font-bold mb-2">
              {selectedJob.job_title}
            </h2>

            <p className="text-gray-300">
              {selectedJob.employer_name}
            </p>

            <p className="text-sm text-gray-400 mb-4">
              {selectedJob.job_city}, {selectedJob.job_country}
            </p>

            <p className="text-sm text-gray-300 whitespace-pre-line">
              {selectedJob.job_description?.slice(0, 1000) ||
                "No description available"}
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

export default SavedJobs;