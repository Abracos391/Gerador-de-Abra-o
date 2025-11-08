import express from "express";
import { createClient } from "@supabase/supabase-js";
import { generateImage } from "../services/stability.js";
import { buildPrompt } from "../utils/promptBuilder.js";

const router = express.Router();

// Configuração do Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

router.post("/", async (req, res) => {
  try {
    const { email, mensagem, estilo, tema, corPredominante, corTexto, posicaoTexto } = req.body;

    if (!email || !mensagem) {
      return res.status(400).json({ success: false, error: "E-mail e mensagem são obrigatórios." });
    }

    // ✅ Verifica limite (10/mês)
    const agora = new Date();
    const mesAno = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}`;
    const {  uso } = await supabase
      .from("usos")
      .select("imagens_geradas, mes_ano")
      .eq("email", email)
      .maybeSingle();

    let imagens_geradas = uso?.imagens_geradas || 0;
    const mes_atual = uso?.mes_ano === mesAno;

    if (mes_atual && imagens_geradas >= 10) {
      return res.status(429).json({ success: false, error: "Limite de 10 imagens/mês atingido." });
    }

    // Monta prompt
    const prompt = buildPrompt({
      mensagem,
      estilo,
      tema,
      corPredominante,
      corTexto,
      posicaoTexto,
    });

    // Gera imagem
    const imageBase64 = await generateImage(prompt);

    // ✅ Atualiza contador
    await supabase
      .from("usos")
      .upsert(
        { email, mes_ano, imagens_geradas: mes_atual ? imagens_geradas + 1 : 1 },
        { onConflict: "email" }
      );

    res.status(200).json({ success: true, prompt, image: imageBase64 });
  } catch (error) {
    console.error("Erro ao gerar imagem:", error.message);
    res.status(500).json({ success: false, error: error.message || "Falha ao gerar imagem." });
  }
});

export default router;
