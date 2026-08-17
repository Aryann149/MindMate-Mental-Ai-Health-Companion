const { getGeminiClient, getGeminiModelName } = require("../config/gemini");

/**
 * Small wrapper so every call site uses the same @google/genai calling
 * convention: ai.models.generateContent({ model, contents }) -> response.text
 */
const generateText = async (prompt) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: getGeminiModelName(),
    contents: prompt,
  });
  return response.text;
};

/**
 * All Gemini prompts in this file are constrained to general wellness
 * coaching. They must never diagnose a condition, name a disorder,
 * suggest medication, or claim to be a substitute for professional care.
 */

const SAFETY_SYSTEM_PREAMBLE = `You are the wellness assistant inside "MindMate", a self-care tracking app.
STRICT RULES YOU MUST ALWAYS FOLLOW:
1. You are NOT a therapist, doctor, or counselor. Never diagnose any mental health condition or disorder.
2. Never suggest, name, or discuss medications or clinical treatments.
3. Only offer general, well-known self-care and wellness practices (breathing exercises, mindfulness, sleep hygiene, gentle movement, journaling, hydration, stretching, grounding techniques, social connection).
4. If content suggests the person may be in crisis or at risk of harming themselves or others, do NOT attempt to counsel them yourself. Instead, gently encourage them to reach out to a trusted person or a professional/crisis service, and keep your own response brief and caring.
5. Always keep a warm, supportive, non-clinical tone.
6. Keep responses concise and practical.`;

const safeParseJSON = (text) => {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
};

/**
 * Analyzes a journal entry and returns structured wellness insight.
 * Never returns a diagnosis — output shape is constrained to sentiment,
 * stress indicators, themes, and general self-care suggestions.
 */
const analyzeJournalEntry = async (entryText) => {
  const prompt = `${SAFETY_SYSTEM_PREAMBLE}

Analyze the following personal journal entry and return ONLY a JSON object
(no markdown, no preamble) with this exact shape:

{
  "sentiment": "positive" | "neutral" | "negative" | "mixed",
  "sentimentScore": number between -1 and 1,
  "stressIndicators": string[] (short phrases, general wellness language only, e.g. "mentions work overload"),
  "recurringThemes": string[] (short phrases),
  "positiveHabits": string[] (things the person is already doing well),
  "areasToImprove": string[] (general wellness areas, never clinical language),
  "suggestions": string[] (2-4 general self-care suggestions, e.g. breathing exercise, short walk, sleep hygiene tip),
  "riskLevel": "none" | "low" | "moderate" | "elevated" (elevated ONLY if there are explicit, repeated indications of severe distress or self-harm language; otherwise "none" or "low")
}

Journal entry:
"""
${entryText}
"""`;

  const text = await generateText(prompt);
  const parsed = safeParseJSON(text);

  if (!parsed) {
    return {
      sentiment: "neutral",
      sentimentScore: 0,
      stressIndicators: [],
      recurringThemes: [],
      positiveHabits: [],
      areasToImprove: [],
      suggestions: ["Take a few slow, deep breaths and revisit this entry later."],
      riskLevel: "none",
    };
  }
  return parsed;
};

/**
 * Chat assistant reply — general wellness coaching only.
 * `history` is an array of { role: "user"|"model", text } for short-term context.
 */
const getChatReply = async (message, history = []) => {
  const historyText = history
    .slice(-6)
    .map((h) => `${h.role === "user" ? "User" : "MindMate"}: ${h.text}`)
    .join("\n");

  const prompt = `${SAFETY_SYSTEM_PREAMBLE}

Conversation so far:
${historyText || "(no prior messages)"}

User: ${message}

Reply as MindMate in 2-5 short sentences. Offer practical, general wellness
suggestions relevant to what the user said (breathing, meditation, walking,
hydration, sleep tips, gentle stretching, journaling prompts, grounding
techniques). End with a brief, warm note reminding them this is general
wellness support, not medical advice, ONLY if the topic is emotionally
sensitive — don't repeat this disclaimer for casual/light messages.`;

  const text = await generateText(prompt);
  return text.trim();
};

/**
 * Generates a natural-language weekly summary from pre-computed stats + flags.
 */
const generateWeeklySummaryText = async (stats) => {
  const prompt = `${SAFETY_SYSTEM_PREAMBLE}

Here is a user's wellness data summary for the past week (JSON):
${JSON.stringify(stats)}

Write a short (4-6 sentence), warm, encouraging weekly wellness summary in
plain language. Mention 1-2 positives, gently note any concerning patterns
using general wellness framing (never clinical/diagnostic language), and end
with one concrete, general self-care suggestion for the coming week.`;

  const text = await generateText(prompt);
  return text.trim();
};

module.exports = { analyzeJournalEntry, getChatReply, generateWeeklySummaryText };
