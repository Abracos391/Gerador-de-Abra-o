import axios from "axios";

// REMOVIDO: import dotenv from "dotenv";
// REMOVIDO: dotenv.config();

const STABILITY_API_URL = "https://api.stability.ai/v2beta/stable-image/generate/standard";
// A chave é lida DIRETAMENTE do ambiente do Render:
const STABILITY_KEY = process.env.STABILITY_KEY; 

/**
 * Gera uma imagem usando a API da Stability AI.
 * @param {string} prompt O prompt de texto completo para a geração da imagem.
 * @returns {Promise<string | null>} A imagem gerada em formato base64.
 */
export async function generateImage(prompt) {
    
    // Verificação de segurança: Se a chave não for lida, lança um erro útil
    if (!STABILITY_KEY) {
        console.error("Erro de Configuração: A variável de ambiente STABILITY_KEY não foi encontrada.");
        throw new Error("Erro de autenticação: Chave da API da Stability não configurada.");
    }
    
    try {
        const response = await axios.post(
            STABILITY_API_URL,
            {
                prompt: prompt,
                // Parâmetros para um wallpaper de celular/vertical
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

        // A API da Stability retorna os dados no formato `artifacts`
        const imageBase64 = response.data?.artifacts?.[0]?.base64;

        if (!imageBase64) {
             throw new Error("Resposta da Stability AI não contém a imagem base64 esperada.");
        }

        return imageBase64;
    } catch (error) {
        // Loga o erro específico retornado pela Stability AI (ex: 401, 403)
        const errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        
        console.error("Erro na API da Stability:", errorMessage);
        
        // Relança um erro mais genérico para o frontend/usuário
        throw new Error("Falha ao gerar imagem com a Stability AI. Verifique os logs do servidor.");
    }
}
