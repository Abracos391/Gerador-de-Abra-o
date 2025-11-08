import express from "express";
import cors from "cors";
import morgan from "morgan";
import generateRoute from "./routes/generate.js";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use(express.static("public"));

app.use("/api/generate", generateRoute);

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
