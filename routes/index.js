var express = require('express');
var router = express.Router();
var app = express();

// ドメインを設定
const domain = 'letmeknow.com';

// ドメインに対するリクエストのみ受け取るように設定
app.use((req, res, next) => {
    if (req.hostname === domain) {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Creator Support' });
});

module.exports = router;
