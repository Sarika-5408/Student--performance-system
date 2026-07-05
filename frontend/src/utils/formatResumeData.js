export const formatResumeData = (data) => {
  // 🔹 SKILLS
  const skillsArray = Array.isArray(data.skills)
    ? data.skills
    : data.skills
    ? data.skills.split(",")
    : [];

  const cleanSkills = skillsArray
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const hasSkills = cleanSkills.length > 0;

  const skillsText = hasSkills
    ? cleanSkills.slice(0, 4).join(", ")
    : "";

  // 🔹 ROLE
  const role = cleanSkills.includes("React")
    ? "Frontend Developer"
    : cleanSkills.includes("Node")
    ? "Backend Developer"
    : cleanSkills.includes("C++")
    ? "Software Developer"
    : hasSkills
    ? "Technology Specialist"
    : "Aspiring Professional";

  // 🔹 SUMMARY
  const rawSummary = (data.summary || data.objective || "").trim();

  let improvedSummary = "";

  if (rawSummary) {
    if (hasSkills) {
      improvedSummary = `${role} with a strong foundation in ${skillsText}. ${improveSentence(
        rawSummary
      )}`;
    } else {
      improvedSummary = `${role}. ${improveSentence(rawSummary)}`;
    }
  } else {
    if (hasSkills) {
      improvedSummary = `${role} with a strong foundation in ${skillsText}. Passionate about building efficient and scalable solutions, with a focus on continuous learning and delivering high-quality results.`;
    } else {
      improvedSummary = `${role} passionate about learning new technologies and building practical solutions, with a strong focus on growth and continuous improvement.`;
    }
  }

  // 🔹 EDUCATION (ADVANCED CLEAN)
  const education = Array.isArray(data.education)
    ? data.education.map((e) => ({
        degree: cleanEducation(typeof e === "string" ? e : e.degree),
      }))
    : data.education
    ? [{ degree: cleanEducation(data.education) }]
    : [];

  function cleanEducation(text) {
    if (!text) return "";

    let t = text.toUpperCase();

    const degreeMap = {
      BTECH: "B.Tech",
      "B.TECH": "B.Tech",
      BE: "B.E",
      "B.E": "B.E",
      BSC: "B.Sc",
      "B.SC": "B.Sc",
      MSC: "M.Sc",
      "M.SC": "M.Sc",
      MBA: "MBA",
      DIPLOMA: "Diploma",
    };

    Object.keys(degreeMap).forEach((key) => {
      t = t.replace(new RegExp(key, "g"), degreeMap[key]);
    });

    let words = [...new Set(t.split(/[\s-]+/))];

    const branches = [
      "CSE",
      "ECE",
      "EEE",
      "IT",
      "MECH",
      "CIVIL",
      "AI",
      "DS",
      "CS",
    ];

    let degree = words.find((w) =>
      ["B.Tech", "B.E", "B.Sc", "M.Sc", "MBA", "Diploma"].includes(w)
    );

    let branch = words.find((w) => branches.includes(w));

    if (degree && branch) return `${degree} ${branch}`;
    if (degree && !branch) return `${degree} (General)`;
    if (!degree && branch) return `Bachelor in ${branch}`;

    return text
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // 🔹 PROJECTS (STRICT CLEAN - NO FAKE)
  let projects = [];

  if (Array.isArray(data.projects)) {
    projects = data.projects
      .map((p) => formatProject(p))
      .filter((p) => p.description);
  } else if (data.projects) {
    const formatted = formatProject(data.projects);
    if (formatted.description) {
      projects = [formatted];
    }
  }

  function formatProject(p) {
    if (typeof p === "string") {
      return {
        title: "",
        description: improveProjectText(p),
      };
    }

    return {
      title: p.title || "",
      description: improveProjectText(p.description || ""),
    };
  }

  function improveProjectText(text) {
    if (!text || text.trim() === "") return "";

    if (text.length < 30) {
      return `Developed ${text} with focus on functionality and performance.`;
    }

    return text;
  }

  function improveSentence(text) {
    if (!text) return "";

    if (text.length < 25) {
      return `${text}. Eager to apply skills in real-world projects and contribute effectively.`;
    }

    return text;
  }

  return {
    ...data,
    summary: improvedSummary,
    skills: cleanSkills,
    education,
    projects,
  };
};