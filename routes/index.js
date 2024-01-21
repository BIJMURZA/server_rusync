const express = require('express');
const router = express.Router();
const pool = require('./postgres_rusync')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/data', async(req, res) => {
  try {
    const tabs  = await pool.query('SELECT * FROM steam;');
    console.log('Запрос успешен!', tabs.rows);
    res.json( tabs.rows )
  } catch (err) {
    res.status(500).send(err.message);
    console.log("Запрос неуспешен!", err);
  }
})

module.exports = router;
