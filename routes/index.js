const express = require('express');
const router = express.Router();
const pool = require('./postgres_rusync')

/**
 * @param {{aid:string}} req
 */

router.get('/games', async(req, res) => {
  const query = `SELECT aid, game_name FROM games;`
  const { rows } = await pool.query(query);
  const games = rows.map(row => ({
    aid: row.aid,
    game_name: row.game_name
  }));
  res.json({games})
});

router.get('/:aid', async (req, res) => {
  const markets = ['steam', 'steampay', 'steambuy', 'gamerz', 'game_mag', 'zaka_zaka', 'gabestore'];
  const aid = req.params.aid;
  const allData = [];

  for (const market of markets) {
    const query = `SELECT game_name, price FROM ${market} WHERE aid = $1`;
    const { rows } = await pool.query(query, [aid]);
    const game = rows.map(row => row.game_name)
    const price = rows.map(row => row.price)
    allData.push({market, price, game});
    console.log(markets, price, game)
  }
  res.json({allData});
});


module.exports = router;
