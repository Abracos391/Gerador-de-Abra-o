export function buildPrompt({ mensagem, estilo, tema, corPredominante, corTexto, posicaoTexto }) {
  return `Crie uma imagem em formato retrato (1024x1536) com estilo ${estilo}, fundo ${tema}, cor predominante ${corPredominante}. 
Insira o texto "${mensagem}" com cor ${corTexto}, posicionado no ${posicaoTexto} da imagem. 
A imagem deve ter aparência nítida, harmoniosa e apropriada para uso como wallpaper ou figurinha personalizada.`;
}
