import express from "express";
import { generateImage } from "../services/stability.js";
import { buildPrompt } from "../utils/promptBuilder.js";

const router = express.Router();

// Rota POST para gerar imagem
router.post("/", async (req, res) => {
  try {
    const { mensagem, estilo, tema, corPredominante, corTexto, posicaoTexto } = req.body;

    // Monta o prompt completo com base nas entradas
    const prompt = buildPrompt({
      mensagem,
      estilo,
      tema,
      corPredominante,
      corTexto,
      posicaoTexto,
    });

    // Gera a imagem via Stability AI
    const imageBase64 = await generateImage(prompt);

    res.status(200).json({
      success: true,
      prompt,
      image: imageBase64,
    });
  } catch (error) {
    console.error("Erro ao gerar imagem:", error.message);
    res.status(500).json({ success: false, error: "Erro ao gerar imagem" });
  }
});

export default router;
