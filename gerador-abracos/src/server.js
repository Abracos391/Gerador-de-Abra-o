import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../public")));

// Rota teste
app.get("/", (req, res) => {
  res.send("🌸 Gerador de Abraços API está online!");
});

// Rota para gerar imagem via Stability AI
app.post("/api/generate", async (req, res) => {
  try {
    const { saudacao, mensagem, dedicatoria } = req.body;

    const prompt = `${saudacao || ""} ${mensagem || ""} ${dedicatoria || ""}`;
    const apiKey = process.env.STABILITY_KEY;

    if (!apiKey) return res.status(500).json({ success: false, error: "STABILITY_KEY não configurada" });

    const response = await axios.post(
      "https://api.stability.ai/v1/generation/text-to-image",
      { prompt, width: 512, height: 768 },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const imageBase64 = response.data?.artifacts?.[0]?.base64 || null;

    if (!imageBase64) return res.status(500).json({ success: false, error: "Erro ao gerar imagem" });

    res.json({ success: true, image: imageBase64 });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Porta do Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
