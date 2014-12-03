'use strict';

/**
 * @ngdoc function
 * @name nodeApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the nodeApp
 */
angular.module('nodeApp')
  .controller('LoginCtrl', ['$scope', '$http', '$location', 'session', function ($scope, $http, $location, session) {


        $scope.login = function () {
            $scope.error = null;
            var credentials = { login: $scope.loginName, password: $scope.password };
            $http.post('/login', {credentials: credentials}).success(function(data, status) {
                if(data.status == 200) {
                    session.set('room', $scope.room);
                    session.set('name', $scope.loginName);
                    session.set('authenticated', true);
                    $location.path('/room');
                } else if (data.status == 400) {
                    $scope.error = data.msg;
                }
            });
        };

        $scope.register = function () {
            $location.path('/registration');
        };

  }]);
