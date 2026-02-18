
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { element, prompt } = body;

        if (!element || !prompt) {
            return NextResponse.json({ error: "Missing element or prompt" }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is not set");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `
    You are an AI assistant for a website builder. Your task is to modify a JSON representation of a UI element based on a user's request.
    
    The user will provide:
    1. The current JSON object of the element (CanvasElement).
    2. A natural language instruction (e.g., "Make the button red and round", "Change the text to 'Buy Now'").

    The element structure typically looks like this:
    {
      "id": "...",
      "type": "button", // or "heading", "paragraph", "image", etc.
      "pageId": "...",
      "bounds": { "x": 100, "y": 200, "width": 120, "height": 40 },
      "props": {
        "label": "Click Me",
        "backgroundColor": "#000000",
        "textColor": "#ffffff",
        "borderRadius": 0,
        // ... other CSS-like properties
      },
      "zIndex": 10
    }

    You must return ONLY the updated JSON object for the element. 
    - Do not wrap the JSON in markdown code blocks.
    - Ensure the JSON is valid.
    - Only modify properties in "props" or "bounds" (if resizing is implied). 
    - Do not change "id", "type", or "pageId".
    - Be creative with colors and styles if the user is vague (e.g. "make it pop").
    
    Current Element:
    ${JSON.stringify(element, null, 2)}

    User Prompt:
    ${prompt}
    `;

        try {
            const result = await model.generateContent(systemPrompt);
            const response = await result.response;
            let text = response.text();

            // Clean up potential markdown formatting
            text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
            // Sometimes it wraps in ``` w/o json
            text = text.replace(/^```\s*/, "");

            try {
                const updatedElement = JSON.parse(text);
                return NextResponse.json({ element: updatedElement });
            } catch (e) {
                console.error("JSON parse error", text);
                return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
            }
        } catch (apiError) {
            console.error("Gemini API Error:", apiError);
            return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
        }

    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
