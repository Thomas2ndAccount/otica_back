const express = require('express');
const app = express();
const port = 3000; 
const multer = require('multer'); 
const nodemailer = require('nodemailer'); 


const cors = require('cors'); 

// Configuração do CORS
app.use(cors());
// Conexão com o banco de dados
const pool = require('./database/db');


  
// Middleware para processar JSON
app.use(express.json());

function enviarEmail(nome, email, telefone, mensagem, caminhoArquivo) {
    // Configurações do transporte de email (utilize as configurações do seu provedor de email)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'enviarformulariosecurriculos@gmail.com',
        pass: 'aowuzhaqdxfboewf'
      }
    });

const storage = multer.memoryStorage(); // Use memory storage for files
const upload = multer({ storage: storage });
// Rotas e lógica do aplicativo aqui...

app.post('/enviarformulario', upload.single('curriculo'), async (req, res) => {
    try {
        // Obtain the form data from the request body
        const { nome, email, telefone, mensagem } = req.body;
        const curriculo = req.file; // Get the uploaded file

        // Execute an SQL statement to insert the data into the database
        const query = `
            INSERT INTO formulario_funcionario (nome, email, telefone, mensagem, curriculo)
            VALUES ($1, $2, $3, $4, $5)
        `;

        const values = [nome, email, telefone, mensagem, curriculo.buffer]; // Use curriculo.buffer to get the file data

        await pool.query(query, values);

        const info = await transporter.sendMail({
            from: 'seu-email@gmail.com',
            to: 'destinatario@example.com', // Substitua pelo destinatário desejado
            subject: 'Novo formulário enviado',
            text: `Nome: ${nome}\nEmail: ${email}\nTelefone: ${telefone}\nMensagem: ${mensagem}`,
      attachments: [
        {
          filename: 'curriculo.pdf', // Nome do arquivo no e-mail
          content: curriculo.buffer, // Dados do currículo
        },
    ],
        });

          console.log('E-mail enviado:', info.response);

        res.json({ success: 'Dados inseridos com sucesso!' });
    } catch (error) {
        console.error('Erro ao inserir dados no banco de dados:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao inserir os dados.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor em execução na porta ${port}`);
});