angular.module('pilot.auth', [])
.factory('authService', function($http) {
    return {
        'signUp': function(user) {
            return $http.post(window.server + "/signup", user);
        },

        'login': function(user) {
            return $http.post(window.server + "/login", user);
        },
    }
})
