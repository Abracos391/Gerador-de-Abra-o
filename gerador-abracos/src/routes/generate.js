import express from "express";
import bcrypt from "bcrypt";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// Inicializa Supabase dentro da rota (evita erro de env vazio no import)
function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
}

// Rota de login
router.post("/login", async (req, res) => {
  const { email, whatsapp, senha } = req.body;
  if (!email || !whatsapp || !senha) {
    return res.status(400).json({ error: "E-mail, WhatsApp e senha são obrigatórios." });
  }

  const supabase = getSupabase();
  const {  usuario } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (!usuario || !bcrypt.compareSync(senha, usuario.senha_hash)) {
    return res.status(401).json({ error: "Credenciais inválidas." });
  }

  // Gera token simples (para MVP — em produção, use JWT)
  const token = Buffer.from(`${email}:${Date.now()}`).toString("base64").slice(0, 32);
  res.json({ success: true, token, whatsapp: usuario.whatsapp });
});

// Rota de geração (requer token)
router.post("/", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token ausente." });

  const token = authHeader.split(" ")[1];
  const email = Buffer.from(token, "base64").toString().split(":")[0];

  const supabase = getSupabase();
  const {  usuario } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (!usuario) return res.status(401).json({ error: "Usuário não autenticado." });

  const { mensagem, estilo, tema, corPredominante, corTexto, posicaoTexto } = req.body;
  if (!mensagem) return res.status(400).json({ error: "Mensagem é obrigatória." });

  // Controle de limite
  const agora = new Date();
  const mesAno = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}`;
  const imagens_geradas = usuario.mes_ano === mesAno ? usuario.imagens_geradas : 0;

  if (imagens_geradas >= 10) {
    return res.status(429).json({ error: "Limite de 10 imagens/mês atingido." });
  }

  // Gera imagem (substitua com sua lógica de IA depois)
  const imageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAA..."; // placeholder

  // Atualiza contador
  await supabase
    .from("usuarios")
    .update({
      imagens_geradas: imagens_geradas + 1,
      mes_ano
    })
    .eq("email", email);

  res.json({ success: true, image: imageBase64 });
});

export default router;
