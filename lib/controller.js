/**
 * Created by kchistyak on 17.10.2014.
 */

var path = require('path'),
    _ = require('underscore'),
    mongo = require('./mongo'),
    fs = require('fs'),
    multer = require('multer'),
    history = require('./history');



module.exports = function RunCommonController(app) {

    app.use(multer({
        dest: './uploads/',
        rename: function (fieldname, filename) {
            return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
        }
    }));

    app.get('/', function(req, res) {
        res.sendFile(path.resolve(process.cwd() + '/app/index.html'));
    });

    app.post('/login', function(req, res) {
        mongo.User.Login(req.body.credentials, function(user) {
            if (user) res.json({status: 200});
            else res.json({status: 400, msg: 'Username or password is not valid!'});
        });
    });

    app.post('/registration', function(req, res) {
        var user = new mongo.User(req.body.credentials);
        user.Register(function(err, result) {
            if(!err) res.json({status: 200});
            else res.json({status: 400, msg: err});
        });
    });

    app.get('/history/:roomId', function (req, res) {
        history.getRoomMessages(req.params.roomId, function(messages) {
            return res.json(messages);
        });
    });

    app.post('/file-send/:user/:roomId', function(req, res) {
        _.each(req.files, function (file) {
            return res.json({status:200, name: file.originalname, fileName: file.name});
        });
    });

    app.get('/file/:fileName', function (req, res) {
        res.sendFile(path.join(process.cwd(), '/uploads/',req.params.fileName));
    });


};