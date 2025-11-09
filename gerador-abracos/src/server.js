import express from "express";
import cors from "cors";
import morgan from "morgan";
import generateRoute from "./routes/generate.js";
import path from "path"; // Importa o módulo 'path' para lidar com caminhos de arquivo

// --- Configuração e Verificação de Variável de Ambiente ---

// Define o nome da variável que o serviço Stability AI está usando
const API_KEY_NAME = "STABILITY_API_KEY";

// Verifica se a chave crítica da API está configurada
if (!process.env[API_KEY_NAME]) {
    // Registra um erro de configuração CRÍTICO nos logs do Render
    console.error(`\n======================================================`);
    console.error(`🛑 ERRO CRÍTICO DE CONFIGURAÇÃO: A variável de ambiente ${API_KEY_NAME} está ausente.`);
    console.error(`=> Verifique o painel do Render e confirme que o valor da chave da Stability AI foi definido.`);
    console.error(`======================================================\n`);
    
    // Força o servidor a sair com erro, pois ele não pode funcionar sem a chave.
    // Isso deve alertar o Render com um erro de inicialização.
    process.exit(1); 
}

// --- Configuração do Express ---

const app = express();
// O Render define a porta automaticamente na variável de ambiente PORT
const PORT = process.env.PORT || 10000; 

// Para usar o __dirname (caminho do diretório atual) em módulos ES (import/export)
const __dirname = path.resolve();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// Serve arquivos estáticos do diretório "public"
app.use(express.static(path.join(__dirname, "public")));

// --- Rotas ---

// Rota principal de geração
app.use("/api/generate", generateRoute);

// Rota para a página inicial (index.html)
app.get("/", (req, res) => {
    // Usa o path.join para construir o caminho correto
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Inicialização do Servidor ---

// '0.0.0.0' garante que o servidor escute em todas as interfaces, necessário no Render
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Verificação de API Key: OK!`);
});
