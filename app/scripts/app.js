'use strict';

/**
 * @ngdoc overview
 * @name nodeApp
 * @description
 * # nodeApp
 *
 * Main module of the application.
 */
angular
  .module('nodeApp', [
    'ngResource',
    'ngRoute',
    'angularFileUpload'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/room', {
        templateUrl: 'views/room.html',
        controller: 'RoomCtrl'
      })
        .when('/registration', {
            templateUrl: 'views/registration.html',
            controller: 'RegistrationCtrl'
        })
      .otherwise({
        redirectTo: '/'
      });
  });
