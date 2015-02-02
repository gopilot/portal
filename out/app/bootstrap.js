window.server = "http://localhost:5000"


angular.module('app', ['ui.router', 'pilot.auth', 'ngCookies'])
.controller('AppController', function($scope, $http, Session) {
    // attempt to load current user from a stored session
})

.controller("HeaderController", function($scope, CurrentUser, Session) {
    $scope.currentUser = CurrentUser;

    $scope.doLogout = function() {
        Session.destroy();
    }
})

