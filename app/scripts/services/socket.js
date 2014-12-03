'use strict';

/**
 * @ngdoc service
 * @name nodeApp.socket
 * @description
 * # socket
 * Service in the nodeApp.
 */
angular.module('nodeApp')
  .service('socket', function socket() {
    // AngularJS will instantiate a singleton by calling "new" on this function

        var socket = io();

        return {
            on: function(event, callback) {
                socket.on(event, callback);
            },

            emit: function(event, data) {
                socket.emit(event, data);
            },

            removeListener: function(event) {
                socket.removeListener(event);
            }
        }
  });
