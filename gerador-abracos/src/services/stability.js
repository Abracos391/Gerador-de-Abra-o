// O 'fetch' nativo do Node.js é usado, não é necessário o 'axios' (se estiver usando Node.js 18+ no Render)

// A chave é lida DIRETAMENTE do ambiente do Render (STABILITY_API_KEY)
const STABILITY_API_URL = "https://api.stability.ai/v2beta/stable-image/generate/core"; 

/**
 * Gera uma imagem usando a API da Stability AI (Modelo SDXL-Core v2beta).
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

    try {
        const res = await fetch(STABILITY_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // CORREÇÃO CRÍTICA: Adicionar o Accept para receber o JSON/Base64
                "Accept": "application/json", 
                "Authorization": `Bearer ${key}`
            },
            body: JSON.stringify({
                prompt: prompt,
                // Proporção de tela vertical/wallpaper. O 'core' aceita 'aspect_ratio'.
                aspect_ratio: "2:3", 
                output_format: "jpeg",
                // Estilo (opcional, adicione aqui se quiser um estilo padrão)
                // mode: "text-to-image" // Geralmente é o padrão
            })
        });

        if (!res.ok) {
            // Tenta obter a mensagem de erro específica da Stability AI
            const err = await res.json().catch(() => ({}));
            const errorMessage = err.errors?.[0]?.message || err.message || res.statusText;
            
            console.error(`Stability API Error ${res.status}:`, errorMessage);
            
            // Lança o erro com o status para o seu frontend/log
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
