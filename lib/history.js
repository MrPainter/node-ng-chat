/**
 * Created by kchistyak on 17.10.2014.
 */

var mongo = require('./mongo'),
    _ = require('underscore');

module.exports.getRoomMessages = function(roomId, cb) {
    mongo.Message.find({room: roomId}).populate({path: 'user', select: 'login'}).exec(function(err, records) {
        if(err) {
            console.error('Error during finding messages', err);
        }
        var messages = [];
        _.each(records, function(record, index) {
            var obj = record.toObject();
            delete obj._id;
            delete obj.__v;
            obj.user = obj.user.login;
            messages.unshift(obj);
        });
        cb(messages);
    });
};