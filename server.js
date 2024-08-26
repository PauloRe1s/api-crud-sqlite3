/* server.js */
// Blibiotecas e Configurações
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Conexõa com o Banco de Dados
let db = new sqlite3.Database('data.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS usuario (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT UNIQUE, idade INTEGER)");
});


// Rota Post - Adiciona um Usuario
app.post('/usuarios', (req, res) => {
  const { nome, email, idade } = req.body;
  const stmt = db.prepare("INSERT INTO usuario (nome, email, idade) VALUES (?, ?, ?)");
  stmt.run(nome, email, idade, function(err) {
    if (err) {
      return res.status(400).send(err.message);
    }
    res.status(201).json({ id: this.lastID });
  });
  stmt.finalize();
});

// Rota Get - Retorna todos os Usuarios
app.get('/usuarios', (req, res) => {
    db.all("SELECT * FROM usuario", [], (err, rows) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      res.json(rows);
    });
});

// Rota GetByID - Retorna um unico usuario atraves do ID
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.all("SELECT * FROM usuario WHERE id = ?", id, (err, rows) => {
    if (err) {
      return res.status(400).send(err.message);
    }
    res.json(rows);
  });
});

// Rota Put - Atualiza Usuario atraves do ID
app.put('/usuarios/:id', (req, res) => {
  const { nome, email, idade } = req.body;
  const { id } = req.params;
  const stmt = db.prepare("UPDATE usuario SET nome = ?, email = ?, idade = ? WHERE id = ?");
  stmt.run(nome, email, idade, id, function(err) {
    if (err) {
      return res.status(400).send(err.message);
    }
    res.json({ changes: this.changes });
  });
  stmt.finalize();
});

// Rota Deleete - Deleta Usuario atraves do ID
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM usuario WHERE id = ?");
  stmt.run(id, function(err) {
    if (err) {
      return res.status(400).send(err.message);
    }
    res.json({ changes: this.changes });
  });
  stmt.finalize();
});

// Sobe o Servidor 
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
