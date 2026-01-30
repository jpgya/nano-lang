import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize client only if key exists (handled safely in UI)
const getAiClient = () => {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates NanoLang code based on a natural language description.
 */
export const generateNanoCode = async (prompt: string, language: Language): Promise<string | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  const langInstruction = language === 'ja' ? 'Comments and strings inside code should be in Japanese if appropriate.' : '';

  const fullPrompt = `
    You are an expert programmer in "NanoLang".
    NanoLang Syntax Rules:
    1. To print: say "text" or say variable
    2. To assign variables: set name = value
    3. To loop: repeat number ... end
    4. To check condition: check condition ... end
    5. To comment: note comment text
    6. No semicolons needed.
    7. Use indentation for blocks inside repeat/check.

    Task: Write NanoLang code that does the following: "${prompt}".
    ${langInstruction}
    Return ONLY the code. Do not use markdown backticks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: fullPrompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini generation error:", error);
    return null;
  }
};

/**
 * Explains NanoLang code.
 */
export const explainNanoCode = async (code: string, language: Language): Promise<string | null> => {
    const ai = getAiClient();
    if (!ai) return null;

    const langInstruction = language === 'ja' ? 'Explain in Japanese.' : 'Explain in English.';

    const fullPrompt = `
      ${langInstruction}
      Explain the following "NanoLang" code in simple terms for a beginner:
      ${code}

      Keep it brief and encouraging.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-latest',
        contents: fullPrompt,
      });
      return response.text.trim();
    } catch (error) {
      console.error("Gemini explanation error:", error);
      return null;
    }
};

/**
 * Converts JavaScript code to NanoLang.
 */
export const convertJsToNano = async (jsCode: string): Promise<string | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  const fullPrompt = `
    Convert the following JavaScript code into "NanoLang".
    
    NanoLang Rules:
    - console.log(x) -> say x
    - let/const/var x = y -> set x = y
    - if (cond) {} -> check cond ... end
    - for loops -> repeat number ... end (simplify if possible)
    - // comment -> note comment
    
    If a JavaScript feature is too complex for NanoLang, simplify it or add a 'note' explaining it's not supported.
    
    JavaScript Code:
    ${jsCode}

    Return ONLY the NanoLang code. No markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: fullPrompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini conversion error:", error);
    return null;
  }
};