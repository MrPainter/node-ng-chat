'use strict';

/**
 * @ngdoc service
 * @name nodeApp.session
 * @description
 * # session
 * Service in the nodeApp.
 */
angular.module('nodeApp')
  .service('session', function session() {
    // AngularJS will instantiate a singleton by calling "new" on this function
        var authenticated = false;
        var storage = [];

        return {
            isAuthenticated : authenticated,
            set: function(key, value) {
                storage.push({key: key, value: value});
            },
            get: function (key) {
                var result = _.find(storage, function(storageObj) { return storageObj.key == key; });
                if (result) return result.value;
                else return null;
            }
        }
  });
