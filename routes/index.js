const express = require('express');
const router = express.Router();
const pool = require('./postgres_rusync')

router.get('/data/:tableName', async (req, res) => {
  try {
    const tableName = req.params.tableName;
    const query = `SELECT * FROM "${tableName}"`;
    const { rows } = await pool.query(query);
    const gameNames = rows.map(row => row.game_name);
    console.log(gameNames[1]);
    console.log(rows)
    res.json(rows);
  } catch (err) {
    console.error("Ошибка запроса к базе данных:", err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
