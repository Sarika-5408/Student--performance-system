const TemplateModern = ({ data, isPrint }) => {
  return (
    <div className={`p-8 ${isPrint ? "bg-white text-black" : "bg-white/10 backdrop-blur-xl text-white border rounded-xl"}`}>

      {/* HEADER */}
      <div className="flex items-center gap-6 mb-6">
        {data.image && (
          <img
            src={data.image}
            alt="Profile"
            crossOrigin="anonymous"
            className="w-24 h-24 rounded-full object-cover border"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <p className="text-sm opacity-80">{data.email}</p>
        </div>
      </div>

      <div className="flex gap-6">

        {/* LEFT */}
        <div className={`w-1/3 text-sm pr-4 ${isPrint ? "border-r border-gray-400" : "border-r border-white/20"}`}>
          <h2 className="font-semibold uppercase mb-2">Skills</h2>

          {/* ✅ UPDATED SKILLS */}
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs border rounded"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-2/3 text-sm pl-4">

          {/* SUMMARY */}
          <div className={`mb-4 pb-2 ${isPrint ? "border-b border-gray-400" : "border-b border-white/20"}`}>
            <h2 className="font-semibold uppercase mb-2">Summary</h2>

            {/* ✅ UPDATED SUMMARY */}
            <p className="text-sm leading-relaxed">
              {data.summary}
            </p>
          </div>

          {/* EDUCATION */}
          <div className={`mb-4 pb-2 ${isPrint ? "border-b border-gray-400" : "border-b border-white/20"}`}>
            <h2 className="font-semibold uppercase mb-2">Education</h2>

            {data.education.map((e, i) => (
              <p key={i} className="text-sm">
                • {e.degree}
              </p>
            ))}
          </div>

          {/* PROJECTS */}
          {data.projects && data.projects.length > 0 && (
           <div>
             <h2 className="font-semibold uppercase mb-2">Projects</h2>

             {data.projects.map((p, i) => (
               <p key={i}>
                 {p.title && <b>{p.title} - </b>}
                 {p.description}
               </p>
             ))}
           </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TemplateModern;