/**
 * Monta o prompt completo para a Stability AI com base nos parâmetros do frontend.
 * @param {object} params - Objeto contendo os parâmetros de personalização.
 * @returns {string} O prompt final de texto para a geração da imagem.
 */
export function buildPrompt({ mensagem, estilo, tema, corPredominante, corTexto, posicaoTexto, assinatura }) {
    
    // --- SUA LÓGICA DE CONSTRUÇÃO DO PROMPT COMEÇA AQUI ---
    // (Mantenha a lógica original que você usa para montar a string)
    
    // Exemplo de como a lógica pode ser:
    let promptFinal = "";

    // Adiciona elementos visuais
    if (tema) {
        promptFinal += `${tema}, `;
    }
    if (estilo) {
        promptFinal += `${estilo}, `;
    }
    if (corPredominante) {
        promptFinal += `com a cor predominante ${corPredominante}, `;
    }
    
    // Adiciona o foco do gerador (o abraço ou a mensagem)
    promptFinal += "um wallpaper temático de abraço e carinho, 4K, arte digital, altamente detalhado.";

    // Adiciona os textos como overlays (Melhor feito pelo front-end, mas adicionamos ao prompt)
    if (mensagem) {
         promptFinal += ` Texto sobreposto: "${mensagem}".`;
    }
    
    // --- SUA LÓGICA DE CONSTRUÇÃO DO PROMPT TERMINA AQUI ---


    // 🛑 LINHA CRÍTICA DE DEBUG: Isso mostrará nos Logs do Render o que a API está rejeitando
    console.log("PROMPT FINAL GERADO:", promptFinal.trim()); 
    
    return promptFinal.trim();
}
