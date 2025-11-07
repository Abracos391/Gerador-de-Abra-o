import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import generateRoute from "./routes/generate.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// Serve arquivos estáticos do diretório "public"
app.use(express.static("public"));

// Rota principal de geração
app.use("/api/generate", generateRoute);

// Página inicial simples
app.get("/", (req, res) => {
  res.send("🌸 Gerador de Abraços API está online!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
