'use strict';

/**
 * @ngdoc function
 * @name nodeApp.controller:RegistrationCtrl
 * @description
 * # RegistrationCtrl
 * Controller of the nodeApp
 */
angular.module('nodeApp')
  .controller('RegistrationCtrl', ['$scope', '$timeout', '$http', '$location', function ($scope, $timeout, $http, $location) {

        $scope.isSuccessful = false;
        $scope.submit = function () {
            $scope.error = null;
            var credentials = { login: $scope.loginName, password: $scope.password };
            $http.post('/registration', {credentials: credentials}).success(function (data, status) {
                console.log(data);
                if (data.status == 200) {
                    $scope.isSuccessful = true;
                    $timeout(function () {
                        $location.path('/login');
                    }, 1000);
                } else if (data.status == 400 || status == 400 || status == 404) {
                    $scope.error = data.msg;
                }
            });
        };

  }]);
