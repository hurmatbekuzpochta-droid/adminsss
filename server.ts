import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return ai;
}

// API Routes
app.post("/api/chat", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { prompt, history } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const client = getGeminiClient();
    
    // Construct nice background instructions for Uzbek wisdom chat or normal helpful conversation
    const systemInstruction = 
      "Siz 'Hikmatlar AI Bot' ismli dono va muloyim maslahatchisiz. " +
      "Siz foydalanuvchilar bilan faqat va faqat o'zbek tilida muloqot qilasiz. " +
      "Har doim dono hikmatlar, ma'noli maslahatlar, o'zbek xalq maqollari yoki donishmandlar fikrlaridan namuna keltiring. " +
      "Juda samimiy, xushmuomala bo'ling.";

    const contents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        if (h && typeof h.text === "string" && h.text.trim()) {
          contents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          });
        }
      }
    }
    
    contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini server error:", error);
    res.status(500).json({ error: error.message || "Xatolik ro'y berdi" });
  }
});

// Serve frontend assets with Vite in dev, static folder in production
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Vite development server mode enabled");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Production mode: serving built static assets under 'dist/'");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Telegram Full-Stack server runs at http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch(err => {
  console.error("Failed to setup Express and Vite server:", err);
});
