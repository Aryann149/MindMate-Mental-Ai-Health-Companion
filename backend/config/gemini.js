const { GoogleGenAI } = require("@google/genai");

let client = null;

/**
 * Lazily initializes and returns the Gemini client.
 * Keeping this lazy avoids crashing the whole server on boot
 * if the API key is missing in a dev environment.
 *
 * NOTE: the old "@google/generative-ai" package + "gemini-1.5-flash" model
 * are both retired by Google (1.5-family models now return 404s, and that
 * SDK itself is end-of-life). We use the current unified "@google/genai"
 * SDK and a supported model instead.
 */
const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
};

const getGeminiModelName = () => process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

module.exports = { getGeminiClient, getGeminiModelName };
