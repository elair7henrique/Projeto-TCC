import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ==================== MYSQL ======================
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.log("Erro ao conectar no MySQL:", err);
    } else {
        console.log("MySQL conectado!");
    }
});

// ==================== ROTAS ======================

// CADASTRO
app.post("/cadastro", (req, res) => {
    const { nome, email, senha, cpf, telefone } = req.body;

    const senhaCriptografada = bcrypt.hashSync(senha, 10);

    const sql = "INSERT INTO usuarios (nome, email, senha, cpf, telefone) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [nome, email, senhaCriptografada, cpf, telefone], (err) => {
        if (err) return res.status(400).json({ erro: err });
        return res.json({ mensagem: "Usuário cadastrado com sucesso!" });
    });
});

// LOGIN
app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    const sql = "SELECT * FROM usuarios WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(400).json({ erro: err });
        if (results.length === 0) return res.status(404).json({ mensagem: "Usuário não encontrado" });

        const usuario = results[0];

        const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);

        if (!senhaCorreta) return res.status(401).json({ mensagem: "Senha incorreta" });

        return res.json({ mensagem: "Login realizado!", usuario });
    });
});

// ==================== SERVIDOR ======================
app.listen(process.env.PORT, () =>
    console.log("Servidor rodando na porta", process.env.PORT)
);