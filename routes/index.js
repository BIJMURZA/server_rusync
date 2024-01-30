const express = require('express');
const router = express.Router();
const pool = require('./postgres_rusync')
/**
 * @param {{aid:string, login: string, password: string}} req
 */

router.get('/games', async(req, res) => {
  const markets = ['steam', 'steampay', 'steambuy', 'gamerz', 'game_mag', 'zaka_zaka', 'gabestore'];
  const query = `SELECT aid, game_name FROM games;`
  const { rows } = await pool.query(query);
  const games = [];
  for (let row of rows) {
   let minPrice = null;
   for (let market of markets) {
     const priceQuery = `SELECT price FROM ${market} WHERE aid = $1 AND price <> 'Нет в наличии'`
     const price = await pool.query(priceQuery, [row.aid]);

     const intPrice = price.rows
         .map(row => row.price)
         .filter(price => !isNaN(price))
         .map(Number)

     if (intPrice.length > 0) {
       const minMarketPrice = Math.min(...price.rows.map(row => row.price));
       if (minPrice === null || minMarketPrice < minPrice) {
         minPrice = minMarketPrice;
       }
     }
   }
    games.push({
      aid: row.aid,
      game_name: row.game_name,
      minPrice: minPrice,
    });
  }
  res.json({games})
});

router.post('/accounts/login/password', async(req, res) => {
  const query = `SELECT * FROM accounts WHERE login = $1 AND password = $2`;
  const {login, password} = req.body;
  const { rows } = await pool.query(query, [login, password])
  console.log({rows})
  console.log(rows[0])
  if (rows.length > 0) {
    res.json({ success: true, user: rows });
  } else {
    res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
  }
})

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
