import express from "express";
import { generateImage } from "../services/stability.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { mensagem, estilo, tema, corPredominante, corTexto, posicaoTexto } = req.body;

    if (!mensagem) {
      return res.status(400).json({ error: "Mensagem é obrigatória." });
    }

    // Monta prompt (mesmo do seu front-end)
    let prompt = `${mensagem}`;
    if (estilo) prompt += `, estilo ${estilo}`;
    if (tema) prompt += `, tema ${tema}`;
    if (corPredominante) prompt += `, cor predominante ${corPredominante}`;
    prompt += ", figurinha para WhatsApp, design clean, sem bordas, fundo estético, arte digital";

    // Gera imagem
    const imageBase64 = await generateImage(prompt);

    res.status(200).json({ success: true, image: imageBase64 });
  } catch (error) {
    console.error("Erro real:", error.message);
    res.status(500).json({ error: error.message || "Falha ao gerar imagem." });
  }
});

export default router;
