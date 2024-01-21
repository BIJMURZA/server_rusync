const express = require('express');
const router = express.Router();
const pool = require('./postgres_rusync')

router.get('/data/:price', async (req, res) => {
  let whiteMarketplaces = ['steam', 'steampay', 'steambuy', 'gamerz', 'game_mag', 'zaka_zaka', 'gabestore'];
  const allData = [];

  for (const marketplace of whiteMarketplaces) {
    try {
      const query = `SELECT game_name, price FROM ${marketplace};`;
      const {rows} = await pool.query(query);
      allData.push(rows);
      console.log(marketplace)
    } catch (err) {
      console.error("Ошибка запроса к базе данных:", err);
      res.status(500).send(err.message);
    }
  }
  res.json(allData);
});

module.exports = router;
