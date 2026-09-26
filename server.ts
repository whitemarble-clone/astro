import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Initialize Google GenAI with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Server-side Gemini API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, conversationHistory } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // If Gemini client is initialized, call Gemini 3.8 Flash
    if (ai) {
      try {
        const systemInstruction = 
          "You are CosmoGuide AI, the senior astronomy tutor and observatory fellow for the Astronomy Society LMS. " +
          "You provide scientifically rigorous, engaging, and clear explanations on astrophotography, telescope optics, celestial coordinates, " +
          "Messier deep-sky objects, planetary observation, Stellarium navigation, and course curriculum topics. " +
          "Keep responses structured, friendly, and practical for amateur and collegiate astronomers.";

        // Build history text if available
        let fullPrompt = prompt;
        if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
          const context = conversationHistory
            .slice(-6)
            .map((m: { sender: string; text: string }) => `${m.sender === 'user' ? 'Member' : 'CosmoGuide'}: ${m.text}`)
            .join('\n');
          fullPrompt = `Previous discussion:\n${context}\n\nMember Question: ${prompt}`;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: fullPrompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const reply = response.text || "Clear skies! I'm here to assist with your astronomical studies.";
        return res.json({ reply, source: 'gemini-3.8-flash' });
      } catch (err: any) {
        console.warn('Gemini API call failed, using astronomy fallback knowledge engine:', err?.message || err);
      }
    }

    // Astronomical Fallback Knowledge Engine (if API key not configured or transient error)
    const normalized = (prompt as string).toLowerCase();
    let reply = "";

    if (normalized.includes('polar') || normalized.includes('align') || normalized.includes('equatorial')) {
      reply = "🔭 **Polar Alignment Guide**:\n\n1. **Level the Tripod**: Ensure your mount's bubble level is centered before mounting optics.\n2. **Set Latitude**: Match your mount's altitude axis to your local geographical latitude.\n3. **Use a Polar Scope or Software**: Align Polaris (Northern Hemisphere) or Sigma Octantis (Southern Hemisphere) with the reticle reticle ring, accounting for the current hour angle.\n4. **Drift Alignment**: For precision astrophotography, monitor star drift on the meridian (azimuth tweak) and eastern/western horizon (altitude tweak).";
    } else if (normalized.includes('quiz') || normalized.includes('exam') || normalized.includes('score')) {
      reply = "📝 **Track Quiz Strategy**:\n\n- **Astrophotography**: Remember that Dark frames isolate thermal/fixed-pattern sensor noise, Flat frames correct vignetting and sensor dust motes, and Bias frames record readout noise at maximum shutter speed.\n- **Coordinates**: Right Ascension (RA) is measured in hours/minutes/seconds along the celestial equator, while Declination (Dec) is measured in degrees (-90° to +90°).\n- **Scoring**: You need 70% to earn verified certification, and 100% unlocks the coveted *Astrophysical Quiz Ace* badge!";
    } else if (normalized.includes('stellarium') || normalized.includes('planetarium')) {
      reply = "🌌 **Using Stellarium Web (`https://stellarium-web.org`)**:\n\n- Use the top navigation bar or course lessons to launch Stellarium.\n- Press **F3** or click the search icon to look up target Messier objects (e.g. M42, M31, M45).\n- Enable the **Atmosphere Toggle (A)** to simulate dark skies, and use the **Constellation Lines (C)** and **Labels (V)** keys to memorize star patterns.\n- Synchronize your local longitude and latitude for accurate real-time altitude & azimuth tracking.";
    } else if (normalized.includes('flat') || normalized.includes('dark') || normalized.includes('bias') || normalized.includes('calibration')) {
      reply = "📸 **Calibration Frames Summary**:\n\n- **Dark Frames**: Same exposure length, ISO, and sensor temperature as your light frames, but with the telescope aperture capped. Cancels thermal noise.\n- **Flat Frames**: Uniform light source (light panel or dusk sky) through the exact optical train and focus position. Compensates for optical vignetting and dust motes.\n- **Bias Frames**: Fastest possible shutter speed (e.g. 1/4000s or 1/8000s) with lens cap on. Captures the camera's baseline electronic readout pattern.";
    } else if (normalized.includes('event') || normalized.includes('calendar') || normalized.includes('perseid') || normalized.includes('eclipse')) {
      reply = "📅 **Astronomical Calendar Highlights**:\n\n- **Perseid Meteor Shower**: Peaks August 12-13 with up to 100 meteors/hour originating from comet Swift-Tuttle.\n- **Total Lunar Eclipse (Blood Moon)**: Occurs March 3, 2026, when Earth passes directly between the Sun and Moon, casting a coppery-red umbral shadow.\n- Check our **Special Events Calendar** tab in the sidebar for real-time countdowns, visibility predictions, and Bortle score tips!";
    } else {
      reply = `✨ **CosmoGuide Observatory Advisory**:\n\nRegarding "${prompt}":\n\nTo optimize your observational workflow:\n1. Check the target's celestial coordinates (RA & Dec) in our **Courses & Lessons**.\n2. Verify the lunar phase and local Bortle class in our **Special Events Calendar**.\n3. Test the target in **Stellarium Web** to verify it clears your local horizon and obstacles.\n4. Log your findings in the **Observational Logbook** to track telescopic metrics and atmospheric seeing!`;
    }

    return res.json({ reply, source: 'cosmoguide-knowledge-base' });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to process astronomical inquiry' });
  }
});

// Configure Vite middleware in development or static serve in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌌 Astronomy Society LMS Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
