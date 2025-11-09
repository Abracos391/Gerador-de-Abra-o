import axios from "axios";

// ✅ URL CORRETA para conta GRATUITA — SEM ESPAÇOS
const STABILITY_API_URL = "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image";

// ✅ Nome da variável EXATO
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

export async function generateImage(prompt) {
  if (!STABILITY_API_KEY) {
    throw new Error("STABILITY_API_KEY não configurada no Render.");
  }

  try {
    const response = await axios.post(
      STABILITY_API_URL,
      {
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 1536,
        width: 1024,
        steps: 30,
        samples: 1
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${STABILITY_API_KEY}`
        },
        timeout: 30000
      }
    );

    // ✅ Verificação sólida da resposta
    const data = response.data;
    if (!data || !Array.isArray(data.artifacts) || !data.artifacts[0]?.base64) {
      throw new Error(`Resposta inválida da Stability AI: ${JSON.stringify(data)}`);
    }

    return data.artifacts[0].base64;
  } catch (error) {
    // ✅ Log detalhado para diagnóstico
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      throw new Error(`Stability AI erro ${status}: ${JSON.stringify(data)}`);
    }
    throw error;
  }
}
