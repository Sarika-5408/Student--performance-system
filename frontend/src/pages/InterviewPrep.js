import React, { useState, useEffect, useRef } from "react";

function InterviewPrep() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [count, setCount] = useState(5);
  const [company, setCompany] = useState("General");

  const [messages, setMessages] = useState([]);
  const [previousQuestions, setPreviousQuestions] = useState([]);

  const [mockMode, setMockMode] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState("");

  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const chatRef = useRef(null);

  // AUTO SCROLL
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // STREAM FUNCTION
  const streamResponse = async (prompt) => {
    let fullText = "";

    setMessages((prev) => [...prev, { sender: "ai", text: "" }]);

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }],
            stream: true,
          }),
        }
      );

      if (!response.ok) throw new Error("API error");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.trim());

        for (let line of lines) {
          if (line.includes("[DONE]")) break;

          if (line.startsWith("data:")) {
            try {
              const json = JSON.parse(line.replace("data:", "").trim());
              const content = json.choices?.[0]?.delta?.content;

              if (content) {
                let updatedText = fullText + content;

                updatedText = updatedText
                  .replace(/(\d+\.)/g, "\n\n$1")
                  .replace(/Answer:/gi, "\nAnswer:\n\n")
                  .replace(/\n{3,}/g, "\n\n");

                fullText = updatedText;

                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1].text = updatedText;
                  return updated;
                });
              }
            } catch {}
          }
        }
      }

      // CLEAN FINAL TEXT
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = updated[
          updated.length - 1
        ].text
          .replace(/\*\*/g, "")
          .replace(/\n{3,}/g, "\n\n");
        return updated;
      });

      // SAVE QUESTIONS
      setPreviousQuestions((prev) => {
        const newQs = extractQuestions(fullText);
        return [...prev, ...newQs];
      });

    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Something went wrong. Try again." },
      ]);
    }
  };

  // EXTRACT QUESTIONS
  const extractQuestions = (text) => {
    const matches = text.match(/^\d+\.?\s*(.*)/gm);
    return matches
      ? matches.map((q) => q.replace(/^\d+\.?\s*/, "").trim())
      : [];
  };

  // GENERATE Q&A
  const generateQA = async () => {
    if (!role.trim()) return alert("Enter role");
    if (!skills.trim()) return alert("Enter skills");
    if (count < 1 || count > 20) return alert("Enter 1–20 questions");

    setMockMode(false);
    setLoading(true);

    const userText = `${role} • ${skills} • ${company}`;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);

    try {
     const prompt = `You are an expert technical interviewer.

     Generate EXACTLY ${count} ${difficulty} level interview questions with answers.

     Company Context: ${company !== "General" ? company : "General industry"}

     Role: ${role}
     Skills: ${skills}

     Avoid repeating these questions:
     ${previousQuestions.join("\n")}

     IMPORTANT RULES:
     - MUST generate exactly ${count} questions
     - DO NOT add intro text
     - DO NOT add explanation outside format
     - DO NOT skip numbering
     - DO NOT merge answers

     FORMAT STRICTLY LIKE THIS:

     1. Question
     Answer:
     Line 1 explanation
     Line 2 explanation

     2. Question
     Answer:
     Line 1 explanation
     Line 2 explanation

     Continue until ${count}.`;

      await streamResponse(prompt);

    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Failed to generate questions." },
      ]);
    }

    setLoading(false);
  };

  // MOCK INTERVIEW
  const startMock = async () => {
    if (!role.trim()) return alert("Enter role");

    setMessages([]);
    setQuestions([]);
    setAnswers({});
    setResult("");
    setMockMode(true);
    setLoading(true);

    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "user",
                content: `Generate 5 ${difficulty} interview questions only for ${role}`,
              },
            ],
          }),
        }
      );

      const data = await res.json();
      let raw = data.choices[0].message.content;

      const qs = extractQuestions(raw).filter((q) => q.length > 10);
      setQuestions(qs);

    } catch {
      alert("Mock failed");
    }

    setLoading(false);
  };

  const evaluateAll = async () => {
    const combined = questions.map((q, i) =>
      `Q: ${q}\nA: ${answers[i] || "No answer"}`
    ).join("\n\n");

    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "user",
                content: `Evaluate these answers.

Give:
- Score out of 10
- Strengths
- Weaknesses
- Final verdict

${combined}`,
              },
            ],
          }),
        }
      );

      const data = await res.json();
      setResult(data.choices[0].message.content);

    } catch {
      setResult("⚠️ Evaluation failed");
    }
  };

  // CUSTOM DROPDOWN
  const CustomDropdown = ({ value, setValue, options, name }) => (
    <div className="relative">
      <div
        onClick={() =>
          setOpenDropdown(openDropdown === name ? null : name)
        }
        className="input bg-black border border-purple-500 cursor-pointer flex justify-between items-center"
      >
        {value}
        <span>▼</span>
      </div>

      {openDropdown === name && (
        <div className="absolute w-full mt-1 bg-black border border-purple-500 rounded z-50 shadow-lg">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                setValue(opt);
                setOpenDropdown(null);
              }}
              className="px-3 py-2 hover:bg-purple-600 cursor-pointer"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start pt-10 relative overflow-hidden px-4">

      <div className="absolute w-[600px] h-[600px] bg-purple-600 opacity-20 blur-[150px] top-[-150px] left-[-150px]" />
      <div className="absolute w-[600px] h-[600px] bg-blue-600 opacity-20 blur-[150px] bottom-[-150px] right-[-150px]" />

      <div className="text-center mb-8 z-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Interview Prep
        </h1>
        <p className="text-sm opacity-70 mt-2">
          Practice smarter, perform better
        </p>
      </div>

      <div className="w-full max-w-3xl z-10 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">

        {/* CHAT */}
        <div ref={chatRef} className="min-h-[80px] max-h-64 overflow-y-auto mb-4 flex flex-col gap-2">
          {messages
            .filter((m) => m.text && m.text.trim() !== "")
            .map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[80%] ${
                  m.sender === "user"
                    ? "ml-auto bg-purple-600/20"
                    : "bg-white/10"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {m.text.trim()}
                </div>
              </div>
            ))}
        </div>

        {/* MOCK */}
        {mockMode && (
          <div className="space-y-3 mb-4">
            {questions.map((q, i) => (
              <div key={i}>
                <p className="text-sm mb-1">{q}</p>
                <textarea
                  className="w-full p-2 rounded bg-white/10"
                  onChange={(e) =>
                    setAnswers({ ...answers, [i]: e.target.value })
                  }
                />
              </div>
            ))}

            <button onClick={evaluateAll} className="bg-green-600 px-4 py-2 rounded">
              Submit
            </button>

            {result && <p className="mt-2 whitespace-pre-wrap">{result}</p>}
          </div>
        )}

        {/* INPUT */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          <input value={role} onChange={(e)=>setRole(e.target.value)} placeholder="Role" className="input"/>
          <input value={skills} onChange={(e)=>setSkills(e.target.value)} placeholder="Skills" className="input"/>

          <CustomDropdown
            value={difficulty}
            setValue={setDifficulty}
            options={["beginner","intermediate","advanced"]}
            name="difficulty"
          />

          <input type="number" value={count} onChange={(e)=>setCount(Number(e.target.value))} className="input"/>

          <CustomDropdown
            value={company}
            setValue={setCompany}
            options={["General","Google","Amazon","Microsoft","TCS","Infosys","Wipro"]}
            name="company"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={generateQA} className="flex-1 py-2 rounded bg-gradient-to-r from-purple-600 to-blue-600">
            {loading ? "Loading..." : "Generate"}
          </button>
          <button onClick={startMock} className="flex-1 py-2 rounded bg-white/10 border border-white/20">
            Mock Interview
          </button>
        </div>
      </div>

      <style>{`
        .input {
          padding: 10px;
          background: rgba(255,255,255,0.08);
          border-radius: 8px;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default InterviewPrep;