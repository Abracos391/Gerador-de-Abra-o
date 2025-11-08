import axios from "axios";

const STABILITY_API_URL = "https://api.stability.ai/v2beta/stable-image/generate/standard";
const STABILITY_KEY = process.env.STABILITY_API_KEY; // ← nome correto

export async function generateImage(prompt) {
  if (!STABILITY_KEY) {
    throw new Error("Chave da Stability AI não configurada. Verifique STABILITY_API_KEY.");
  }

  try {
    const response = await axios.post(
      STABILITY_API_URL,
      {
        prompt: prompt,
        width: 1024,
        height: 1536,
        samples: 1,
        output_format: "png"
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STABILITY_KEY}`,
          Accept: "application/json"
        },
        responseType: "json"
      }
    );

    const base64 = response.data?.artifacts?.[0]?.base64;
    if (!base64) throw new Error("Imagem não gerada pela Stability AI.");

    return base64;
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;
    console.error(`Stability AI erro ${status}:`, data || error.message);
    throw new Error(`Erro ${status || 'desconhecido'} ao gerar imagem.`);
  }
}
