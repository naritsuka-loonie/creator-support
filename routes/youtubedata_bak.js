
const { setTimeout } = require('timers/promises');
const {google} = require('googleapis');
const youtube = google.youtube({
    version: 'v3',
    auth: 'AIzaSyA9Z0IrV3rgXbfJoPsmQcysTs3ib7AO2vE'
});

exports.processVideos = (videos, index, records, msg, res, inputData) => {
    var sub;
    console.log(inputData);
    if (index === videos.length) {
        var data = {
            title: '動画一覧',
            content: '検索ワード：' + msg,
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
	if( subscriberCount < inputData.inputRegNum  ){

            console.log("sub:" + subscriberCount );
            console.log("reg:" + inputData.inputRegNum);

	    // 対象のデータが存在すればデータを表示する
	    if( inputData.checkFlag === 'false' ){
                inputData.checkFlag = 'true';
            }

            console.log("チェンネル登録者10万人以下です");
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

                records.push({
                    youtube_ch_title: video.snippet.channelTitle,
                    youtube_subscrib: sub,
                    youtube_title: video.snippet.title,
                    youtube_url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                    youtube_view: view,
                    youtube_like: like
                });
                this.processVideos(videos, index + 1, records, msg, res, inputData);	
            });
        } else {
	    console.log("チェンネル登録者10万人以上です");
            this.processVideos(videos, index + 1, records, msg, res, inputData);	
	}
    })
    .catch((error) => {
        // エラーハンドリング
        console.error(error);
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
