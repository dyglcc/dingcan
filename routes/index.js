
/*
 * GET home page.
 */
var sha1 = require('sha1');
var querystring = require('querystring');
// var xml = require('node-xml');
var appid_ = 'wx9a4bc648a1246c04';
var secret_ ='1692347f949b03f66829f36072ebf0b0';
var https = require('https');
var xml2js = require('xml2js');
var ejs = require('ejs');
var parser = new xml2js.Parser();


var wrapTpl = ['<xml>',
    '<ToUserName><![CDATA[<%-toname%>]]></ToUserName>',
    '<FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>',
    '<CreateTime><%=createTime%></CreateTime>',
    '<% if (msgType === "device_event" && (Event === "subscribe_status" || Event === "unsubscribe_status")) { %>',
      '<% if (Event === "subscribe_status" || Event === "unsubscribe_status") { %>',
        '<MsgType><![CDATA[device_status]]></MsgType>',
        '<DeviceStatus><%=DeviceStatus%></DeviceStatus>',
      '<% } else { %>',
        '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
        '<Event><![CDATA[<%-Event%>]]></Event>',
      '<% } %>',
    '<% } else { %>',
      '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
    '<% } %>',
  '<% if (msgType === "news") { %>',
    '<ArticleCount><%=content.length%></ArticleCount>',
    '<Articles>',
    '<% content.forEach(function(item){ %>',
      '<item>',
        '<Title><![CDATA[<%-item.title%>]]></Title>',
        '<Description><![CDATA[<%-item.description%>]]></Description>',
        '<PicUrl><![CDATA[<%-item.picUrl || item.picurl || item.pic %>]]></PicUrl>',
        '<Url><![CDATA[<%-item.url%>]]></Url>',
      '</item>',
    '<% }); %>',
    '</Articles>',
  '<% } else if (msgType === "music") { %>',
    '<Music>',
      '<Title><![CDATA[<%-content.title%>]]></Title>',
      '<Description><![CDATA[<%-content.description%>]]></Description>',
      '<MusicUrl><![CDATA[<%-content.musicUrl || content.url %>]]></MusicUrl>',
      '<HQMusicUrl><![CDATA[<%-content.hqMusicUrl || content.hqUrl %>]]></HQMusicUrl>',
      '<% if (content.thumbMediaId) { %> ',
      '<ThumbMediaId><![CDATA[<%-content.thumbMediaId || content.mediaId %>]]></ThumbMediaId>',
      '<% } %>',
    '</Music>',
  '<% } else if (msgType === "voice") { %>',
    '<Voice>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '</Voice>',
  '<% } else if (msgType === "image") { %>',
    '<Image>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
    '</Image>',
  '<% } else if (msgType === "video") { %>',
    '<Video>',
      '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
      '<Title><![CDATA[<%-content.title%>]]></Title>',
      '<Description><![CDATA[<%-content.description%>]]></Description>',
    '</Video>',
  '<% } else if (msgType === "hardware") { %>',
    '<HardWare>',
      '<MessageView><![CDATA[<%-HardWare.MessageView%>]]></MessageView>',
      '<MessageAction><![CDATA[<%-HardWare.MessageAction%>]]></MessageAction>',
    '</HardWare>',
    '<FuncFlag>0</FuncFlag>',
  '<% } else if (msgType === "device_text" || msgType === "device_event") { %>',
    '<DeviceType><![CDATA[<%-DeviceType%>]]></DeviceType>',
    '<DeviceID><![CDATA[<%-DeviceID%>]]></DeviceID>',
    '<% if (msgType === "device_text") { %>',
      '<Content><![CDATA[<%-content%>]]></Content>',
    '<% } else if ((msgType === "device_event" && Event != "subscribe_status" && Event != "unsubscribe_status")) { %>',
      '<Content><![CDATA[<%-content%>]]></Content>',
      '<Event><![CDATA[<%-Event%>]]></Event>',
    '<% } %>',
      '<SessionID><%=SessionID%></SessionID>',
  '<% } else if (msgType === "transfer_customer_service") { %>',
    '<% if (content && content.kfAccount) { %>',
      '<TransInfo>',
        '<KfAccount><![CDATA[<%-content.kfAccount%>]]></KfAccount>',
      '</TransInfo>',
    '<% } %>',
  '<% } else { %>',
    '<Content><![CDATA[<%-content%>]]></Content>',
  '<% } %>',
  '</xml>'].join('');
var encryptWrap = ejs.compile(wrapTpl);
// 获取用户基本信息
function getUserInfo(acesstk,openid_,res){

console.log('start get userinfor ,token,openid' + acesstk + ' ' + openid_ )
var data = querystring.stringify({
        
    access_token : acesstk,
     openid: openid_
});
var options = {
    hostname: 'api.weixin.qq.com',
        port: 443,
        path: '/cgi-bin/user/info?' + data,
      method: 'GET'
};
//发送请求
var req = https.request(options,function(response){
    response.setEncoding('utf8');
    response.on('data',function(chunk){
        var userinfo = JSON.parse(chunk);//如果服务器传来的是json字符串，可以将字符串转换成json
        console.log(userinfo);
	// save userinfo
	
        //res.json(userinfo);
     	//res.end("");
//res.write('');
    });
});
//如果有错误会输出错误
req.on('error', function(e){
     console.log('错误：' + e.message);
});
req.end();

}
// 获取accessToken
 function gettk(openid,res){
var data = querystring.stringify({
	grant_type:'client_credential',
    appid : appid_,
     secret: secret_
});
var options = {
    hostname: 'api.weixin.qq.com',
        port: 443,
        path: '/cgi-bin/token?' + data,
      method: 'GET'
};
//发送请求
var req = https.request(options,function(response){
    response.setEncoding('utf8');
    response.on('data',function(chunk){
        var returnData = JSON.parse(chunk);//如果服务器传来的是json字符串，可以将字符串转换成json
	console.log(returnData);

	// get accessToken
	var accessToken = returnData.access_token;
	getUserInfo(accessToken,openid,res);
//        res.json(returnData);
//res.write('hello success ' + returnData);
    });
});
//如果有错误会输出错误
req.on('error', function(e){
     console.log('错误：' + e.message);
});
req.end();
}
exports.index = function(req, res){
	console.log(req);
	res.render('index', { title: 'Express' })
};


exports.weixin = function(req,res){
	console.log('post : sdf');
		console.log(req.body);
	console.log(req.query);
		// console.log(req.params.xx);
res.json({id:req.body});
  //res.render('index', { title: 'Expresssssssss post ssssssssssssssssss'} );

};

function senddata(toname,fromuser,content,res){
var senddata = {};
senddata.toname= toname;
//senddata.toname= 'oiYTxvzLid90lCoOXldHb-mMPv7c';
// senddata.fromUsername = 'gh_96f8c3ea0e5f';
senddata.fromUsername = fromuser;
senddata.createTime = parseInt(new Date().getTime()/1000);
senddata.msgType = "text";
senddata.content = content;
// senddata.flag = 0;
var xml = encryptWrap(senddata);
console.log("log---send----data!" + xml);
res.end(xml);
}
exports.sub = function(req,res){
        console.log('post : sub----');
var body = '';
req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    console.log('body: ' + body);
//var params = querystring.parse(body);
  //console.log(params);
  //  jsonObj = JSON.parse(body);
//  co//nsole.log(jsonObj.$key);
processMessage(body,res);

  });
//res.json(jsonObj);
  //res.render('index', { title: 'Expresssssssss post ssssssssssssssssss'} );
	//processMessage(body,res);
}
function processMessage(data,res){

    var FromUserName = "";
    var ToUserName = "";
    parser.parseString(data.toString(), function(err, result) {
    var body = result.xml;
    // var messageType = body.MsgType[];
    // todo ----------



    console.log('messageType' + body.MsgType);


    var type = body.MsgType;
    var content = body.Content;
    var eventtype = body.Event;
    var clickKey = body.EventKey;

    console.log('type content eventtype clickkey ' + type +' ' + content +' ' + eventtype +' ' + clickkey );

    switch(type){
        case "event":
        switch(){
            case "CLICK":
            // <Event><![CDATA[CLICK]]></Event>
// <EventKey><![CDATA[EVENTKEY]]></EventKey>
              break;
            case "subscribe"
            // <MsgType><![CDATA[event]]></MsgType>
// <Event><![CDATA[subscribe]]></Event>
              break;
            case "unsubscribe"
              break;
        }
          break;
        case "text":
        // <MsgType><![CDATA[text]]></MsgType>
 // <Content><![CDATA[this is a test]]></Content>
          break;
        default:
          break;
    }


    FromUserName = body.FromUserName;
    ToUserName = body.ToUserName;

    console.log('hear!!!');
    senddata(FromUserName,ToUserName,'hello welcom yaohe dingcan',res);


    // //用户点击菜单响应事件
    // if(messageType === 'event') {
    // var eventName = body.Event[];
    // console.log('event name ' + eventName);
    // (EventFunction[eventName]||function(){})(body, req, res);
    // //自动回复消息
    // }else if(messageType === 'text') {
    // EventFunction.responseNews(body, res);
    // //第一次填写URL时确认接口是否有效
    // }else {
    // res.send(echostr);
    // }
});   
}

// test
exports.test = function(req,res){
console.log( req.query);
console.log( ip+     'ip');
	res.json({success: true,message:"登入成功",ip:ip,querystring:req.query});
}
var token = "dingcan";
exports.checkSignature= function(req,res){
	var echostr = req.query.echostr;
	if(check(req)){
		console.log(echostr);
	//	 res.write(echostr);
		res.end(echostr);
	}
	return res.json({f:false});
}
function check(req){
	var signature = req.query.signature;
  var timestamp = req.query.timestamp;
  var nonce = req.query.nonce;
  var echostr = req.query.echostr;
  var arrayT = [token,timestamp,nonce];
console.log(arrayT);
	//console.log(req);
	console.log(req.query);        
var sortStr = arrayT.sort().join('');
        sortStr = sha1(sortStr);
console.log(sortStr);
console.log(signature + ' sing');
console.log(timestamp + ' time');
	console.log(req.query);        
var sortStr = arrayT.sort().join('');
        sortStr = sha1(sortStr);
console.log(sortStr);
console.log(echostr);
if(sortStr==signature){
console.log("same");
return true;

}else{
console.log('not same');
return false;}
}

