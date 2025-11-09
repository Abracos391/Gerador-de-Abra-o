// O 'fetch' nativo do Node.js é usado.

const STABILITY_API_URL = "https://api.stability.ai/v2beta/stable-image/generate/core"; 

/**
 * Gera uma imagem usando a API da Stability AI (Modelo SDXL-Core v2beta) com payload mínimo.
 * @param {string} prompt O prompt de texto completo para a geração da imagem.
 * @returns {Promise<string>} A imagem gerada em formato base64.
 */
export async function generateImage(prompt) {
    
    // O nome da variável de ambiente no Render DEVE ser STABILITY_API_KEY
    const key = process.env.STABILITY_API_KEY; 

    // Verificação de segurança
    if (!key) {
        throw new Error("Erro de Configuração: STABILITY_API_KEY não configurada no Render.");
    }
    
    // Verificação crítica para o Erro 400
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
         throw new Error("O prompt de geração está vazio ou muito curto. Falha no promptBuilder.");
    }

    try {
        const res = await fetch(STABILITY_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json", 
                "Authorization": `Bearer ${key}`
            },
            body: JSON.stringify({
                // Requisição MÍNIMA: Apenas o prompt e o formato de saída.
                // Removemos aspect_ratio e outros parâmetros para isolar o problema.
                prompt: prompt,
                output_format: "jpeg" // Formato necessário para receber Base64
            })
        });

        if (!res.ok) {
            // Tenta obter a mensagem de erro específica da Stability AI
            const err = await res.json().catch(() => ({}));
            const errorMessage = err.errors?.[0]?.message || err.message || res.statusText;
            
            // Loga o erro específico (400)
            console.error(`Stability API Error ${res.status}:`, errorMessage);
            
            throw new Error(`Falha na API da Stability (${res.status}): ${errorMessage}`);
        }

        const data = await res.json();
        
        // A v2beta retorna a imagem no formato { image: "base64_string" }
        if (!data.image) {
             throw new Error("Resposta da Stability AI não contém a imagem base64 esperada.");
        }

        return data.image; 

    } catch (error) {
        // Captura erros de rede ou o erro lançado acima
        console.error("Erro geral na geração da imagem:", error.message);
        throw new Error(`Falha ao gerar imagem: ${error.message}`);
    }
}
