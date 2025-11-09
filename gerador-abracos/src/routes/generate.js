import express from "express";
import { generateImage } from "../services/stability.js";
import { buildPrompt } from "../utils/promptBuilder.js";

const router = express.Router();

// Rota POST para gerar imagem
router.post("/", async (req, res) => {
    try {
        // Desestruturação dos parâmetros esperados do frontend
        const { mensagem, estilo, tema, corPredominante, corTexto, posicaoTexto } = req.body;

        // 1. Monta o prompt completo com base nas entradas
        const prompt = buildPrompt({
            mensagem,
            estilo,
            tema,
            corPredominante,
            corTexto,
            posicaoTexto,
        });

        // 2. Gera a imagem via Stability AI
        const imageBase64 = await generateImage(prompt);

        // 3. Responde ao cliente com sucesso
        res.status(200).json({
            success: true,
            prompt, // Devolve o prompt para debug ou referência
            image: imageBase64,
        });
    } catch (error) {
        // 4. Tratamento de Erro Otimizado
        console.error("Erro ao processar solicitação de geração:", error.message);
        
        // Determina o status code de forma mais inteligente:
        // Se o erro for um erro de cliente (Bad Request 400), usa 400.
        const statusCode = error.message.includes("Falha na API da Stability (400)") || error.message.includes("O prompt de geração está vazio") 
                           ? 400 : 500;
                           
        res.status(statusCode).json({ 
            success: false, 
            error: "Falha ao gerar imagem.",
            details: error.message // Inclui a mensagem de erro para o frontend (opcional)
        });
    }
});

export default router;
