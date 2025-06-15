const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || 'mysql-db',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'apppassword',
  database: process.env.DB_NAME || 'appdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

async function initDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('Connexion à la base de données établie');

    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('Base de données opérationnelle');
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    // Retry après 5 secondes
    setTimeout(initDatabase, 5000);
  }
}


app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'backend'
  });
});

app.get('/api/tasks', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, title, created_at 
      FROM tasks 
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    const userEmail = 'utilisateur@example.com'; // email en dur

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Le titre est requis' });
    }

    // Récupérer l'id utilisateur via l'email
    const [users] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [userEmail]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const userId = users[0].id;

    const [result] = await pool.execute(
        'INSERT INTO tasks (title, status, priority, user_id) VALUES (?, ?, ?, ?)',
        [title.trim(), 'pending', 'medium', userId]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Tâche créée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

async function startServer() {
  await initDatabase();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
    console.log(`API accessible sur http://localhost:${PORT}/api`);
  });
}

startServer().catch(console.error);