// app.js
const express = require('express');
const app = express();
const port = 3000;

// Configurar EJS como template engine
app.set('view engine', 'ejs');

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
    res.render('index', {title: 'Minha Aplicação Express'})
});

// Rota sobre
app.get('/sobre', (req, res) => {
    res.render('sobre' , {title: 'sobre Nós'});
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});