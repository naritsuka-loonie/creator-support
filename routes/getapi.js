var express = require('express');
var router = express.Router();
const utils = require('./access');
const tube = require('./youtubedata');
const vali = require('./validate');

const {google} = require('googleapis');
const youtube = google.youtube({
    version: 'v3',
    auth: 'AIzaSyA9Z0IrV3rgXbfJoPsmQcysTs3ib7AO2vE'
});

router.get('/', function(req, res, next) {
      var inputData = {
	inputSearch: '',
        inputViewCnt: 100000,
        inputRegNum: 100000,
        inputDateFrom: '2023-05-22',
        inputDateTo: '2023-05-23',
	checkFlag: 'false',
	error: ''
    }

    var data = {
        title: '初期表示',
        content: '検索ワード：',
        items: '',
        input: inputData,
        erros: 'バリデーションエラー'
    };

    res.render('getapi', data);

});


router.post('/post', (req, res, next) => {

    var msg = req.body['searchMsg'];
    var records = [];

    // バリデーションチェック
    inputData = vali.reqCheck(req);
    if( inputData.error !== '' ){
        var data = {
            title: 'バリデーションエラー',
            items: records,
            input: inputData,
	    erros: 'バリデーションエラー'
        };
        console.log('records:' + records);

        res.render('getapi', data);
        return;
    }

    //youtubeAPIの呼び出し
    const searchParams = {
        part: 'id,snippet',
        type: 'video',
        q: msg,
        order: 'viewCount',
        videoDefinition: 'high',
        videoEmbeddable: true,
        videoSyndicated: true,
        maxResults: 50,
        minViewCount: req.body.viewCnt,
        publishedAfter: req.body.dateFrom + 'T00:00:00Z',
	publishedBefore: req.body.dateTo + 'T00:00:00Z'
    };

    youtube.search.list(searchParams, (err, response) => {
        console.log('list');
        if (err) {
            console.error('The API returned an error: ' + err);
            return;
        }

        const videos = response.data.items;
	console.log(response.data.items);
        if (videos.length) {
            tube.processVideos(videos, 0, records, msg, res, inputData);
        }
    });
});

module.exports = router;


router.post('/csvout', (req, res, next) => {


    var data = {
        title: 'csv出力',
        items: '',
        input: inputData,
        erros: 'バリデーションエラー'
    };

    res.render('getapi', data);

});
