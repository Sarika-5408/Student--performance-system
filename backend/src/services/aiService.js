const fetch = require('node-fetch');
const logger = require('../config/logger');

// ─── HuggingFace Inference API ────────────────────────────────────────────────
const callHuggingFace = async (prompt, maxTokens = 1024) => {
  const model = process.env.HUGGINGFACE_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3';
  const url = `https://api-inference.huggingface.co/models/${model}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: maxTokens,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
        return_full_text: false,
      },
    }),
    timeout: 60000,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HuggingFace API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  // Handle loading state
  if (data.error && data.error.includes('loading')) {
    await new Promise((r) => setTimeout(r, 20000));
    return callHuggingFace(prompt, maxTokens);
  }

  if (Array.isArray(data) && data[0]?.generated_text) {
    return data[0].generated_text.trim();
  }

  throw new Error('Unexpected HuggingFace response format');
};

// ─── Ollama Local LLM ─────────────────────────────────────────────────────────
const callOllama = async (prompt, maxTokens = 1024) => {
  const url = `${process.env.OLLAMA_URL || 'http://localhost:11434'}/api/generate`;
  const model = process.env.OLLAMA_MODEL || 'llama3';

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: { num_predict: maxTokens, temperature: 0.7 },
    }),
    timeout: 120000,
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = await response.json();
  return data.response?.trim() || '';
};

// ─── Main AI call dispatcher ──────────────────────────────────────────────────
const callAI = async (prompt, maxTokens = 1024) => {
  const useOllama = process.env.USE_OLLAMA === 'true';
  
  try {
    if (useOllama) {
      return await callOllama(prompt, maxTokens);
    }
    return await callHuggingFace(prompt, maxTokens);
  } catch (error) {
    logger.error('AI call failed:', error.message);
    throw new Error('AI service temporarily unavailable. Please try again.');
  }
};

// ─── Prompt Templates ─────────────────────────────────────────────────────────

const improveResumePrompt = (resumeText) => `
You are an expert resume editor and career coach. Improve the following resume for clarity, professionalism, grammar, structure, and impact. 

Maintain all factual information but:
- Fix grammar and spelling errors
- Use strong action verbs
- Make bullet points concise and achievement-focused
- Improve professional tone
- Add relevant keywords for ATS (Applicant Tracking Systems)
- Structure: Contact → Summary → Experience → Education → Skills → Projects

Original Resume:
${resumeText}

Improved Resume:
`;

const createResumePrompt = (formData) => `
You are an expert resume writer. Create a professional resume based on this information:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Location: ${formData.location || 'Not provided'}

Professional Summary: ${formData.summary || 'To be written based on experience'}

Education:
${(formData.education || []).map((e) =>
  `- ${e.degree} in ${e.field} from ${e.institution} (${e.startYear}–${e.endYear})${e.gpa ? ', GPA: ' + e.gpa : ''}`
).join('\n')}

Work Experience:
${(formData.experience || []).map((e) =>
  `- ${e.role} at ${e.company} (${e.startDate} – ${e.current ? 'Present' : e.endDate})\n  ${e.description}`
).join('\n')}

Skills: ${(formData.skills || []).join(', ')}

Projects:
${(formData.projects || []).map((p) =>
  `- ${p.name}: ${p.description} | Tech: ${p.technologies}${p.url ? ' | URL: ' + p.url : ''}`
).join('\n')}

Create a complete, professional resume in plain text format with clear sections. Use strong action verbs and quantify achievements where possible.

Professional Resume:
`;

const generateInterviewQuestionsPrompt = (role, level, context) => `
You are an expert interview coach. Generate 8 thoughtful interview questions for a ${level} ${role} position.

Mix of:
- 3 behavioral questions (STAR format)
- 3 technical/role-specific questions  
- 2 situational questions

${context ? `Additional context: ${context}` : ''}

Format each question with a number and brief hint about what the interviewer is looking for.

Interview Questions:
`;

const evaluateAnswerPrompt = (question, answer, role) => `
You are an expert interview coach for ${role} positions. Evaluate this interview answer:

Question: ${question}

Candidate's Answer: ${answer}

Provide:
1. Score (1-10)
2. Strengths of the answer
3. Areas for improvement
4. A model answer example
5. Key points the candidate missed

Keep feedback constructive and specific.

Evaluation:
`;

const internshipGuidancePrompt = (field, level) => `
You are a career advisor specializing in internships. Provide comprehensive guidance for a ${level} student seeking internships in ${field}.

Include:
1. Top 5 platforms to find internships (with URLs)
2. How to make your profile stand out
3. Key skills to highlight for ${field}
4. Application timeline and strategy
5. How to prepare for internship interviews
6. Red flags to avoid
7. Negotiation tips

Make advice practical and actionable.

Guidance:
`;

module.exports = {
  callAI,
  prompts: {
    improveResume: improveResumePrompt,
    createResume: createResumePrompt,
    generateInterviewQuestions: generateInterviewQuestionsPrompt,
    evaluateAnswer: evaluateAnswerPrompt,
    internshipGuidance: internshipGuidancePrompt,
  },
};
