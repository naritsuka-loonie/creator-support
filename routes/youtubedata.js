
const { setTimeout } = require('timers/promises');
const {google} = require('googleapis');
const youtube = google.youtube({
    version: 'v3',
    auth: 'AIzaSyA9Z0IrV3rgXbfJoPsmQcysTs3ib7AO2vE'
});



// リスト表示用の成形処理
exports.processVideos = (videos, index, records, msg, res, inputData) => {

    var sub;

    if (index === videos.length) {
        console.log(inputData);

	// 対象のデータが存在すればリストを表示する
	//if( records.length === 0 ){
            inputData.checkFlag = 'true';
	    console.log(inputData.checkFlag);
        //}

        var data = {
            title: '動画一覧',
            items: records,
	    input: inputData,
	    erros: ''
        };

        res.render('getapi', data);
        return;
    }

    const video = videos[index];

    // チェンネル登録者の取得
    this.getSubscribers(video).then((subscriberCount) => {

        sub = subscriberCount;
        console.log("sub:" + subscriberCount );
        console.log("reg:" + inputData.inputRegNum);
	    
	if( subscriberCount > Number(inputData.inputRegNum)  ){
	    console.log("チェンネル登録者"+ inputData.inputRegNum +"人以上です");
	    if( inputData.regFlg === 'up' ){
                console.log('up');
		// 動画の詳細を取得する
                this.getVideoDetail(video, sub).then((record)=>{
	            console.log('呼び出されてる?');
                    records.push(record);
		});
            }
	}else{
	    console.log("チェンネル登録者" + inputData.inputRegNum + "人以下です");
	    if( inputData.regFlg === 'down' ){
		console.log('down');
		// 動画の詳細を取得する
                this.getVideoDetail(video, sub).then((record)=>{
	            console.log('呼び出されてる?');
                    records.push(record);
	            console.log(record);
		});
            }
	}
        this.processVideos(videos, index + 1, records, msg, res, inputData);

    })
    .catch((error) => {
        // エラーハンドリング
        console.error(error);
    });
}

/*
 * 動画の詳細取得関数
 * args1 : video情報
 * args2 : チェンネル登録者数
 *
 * return 動画の詳細情報
 */
exports.getVideoDetail = (video, sub ) => {
    return new Promise ((resolve, reject) => {

        youtube.videos.list({
            part: 'statistics',
            id: video.id.videoId
        }, (err, response) => {
            if (err) {
                console.error('Error:', err);
                return;
            }
            const statistics = response.data.items[0].statistics;
            const view = `${statistics.viewCount}`;
            const like = `${statistics.likeCount}`;

            // レコードを返却する
            resolve( {
                youtube_ch_title: video.snippet.channelTitle,
                youtube_subscrib: sub,
                youtube_title: video.snippet.title,
                youtube_url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                youtube_view: view,
                youtube_like: like
            });
        });
    });
}

/* 
 * チェンネル登録者数取得関数
 * args : video
 * return : チェンネル登録者数
 */
exports.getSubscribers = (video ) => {
    return new Promise ((resolve, reject) => {
        youtube.channels.list({
            part: 'statistics',
            id: video.snippet.channelId
        }, (err, response) => {
            if (err) {
                reject(err);
                return;
            }

            const channel = response.data.items[0];
            const subscriberCount = parseInt(channel.statistics.subscriberCount);
            resolve(subscriberCount);
        });	
    });
}
