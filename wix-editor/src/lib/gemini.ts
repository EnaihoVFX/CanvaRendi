import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
];

export function getGeminiModel(modelName = "gemini-2.0-flash") {
  return genAI.getGenerativeModel({ model: modelName });
}

/**
 * Clean Gemini response text that may be wrapped in markdown code blocks
 */
export function cleanJsonResponse(text: string): string {
  // Remove markdown code block wrappers
  text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
  return text.trim();
}

/**
 * Call Gemini with automatic retry + model fallback on rate limit/model errors.
 * Tries up to 3 attempts per model, then falls back to the next model in the chain.
 */
export async function callGeminiWithRetry(
  prompt: string,
  options?: { maxRetries?: number; initialDelayMs?: number }
): Promise<string> {
  const maxRetries = options?.maxRetries ?? 2;
  const initialDelay = options?.initialDelayMs ?? 3000;
  let lastError: any = null;

  for (const modelName of MODEL_FALLBACK_CHAIN) {
    const model = getGeminiModel(modelName);

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log(`[GEMINI] Success with model: ${modelName}`);
        return response.text();
      } catch (err: any) {
        lastError = err;
        const status = err?.status || err?.httpStatusCode || 0;
        const msg = err?.message || '';

        const isRateLimit = status === 429 || msg.includes('429') || msg.includes('quota');
        const isModelNotFound = status === 404 || msg.includes('not found') || msg.includes('not supported');

        if (isModelNotFound) {
          // Model doesn't exist — skip to next model immediately
          console.log(`[GEMINI] Model ${modelName} not available, trying next...`);
          break;
        }

        if (isRateLimit && attempt < maxRetries) {
          // Exponential backoff with jitter
          const baseDelay = initialDelay * Math.pow(2, attempt);
          const jitter = Math.random() * 1000;
          const delay = baseDelay + jitter;
          console.log(`[GEMINI] Rate limited on ${modelName}, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (isRateLimit) {
          // Exhausted retries for this model, try next model
          console.log(`[GEMINI] Exhausted retries for ${modelName}, trying next model...`);
          break;
        }

        // Unknown error — throw immediately
        throw err;
      }
    }
  }

  throw lastError || new Error("All Gemini models exhausted. Please try again later.");
}

/**
 * The CanvasElement schema context for Gemini prompts.
 * This teaches Gemini how to produce valid element JSON.
 */
export const ELEMENT_SCHEMA_CONTEXT = `
## CanvasElement Schema

Each element MUST follow this exact structure:
{
  "id": "unique-string-id",
  "type": "<ElementType>",
  "pageId": "home",
  "bounds": { "x": number, "y": number, "width": number, "height": number },
  "zIndex": number,
  "locked": false,
  "hidden": false,
  "props": { ... type-specific properties }
}

## Supported Element Types and their props:

### "heading" / "paragraph" / "text"
props: { content: string, fontSize: number, fontFamily: string, fontWeight: number, color: string, textAlign: "left"|"center"|"right", lineHeight?: number, letterSpacing?: number }

### "image"
props: { src: string (URL), alt: string, objectFit: "cover"|"contain"|"fill", borderRadius?: number }

### "button"
props: { label: string, backgroundColor: string, textColor: string, borderRadius: number, borderWidth: number, borderColor: string, fontSize: number, fontWeight: number }

### "section"
props: { backgroundColor: string, paddingTop?: number, paddingBottom?: number }

### "box"
props: { backgroundColor: string, borderRadius: number, borderWidth: number, borderColor: string, shadow: "none"|"sm"|"md"|"lg" }

### "divider"
props: { color: string, thickness: number, style: "solid"|"dashed"|"dotted" }

### "social-icons"
props: { icons: [{ platform: string, url: string }], size: number, color: string, style: "filled"|"outline"|"minimal" }

### "contact-form"
props: { fields: [{ type: "text"|"email"|"phone"|"message", label: string, required: boolean }], submitLabel: string, submitColor: string }

### "testimonial"
props: { quote: string, author: string, role?: string, rating?: number }

## SiteTheme Schema
{
  "colors": { "primary": "#hex", "secondary": "#hex", "accent": "#hex", "background": "#hex", "text": "#hex" },
  "fonts": { "heading": "font-name", "body": "font-name" }
}

## Page Schema
{
  "id": "home",
  "name": "Home",
  "slug": "/",
  "isHomePage": true,
  "minHeight": number,
  "height": number,
  "sections": [{ "id": string, "name": string, "height": number, "backgroundColor": string, "elements": string[] }]
}
`;

/**
 * Industry-to-image-query mapping for curated image search
 */
export const INDUSTRY_IMAGE_QUERIES: Record<string, string[]> = {
  'restaurant': ['restaurant interior', 'food plating', 'dining ambiance', 'chef cooking', 'restaurant exterior', 'table setting'],
  'coffee': ['coffee shop', 'latte art', 'coffee beans', 'cafe interior', 'barista', 'coffee cup'],
  'tech': ['technology workspace', 'modern office', 'coding workspace', 'tech team meeting', 'digital innovation', 'laptop workspace'],
  'fitness': ['gym workout', 'fitness training', 'yoga studio', 'personal trainer', 'gym equipment', 'outdoor fitness'],
  'beauty': ['beauty salon', 'spa treatment', 'skincare products', 'hair styling', 'beauty products', 'salon interior'],
  'flowers': ['flower bouquet', 'florist shop', 'fresh flowers', 'flower arrangement', 'wedding flowers', 'flower garden'],
  'real estate': ['modern house', 'luxury apartment', 'home interior', 'architecture exterior', 'real estate office', 'neighborhood view'],
  'photography': ['camera equipment', 'photo studio', 'portrait photography', 'landscape photography', 'photography workspace', 'photo editing'],
  'fashion': ['fashion design', 'clothing store', 'fashion model', 'boutique interior', 'fashion accessories', 'textile patterns'],
  'education': ['classroom learning', 'students studying', 'library interior', 'online learning', 'teacher teaching', 'education technology'],
  'healthcare': ['medical office', 'healthcare professional', 'hospital interior', 'medical equipment', 'wellness clinic', 'patient care'],
  'default': ['professional workspace', 'business meeting', 'modern office', 'team collaboration', 'creative workspace', 'professional portrait'],
};

/**
 * Get image search queries for an industry
 */
export function getImageQueries(industry: string): string[] {
  const lowerIndustry = industry.toLowerCase();
  const key = Object.keys(INDUSTRY_IMAGE_QUERIES).find(k => lowerIndustry.includes(k));

  if (key) {
    return INDUSTRY_IMAGE_QUERIES[key];
  }

  // If no predefined match, use the industry term itself with variations
  return [
    industry,
    `${industry} professional`,
    `${industry} aesthetic`,
    `${industry} background`,
    `${industry} business`,
    `modern ${industry}`
  ];
}
