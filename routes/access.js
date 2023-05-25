
let accessCount = 0;


const countMiddleware = (req, res, next) => {
    accessCount++;
    console.log(accessCount);
    next();
};

exports.myMethod = () => {
  // メソッドの実装
  console.log('別ファイルのメソッドが呼び出されました');
};
