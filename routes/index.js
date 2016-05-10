
/*
 * GET home page.
 */
var sha1 = require('sha1');
var querystring = require('querystring');
var xml = require('node-xml');
var appid_ = 'wx9a4bc648a1246c04';
var secret_ ='1692347f949b03f66829f36072ebf0b0';
var https = require('https');
var xml2js = require('xml2js');
var ejs = require('ejs');


var wrapTpl = '<xml>' +
  '<ToUserName><![CDATA[<%-to%>]]></ToUserName>' +
  '<FromUserName><![CDATA[<%-from%>]]></FromUserName>' +
  '<TimeStamp><%-time%></TimeStamp>' +
  '<MsgType><![CDATA[<%-type%>]]></MsgType>' +
  '<FuncFlag><![CDATA[<%-flag%>]]></FuncFlag>' +
'</xml>';
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
//processMessage(body,res);
var senddata = {};
senddata.to= 'gh_96f8c3ea0e5f';
senddata.from = 'oiYTxvzLid90lCoOXldHb-mMPv7c';
senddata.time = parseInt(new Date().getTime()/1000);
senddata.type = "text";
senddata.cont = "content is welcom " +'';
senddata.flag = 0;
var xml = encryptWrap(senddata);
console.log("log---send----data!" + xml);
res.end(xml);
  });
//res.json(jsonObj);
  //res.render('index', { title: 'Expresssssssss post ssssssssssssssssss'} );
	//processMessage(body,res);
}
function processMessage(data,res){
var ToUserName="";
var FromUserName="";
var CreateTime="";
var MsgType="";
var Content="";
var Location_X="";
var Location_Y="";
var Scale=1;
var Label="";
var PicUrl="";
var FuncFlag="";
 
var tempName="";
var parse=new xml.SaxParser(function(cb){
    cb.onStartElementNS(function(elem,attra,prefix,uri,namespaces){
        tempName=elem;
    });
     
    cb.onCharacters(function(chars){
        chars=chars.replace(/(^\s*)|(\s*$)/g, "");
        if(tempName=="CreateTime"){
            CreateTime=chars;
        }else if(tempName=="Location_X"){
            Location_X=cdata;
        }else if(tempName=="Location_Y"){
            Location_Y=cdata;
        }else if(tempName=="Scale"){
            Scale=cdata;
        }
         
         
    });
     
    cb.onCdata(function(cdata){
         
        if(tempName=="ToUserName"){
            ToUserName=cdata;
        }else if(tempName=="FromUserName"){
            FromUserName=cdata;
        }else if(tempName=="MsgType"){
            MsgType=cdata;
        }else if(tempName=="Content"){
            Content=cdata;
        }else if(tempName=="PicUrl"){
            PicUrl=cdata;
        }else if(tempName=="Label"){
            Label=cdata;
        }
        console.log("cdata:"+cdata);
    });
     
    cb.onEndElementNS(function(elem,prefix,uri){
        tempName="";
    });
     
    cb.onEndDocument(function(){
        console.log("onEndDocument");
        tempName="";
        var date=new Date(); 
        var yy=date.getYear(); 
        var MM=date.getMonth() + 1; 
        var dd=date.getDay(); 
        var hh=date.getHours(); 
        var mm=date.getMinutes(); 
        var ss=date.getSeconds(); 
        var sss=date.getMilliseconds();  
        var result=Date.UTC(yy,MM,dd,hh,mm,ss,sss); 
        var msg="";
        if(MsgType=="text"){
            msg="谢谢关注,你说的是："+Content;
        }else if (MsgType="location"){
            msg="你所在的位置: 经度："+Location_X+"纬度："+Location_Y;
        }else if (MsgType="image"){
            msg="你发的图片是："+PicUrl;
        }
       // messageSender.sendTextMessage(FromUserName,ToUserName,CreateTime,msg,FuncFlag,response);
	// 分情况，subscribe,保存用户的基本信息到数据库，创建一个user表，保存openid，用户名，发送欢迎信息。
	// 如果是text信息并且是取消那么就取消今天的订餐。
	// 如果是event的第一个菜单信息 在今天的数据表里面创建一个订单信息
	// 如果是显示订餐列表的event那么返回今天所有人订餐信息。以text的形式展示出来。
console.log('hear!!!');
var senddata = {};
senddata.to= FromUserName;
senddata.from = ToUserName;
senddata.time = parseInt(new Date().getTime()/1000);
senddata.type = "text";
senddata.cont = "content is welcom " + FromUserName;
senddata.flag = 0;
console.log(senddata);
//var xml =encryptWrap(senddata); 
console.log('xxx' + 'sdfsdf');
	res.end("sdddddddddddddddddddddddddddddddddddd");
	
//	gettk(FromUserName,res);
       //res.end('hello formuser :'+FromUserName);
    });
});
   // parse.parseString(data);
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

