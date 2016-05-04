var http = require('http');
var querystring = require('querystring');

var data = querystring.stringify({
    name: '小红',
     age: 68
});
var options = {
    hostname: '127.0.0.1',
        port: 40001,
        path: '/index.php?' + data,
      method: 'GET'
};
//发送请求
var req = http.request(options,function(res){
    res.setEncoding('utf8');
    res.on('data',function(chunk){
        var returnData = JSON.parse(chunk);//如果服务器传来的是json字符串，可以将字符串转换成json
        console.log(returnData);
    });
});
//如果有错误会输出错误
req.on('error', function(e){
     console.log('错误：' + e.message);
});
req.end();
