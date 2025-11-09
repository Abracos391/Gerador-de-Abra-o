// Importa o módulo 'openai' (certifique-se de que está instalado via npm)
import OpenAI from 'openai';

// Inicializa o cliente OpenAI. Ele busca automaticamente a chave da variável de ambiente OPENAI_API_KEY.
const openai = new OpenAI();

const STABILITY_API_URL = "https://api.stability.ai/v2beta/stable-image/generate/core"; 

/**
 * Otimiza um prompt usando GPT-3.5-Turbo para remover caracteres inválidos 
 * e melhora a descrição para IAs de imagem.
 * @param {string} rawPrompt - O prompt gerado pelo promptBuilder.
 * @returns {Promise<string>} O prompt limpo e otimizado.
 */
async function optimizePrompt(rawPrompt) {
    
    // Otimização: Se o prompt for simples, apenas retorna para economizar tokens.
    if (rawPrompt.length < 50) return rawPrompt.trim();

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Você é um otimizador de prompts para Stable Diffusion. Receba um prompt, remova quaisquer emojis, aspas, ou caracteres especiais complexos. Reescreva-o em português para ser o mais eficaz e descritivo para geração de imagem, mantendo o foco original. Não inclua instruções de texto sobreposto, apenas a descrição da imagem."
                },
                {
                    role: "user",
                    content: rawPrompt
                }
            ],
            temperature: 0.1, // Baixa temperatura para manter o foco
        });

        const optimized = completion.choices[0].message.content.trim();
        console.log("PROMPT OTIMIZADO (GPT-3.5):", optimized);
        return optimized;
        
    } catch (error) {
        console.error("Erro na otimização de prompt (OpenAI):", error.message);
        // Se a OpenAI falhar, retornamos o prompt original para que a Stability AI possa tentar.
        return rawPrompt.trim(); 
    }
}


/**
 * Gera uma imagem usando a API da Stability AI (Modelo SDXL-Core v2beta).
 * @param {string} prompt O prompt de texto completo para a geração da imagem.
 * @returns {Promise<string>} A imagem gerada em formato base64.
 */
export async function generateImage(prompt) {
    
    const key = process.env.STABILITY_API_KEY; 

    // Verificação da chave Stability
    if (!key) {
        throw new Error("Erro de Configuração: STABILITY_API_KEY não configurada no Render.");
    }
    
    // 1. CHAMA O GPT-3.5 PARA LIMPAR O PROMPT E RESOLVER O ERRO 400
    const finalPrompt = await optimizePrompt(prompt);
    
    // Verificação crítica para o Erro 400 (depois da otimização)
    if (!finalPrompt || finalPrompt.trim().length < 5) {
         throw new Error("O prompt final de geração está vazio após otimização.");
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
                prompt: finalPrompt,
                output_format: "jpeg" 
            })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            const errorMessage = err.errors?.[0]?.message || err.message || res.statusText;
            
            console.error(`Stability API Error ${res.status}:`, errorMessage);
            
            throw new Error(`Falha na API da Stability (${res.status}): ${errorMessage}`);
        }

        const data = await res.json();
        
        if (!data.image) {
             throw new Error("Resposta da Stability AI não contém a imagem base64 esperada.");
        }

        return data.image; 

    } catch (error) {
        console.error("Erro geral na geração da imagem:", error.message);
        throw new Error(`Falha ao gerar imagem: ${error.message}`);
    }
}
