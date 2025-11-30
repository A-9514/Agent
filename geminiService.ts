import { GoogleGenAI, Type } from "@google/genai";
import { ContentType, GeneratedResponse, Platform } from "./types";
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are OnboardFlow, a world-class Employee Experience Manager and HR Specialist. 
Your goal is to help companies create warm, organized, and beautiful onboarding experiences.
- For Welcome Messages: Write warm, exciting emails or Slack messages that make the new hire feel special.
- For Checklists: Create structured, step-by-step markdown checklists.
- For Guides: Create clear, encouraging role-specific guides or culture handbooks.
- For Kits: Generate a comprehensive bundle containing an Email, a Checklist, and an Icebreaker/Fun Fact relevant to the phase.

You must also analyze the "corporate vibe" of the generated content and provide a color palette (3 hex codes) that fits the company culture, and a short 1-2 word name for the vibe.`;

export const generateSocialContent = async (
  prompt: string,
  type: ContentType,
  tone: string,
  platform: Platform,
  employeeName: string,
  roleTitle: string,
  folderContext: string
): Promise<GeneratedResponse> => {
  try {
    let typeInstructions = '';
    
    // Customize instructions based on Folder Context + Type
    if (type === 'checklist') {
      typeInstructions = `Please provide a structured ${folderContext} checklist in markdown format with checkboxes.`;
    } else if (type === 'welcome') {
      typeInstructions = `Provide a warm, engaging message about ${folderContext} suitable for the selected platform.`;
    } else if (type === 'guide') {
      typeInstructions = `Create a structured guide for ${folderContext} with clear headings and a motivating intro.`;
    } else if (type === 'kit') {
      typeInstructions = `
        Generate a complete ${folderContext} Kit with these exact 3 sections formatted in Markdown:
        1. ## ✉️ Kickoff Email
           (Context: ${folderContext})
        2. ## ✅ Action Checklist
           (A concise 3-step list relevant to ${folderContext})
        3. ## 💡 Pro Tip / Fun Fact
           (Something useful or fun regarding ${folderContext})
      `;
    }

    const specificPrompt = `
      Onboarding Phase/Folder: ${folderContext}
      Task Type: ${type.toUpperCase()}
      Tone: ${tone}
      Platform Format: ${platform}
      
      Employee Name: ${employeeName}
      Role Title: ${roleTitle}
      Additional Context: ${prompt}
      
      ${typeInstructions}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: specificPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Slightly lower for professional consistency
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: {
              type: Type.STRING,
              description: "The generated markdown content."
            },
            moodColors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An array of 3 hex color codes representing the company vibe."
            },
            moodName: {
              type: Type.STRING,
              description: "A short creative name for the vibe (e.g., 'Modern Tech', 'Warm & Cozy')."
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response generated");
    }
    
    return JSON.parse(text) as GeneratedResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      content: "Error connecting to the onboarding engine. Please check your API key.",
      moodColors: ["#94a3b8", "#64748b", "#475569"],
      moodName: "System Error"
    };
  }
};