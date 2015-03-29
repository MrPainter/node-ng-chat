/**
 * Created by kchistyak on 16.10.2014.
 */

var express = require('express'),
    app = express(),
    path = require('path'),
    socketServer = require('./lib/interface'),
    config = require('./lib/config'),
    bodyParser = require('body-parser'),
    controller = require('./lib/controller');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var httpServer = app.listen(config.port, function (){
    console.log('Listening on port ' + config.port);
});

socketServer.run(httpServer);

app.use('/css', express.static(__dirname + '/app/css'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/scripts', express.static(__dirname + '/app/scripts'));
app.use('/views', express.static(__dirname + '/app/views'));
app.use('/images', express.static(__dirname + '/app/images'));

controller(app);

