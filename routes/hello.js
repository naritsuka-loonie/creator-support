var express = require('express');
var router = express.Router();

router.get('/',(req, res, next) => {
	var name = req.query.name;
	var mail = req.query.mail;

        var data = {
                title: 'Hello',
                content: 'あなたの名前は' + name + '<br>'+
			'メールアドレスは' + mail + 'です'
        };
        res.render('hello', data);
});

router.post('/post',(req, res, next) => {
	var msg = req.body['message'];

        var data = {
                title: 'Hello',
                content: 'あなたの名前は' + msg + 'です。'
        };
        res.render('hello', data);
});

module.exports = router;
