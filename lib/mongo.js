/**
 * Created by kchistyak on 17.10.2014.
 */

var mongoose = require('mongoose');
var config = require('./config');


(function() {

    var Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    var checkErrorCb = function (err, obj) {
        if(err) {
            console.error('Error occurred', err);
            return false;
        }
        return true;
    };

/*--------- User schema ---------*/
    var User = new Schema({
        login: String,
        password: String
    });

    User.statics.Login = function (credentials, cb) {
        this.where(credentials).findOne(function(err, user) {
            if (err) {
                console.error('Error during user selection on login occured!', err);
                return cb(null);
            }
            if (user) return cb(user);
            else return cb(null);
        });
    };

    User.methods.Register = function(cb) {
        var self = this;
        this.model('User').where({login: this.login}).count(function(err, count) {
            if (err) {
                console.error('Error during count users with specified credentials', err);
                cb('Error during count users with specified credentials', null);
            }
            if(count > 0) {
                cb('User already exist!', null);
            } else {
                self.save(checkErrorCb);
                cb(null, self);
            }
        });
    };
/*--------- User end ---------*/


/*--------- Message schema ---------*/
    var Message = new Schema({
        user: {type: ObjectId, ref: 'User'},
        message: String,
        room: Number,
        createdAt: Date,
        fileName: String
    });
    Message.methods.ShiftAndSave = function (cb) {
        var self = this;
        this.model('Message').where({room: this.room}).count(function(err, count) {
            if(err) {
                console.error('Error occurred during count messages', err);
            }
            if(count >= 5) {
                self.model('Message').findOneAndRemove( { room: self.room }, { sort: { createdAt: 1 } }, function(err, document) {
                    console.log(document);
                });
            }
            self.save(checkErrorCb);
            if(cb)
                cb(null, self);
        });
    };
/*--------- Message end ---------*/


    mongoose.connect(config.mongoConnectionString, function(err, db) {
        if(err) {
            console.error('Can\'t connect to mongo', err);
            return;
        }
        module.exports.db = mongoose.connection;
        console.log('Connected to: ', config.mongoConnectionString);
    });


    module.exports.User = mongoose.model('User', User);
    module.exports.Message = mongoose.model('Message', Message);

})();