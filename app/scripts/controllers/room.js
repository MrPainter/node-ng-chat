'use strict';

/**
 * @ngdoc function
 * @name nodeApp.controller:RoomCtrl
 * @description
 * # RoomCtrl
 * Controller of the nodeApp
 */
angular.module('nodeApp')
  .controller('RoomCtrl', ['$scope', 'session', 'socket', '$http', 'FileUploader', function ($scope, session, socket, $http, FileUploader) {

        $scope.user = session.get('name');
        $scope.room = session.get('room');
        $scope.isFooterHidden = true;
        $scope.messages = [];
        var uploader = $scope.uploader = new FileUploader({
            urlBase: '/file-send/' + $scope.user + '/',
            url: '/file-send/' + $scope.user + '/' + $scope.room
        });

        var isMessageSendAvailable = false;
        JoinRoom();

        $scope.changeRoom = function () {
            if($scope.room == $scope.changedRoom) return;

            socket.removeListener('room ' + $scope.room);

            $scope.room = $scope.changedRoom;
            JoinRoom();
            $scope.changedRoom = null;
            $scope.isFooterHidden = true;
            uploader.url = uploader.urlBase + $scope.room;
        };

        $scope.sendMessage = function () {
            if(!isMessageSendAvailable) return;
            var date = new Date();
            var data = {
                room: $scope.room,
                user: $scope.user,
                message: $scope.message,
                createdAt: date
            };
            socket.emit('chat message', data);
            $scope.message = '';
            recieveMessage(data);
        };

        function JoinRoom() {
            isMessageSendAvailable = false;
            $http.get('/history/' + $scope.room).then(function (resp) {
                console.log(resp.data);
                $scope.messages = resp.data;
                isMessageSendAvailable = true;
                socket.emit('join', {username: $scope.user, room: $scope.room});
                socket.on('room ' + $scope.room, function (data) {
                    $scope.$apply( function () {
                        recieveMessage(data);
                    });
                });
            });
        }

        function recieveMessage(data) {
            console.log(data);
            if($scope.messages.length >= 20) $scope.messages.shift();
            $scope.messages.unshift(data);
        }

        // CALLBACKS
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);

            if(response.status != 200) return;

            fileItem.remove();
            var date = new Date();
            var data = {
                room: $scope.room,
                user: $scope.user,
                message: response.name,
                createdAt: date,
                fileName: response.fileName
            };
            socket.emit('chat message', data);
            recieveMessage(data);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };
  }]);
