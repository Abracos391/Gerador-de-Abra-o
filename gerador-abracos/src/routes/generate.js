import express from "express";
import { generateImage } from "../services/stability.js";
import { buildPrompt } from "../utils/promptBuilder.js";

const router = express.Router();

// Rota POST para gerar imagem
router.post("/", async (req, res) => {
    try {
        // Desestruturação dos parâmetros esperados do frontend
        const { mensagem, estilo, tema, corPredominante, corTexto, posicaoTexto } = req.body;

        // 1. Monta o prompt "cru" (raw) com base nas entradas do usuário
        const prompt = buildPrompt({
            mensagem,
            estilo,
            tema,
            corPredominante,
            corTexto,
            posicaoTexto,
        });

        // 2. Gera a imagem (o generateImage agora chama o GPT-3.5 antes de chamar a Stability AI)
        const imageBase64 = await generateImage(prompt);

        // 3. Responde ao cliente com sucesso
        res.status(200).json({
            success: true,
            prompt, // O prompt 'cru'
            image: imageBase64,
        });
    } catch (error) {
        // 4. Tratamento de Erro Otimizado
        console.error("Erro ao processar solicitação de geração:", error.message);
        
        // Define o código de status para 400 se for um erro de prompt/cliente e 500 para outros erros.
        // O erro do 400 agora deve ser tratado pelo GPT-3.5, mas mantemos o fallback.
        const statusCode = error.message.includes("Falha na API da Stability (400)") || error.message.includes("O prompt de geração está vazio") 
                           ? 400 : 500;
                           
        res.status(statusCode).json({ 
            success: false, 
            error: "Falha ao gerar imagem.",
            details: error.message // Inclui a mensagem de erro detalhada
        });
    }
});

export default router;
