const express = require('express');
const router = express.Router();
const pool = require('./postgres_rusync')

/**
 * @param {{aid:string}} req
 */

router.get('/:aid', async (req, res) => {
  const markets = ['steam', 'steampay', 'steambuy', 'gamerz', 'game_mag', 'zaka_zaka', 'gabestore'];
  const aid = req.params.aid;
  const allData = [];

  for (const market of markets) {
    const query = `SELECT price FROM ${market} WHERE aid = $1`;
    const { rows } = await pool.query(query, [aid]);
    const price = rows.map(row => row.price)
    allData.push({market, price});
    console.log(markets, price)
  }
  res.json(allData);
});

module.exports = router;
