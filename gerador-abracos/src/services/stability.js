import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const STABILITY_API_URL = "https://api.stability.ai/v2beta/stable-image/generate/standard";
const STABILITY_KEY = process.env.STABILITY_KEY;

export async function generateImage(prompt) {
  try {
    const response = await axios.post(
      STABILITY_API_URL,
      {
        prompt: prompt,
        width: 1024,
        height: 1536,
        samples: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STABILITY_KEY}`,
        },
      }
    );

    // Retorna a primeira imagem em base64
    return response.data?.artifacts[0]?.base64 || null;
  } catch (error) {
    console.error("Erro na API da Stability:", error.response?.data || error.message);
    throw new Error("Falha ao gerar imagem com a Stability AI");
  }
}
