
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

//app.get('/', routes.index);
app.post('/weixin',routes.weixin);
app.post('/sub',routes.sub);
app.post('/disub',routes.dissub);
app.get('/test',routes.test);
app.post('/checkSignature',routes.sub)
app.get('/checkSignature',routes.checkSignature);
app.get('/add',routes.add);
app.get('/gettk',routes.gettk);
app.get('/',routes.index);
app.listen(80, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
