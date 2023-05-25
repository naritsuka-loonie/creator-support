
/*
 * バリデーションチェック
 * args : req
 * return : チェンネル登録者数
 */
exports.reqCheck = (req) => {

    // リクエストの値を全て変数に格納する
    var msg = req.body.searchMsg;
    var viewCnt = req.body.viewCnt;
    var regNum = req.body.regNum;
    var dateFrom = req.body.dateFrom;
    var dateTo = req.body.dateTo;
    var regFlg = req.body.regNumFlag;
    var errorMsg = '';


    // 各項目を設定する
    var inputData = {
	inputSearch: msg,
        inputViewCnt: viewCnt,
        inputRegNum: regNum,
        inputDateFrom: dateFrom,
        inputDateTo: dateTo,
	regFlg: regFlg,
        checkFlag: 'false',
	error: errorMsg
    }

    return inputData;
};


