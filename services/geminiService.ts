
// Fix: Replaced EmotionalState with FeelingOption as EmotionalState is not defined in types.ts
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MotivationalQuote, FeelingOption, ChatMessage, GratitudeEntry } from '../types';
import { CHAPTER_1_CONTENT, FULL_BOOK_CONTENT } from './bookContent'; // Import specific book contents

if (!process.env.API_KEY) {
  // This error will be thrown when the module is loaded if API_KEY is not set.
  // App.tsx will catch this if getAiClient is called without API_KEY
}

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set. Please configure it to use the Gemini API.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Fix: Changed EmotionalState to FeelingOption
const getPromptForDailyMessage = (state?: FeelingOption): string => {
  let emotionalContext = "en general";
  if (state) {
    emotionalContext = `específicamente para alguien que siente: "${state}"`;
  }

  return `Eres "Brilla AI", una IA empática y motivacional. Por favor, proporciona un mensaje inspirador y breve (1-2 frases) en español para hoy, ${emotionalContext}. También indica el autor del mensaje. Si el autor es desconocido o el mensaje es un proverbio popular, usa 'Autor Desconocido' o 'Proverbio Popular'.
Formatea tu respuesta estrictamente como un objeto JSON con dos claves: "frase" (string) y "autor" (string).
No incluyas markdown en la respuesta JSON. Asegúrate que el JSON sea válido.
Ejemplo de respuesta:
{
  "frase": "Cada día es una nueva oportunidad para cambiar tu vida.",
  "autor": "Autor Desconocido"
}`;
};

const getPromptForAIChat = (userPrompt: string, history: ChatMessage[], isPremiumUser: boolean): string => {
  const historyString = history.slice(-6) // Increased history slightly for better context
    .map(m => `${m.sender === 'user' ? 'Usuario' : 'Brilla AI'}: ${m.text}`)
    .join('\n');
  
  const bookContentToUse = isPremiumUser ? FULL_BOOK_CONTENT : CHAPTER_1_CONTENT;
  const MAX_BOOK_CONTENT_LENGTH = 150000; 
  const truncatedBookContent = bookContentToUse.length > MAX_BOOK_CONTENT_LENGTH 
    ? bookContentToUse.substring(0, MAX_BOOK_CONTENT_LENGTH) + "... (contenido del libro truncado)"
    : bookContentToUse;

  return `Eres "Brilla AI", una IA conversacional excepcionalmente cálida, empática y humana para la app "Brilla". Tu objetivo es ayudar a las usuarias a reconectar consigo mismas, ganar claridad y construir una marca personal auténtica, como si fueras una amiga sabia y comprensiva chateando por WhatsApp.

BASA TUS RESPUESTAS PRIMORDIALMENTE EN EL SIGUIENTE TEXTO EXTRAÍDO DEL LIBRO 'DESCUBRIRTE PARA BRILLAR' DE CANDY DÍAZ:
--- INICIO DEL CONTENIDO DEL LIBRO ---
${truncatedBookContent}
--- FIN DEL CONTENIDO DEL LIBRO ---

**Instrucciones de Formato y Tono:**
1.  **Tono Muy Humano:** Usa un lenguaje cercano, amigable y alentador. Evita respuestas robóticas o demasiado formales. Imagina que estás consolando o aconsejando a una amiga.
2.  **Respuestas Divididas:** Estructura tu respuesta completa en 2 o 3 mensajes cortos y concisos, separados por \`---MSG_BREAK---\`. Esto simula el flujo de una conversación natural en un chat. No uses el separador si tu respuesta es naturally muy corta (una sola frase).
3.  **Integración del Libro:** Si la pregunta del usuario se puede responder con el libro, prioriza esa información. Puedes citar o parafrasear partes del libro si es relevante, integrándolo de forma fluida. Si el libro no cubre el tema, usa tu conocimiento general manteniendo el tono y principios del libro.
4.  **Sin Autoreferencia:** No menciones que eres un modelo de lenguaje. No digas "Según el libro..." a menos que sea muy natural.
5.  **Ejemplo de Respuesta Dividida:**
    Usuario: "Me siento muy abrumada últimamente."
    Brilla AI: "Entiendo perfectamente cómo te sientes, a veces la vida nos pone mucho encima.---MSG_BREAK---Recuerda respirar profundo, ¿has intentado dedicar unos minutos solo para ti hoy?---MSG_BREAK---Pequeños momentos de calma pueden hacer una gran diferencia."

Historial reciente de la conversación:
${historyString}

Usuario actual: "${userPrompt}"
Brilla AI:`;
};

const getPromptForWeeklySummary = (weeklyEntries: GratitudeEntry[]): string => {
  const entriesSummary = weeklyEntries.map(entry => {
    let summary = `Fecha: ${entry.date}\n`;
    if (entry.moodEmoji) summary += `Animo: ${entry.moodEmoji}\n`;
    if (entry.achievements && entry.achievements.length > 0) {
      summary += `Logros: ${entry.achievements.filter(a => a.text).map(a => `${a.text} (${a.completed ? 'Completado' : 'Pendiente'})`).join(', ')}\n`;
    }
    if (entry.gratitudes && entry.gratitudes.length > 0) {
      summary += `Agradecimientos: ${entry.gratitudes.filter(g => g).join(', ')}\n`;
    }
    if (entry.learnedToday) summary += `Aprendizaje: ${entry.learnedToday}\n`;
    if (entry.negativeToPositive && (entry.negativeToPositive.despite || entry.negativeToPositive.flowedBecause)) {
      summary += `Transformación: A pesar de '${entry.negativeToPositive.despite}', fluyó por '${entry.negativeToPositive.flowedBecause}'\n`;
    }
    if (entry.dailyThoughts) summary += `Pensamientos: ${entry.dailyThoughts}\n`;
    return summary;
  }).join("\n---\n");

  return `Eres "Brilla AI", una coach de bienestar y crecimiento personal excepcionalmente cálida, empática e inteligente.
  Analiza las siguientes entradas del diario de gratitud de una usuaria para la semana:
  --- INICIO DE ENTRADAS DE LA SEMANA ---
  ${entriesSummary}
  --- FIN DE ENTRADAS DE LA SEMANA ---

  Basándote en estas entradas, por favor, proporciona un análisis de su semana. Tu análisis debe incluir:
  1.  Un resumen general y empático de cómo pareció ser su semana, considerando la tendencia de ánimo si está disponible.
  2.  Una reflexión sobre sus logros, agradecimientos y aprendizajes.
  3.  2-3 recomendaciones accionables y positivas para ayudarla a mantener los aspectos positivos o mejorar áreas de desafío para la próxima semana.
  
  **Instrucciones de Tono y Formato:**
  -   Tu respuesta debe ser un bloque de texto coherente y fluido, no una lista de puntos numerados para el usuario final.
  -   Usa un tono muy humano, cercano y alentador. Como si fueras una amiga sabia y comprensiva.
  -   La respuesta debe ser en español.
  -   Formatea la respuesta para fácil lectura, usando párrafos y quizás viñetas si son naturales en el texto para las recomendaciones, pero integradas dentro de un párrafo o conclusión.
  -   No seas conversacional (no hagas preguntas al usuario en la respuesta). Simplemente entrega el análisis y las recomendaciones.
  -   Sé concisa pero profunda.
  Ejemplo de cómo podrían sonar las recomendaciones (integradas, no como lista directa):
  "...Para la próxima semana, podrías enfocarte en X para mantener esa energía, y quizás explorar Y para abordar Z. Pequeños pasos pueden hacer una gran diferencia."
  
  Análisis de Brilla AI:`;
};


export const geminiService = {
  // Fix: Changed EmotionalState to FeelingOption
  fetchDailyMessage: async (emotionalState?: FeelingOption): Promise<Omit<MotivationalQuote, 'id'>> => {
    try {
      const ai = getAiClient();
      const prompt = getPromptForDailyMessage(emotionalState);
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      let jsonStr = response.text.trim();
      const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[1]) {
        jsonStr = match[1].trim();
      }
      
      const parsedData = JSON.parse(jsonStr);

      if (parsedData && typeof parsedData.frase === 'string' && typeof parsedData.autor === 'string') {
        // Fix: Removed emotionalState from the return object as it's not part of Omit<MotivationalQuote, 'id'>
        return { frase: parsedData.frase, autor: parsedData.autor };
      } else {
        console.error("Parsed daily message data is not in the expected format:", parsedData);
        throw new Error("La respuesta de la IA para el mensaje diario no tiene el formato esperado.");
      }
    } catch (error) {
      console.error(`Error fetching daily message from Gemini (state: ${emotionalState}):`, error);
      if (error instanceof Error && error.message.includes("API_KEY")) {
        throw error;
      }
      throw new Error(`No se pudo obtener el mensaje diario. Inténtalo de nuevo más tarde.`);
    }
  },

  getAIChatResponse: async (userPrompt: string, history: ChatMessage[], isPremiumUser: boolean): Promise<string> => {
    try {
      const ai = getAiClient();
      const prompt = getPromptForAIChat(userPrompt, history, isPremiumUser);
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17", 
        contents: prompt,
        config: {
          temperature: 0.7, 
          topP: 0.95,
        },
      });
      
      return response.text.trim();
    } catch (error) {
      console.error("Error getting AI chat response from Gemini:", error);
       if (error instanceof Error && error.message.includes("API_KEY")) {
        throw error; 
      }
      throw new Error("No se pudo obtener respuesta del chat. Inténtalo de nuevo.");
    }
  },

  generateWeeklySummaryAnalysis: async (weeklyEntries: GratitudeEntry[], isPremiumUser: boolean): Promise<string> => {
    if (weeklyEntries.length === 0) {
      return "No hay suficientes entradas esta semana para generar un análisis detallado.";
    }
    try {
      const ai = getAiClient();
      const prompt = getPromptForWeeklySummary(weeklyEntries);
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
          temperature: 0.6, 
          topP: 0.9,
        },
      });

      return response.text.trim();
    } catch (error) {
      console.error("Error generating weekly summary analysis from Gemini:", error);
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes("429") || errorMessage.includes("resource_exhausted") || errorMessage.includes("quota")) {
          throw new Error("Se ha excedido la cuota de la API para el análisis. Por favor, revisa tu plan o inténtalo más tarde.");
        }
        if (errorMessage.includes("api_key")) { // Should be caught by getAiClient, but as a safeguard
             throw new Error("Error de configuración de API Key. Contacta al soporte de la aplicación.");
        }
      }
      // General fallback for other Gemini API errors during this call
      throw new Error("Brilla AI no pudo procesar el resumen en este momento. Inténtalo de nuevo más tarde.");
    }
  }
};