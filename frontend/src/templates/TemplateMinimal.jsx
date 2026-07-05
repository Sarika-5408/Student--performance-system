const TemplateMinimal = ({ data, isPrint }) => {
  return (
    <div className={`${isPrint ? "bg-white text-black" : "bg-white/10 backdrop-blur-xl text-white border rounded-xl"} p-8`}>

      {/* IMAGE */}
      {data.image && (
        <div className="mb-4">
          <img
            src={data.image}
            alt="Profile"
            crossOrigin="anonymous"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>
      )}

      <h1 className="text-xl font-bold">{data.name}</h1>
      <p className="text-sm mb-4">{data.email}</p>

      {/* SUMMARY */}
      <div className={`mb-3 pb-2 ${isPrint ? "border-b border-gray-400" : "border-b border-white/20"}`}>
        <p className="text-sm leading-relaxed">
          {data.summary}
        </p>
      </div>

      {/* SKILLS */}
      <div className="mb-3">
        <h2 className="text-sm font-semibold uppercase mb-1">Skills</h2>

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

      {/* EDUCATION */}
      <div className="mb-3 text-sm">
        <h2 className="text-sm font-semibold uppercase mb-1">Education</h2>

        {data.education.map((e, i) => (
          <p key={i}>• {e.degree}</p>
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
  );
};

export default TemplateMinimal;