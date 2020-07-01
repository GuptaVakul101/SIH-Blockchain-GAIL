var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

const cors = require('../cors');

router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });

/* GET users listing. */
router.post('/login', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
