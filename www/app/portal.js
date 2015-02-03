angular.module('pilot.portal', ['ui.router'])
.config(function($stateProvider) {
    $stateProvider
    .state('portal', {
        abstract: true,
        templateUrl: '/app/partials/portal/layout.html',
        controller: "PortalController"
    })
    .state('portal.dashboard', {
    	url: '/',
    	templateUrl: '/app/partials/portal/dashboard.html',
    	controller: 'DashboardController'
    })
})

// Top-level controller, used in all logged-in requests
.controller("PortalController", function($scope, $location, CurrentUser, CheckAuth, Session){
	$scope.user = CurrentUser;
    
    CheckAuth(function(user){
        if(!user){
            $location.path('/login');
        }
    });


    $scope.doLogout = function() {
        Session.destroy();
        $location.path('/login');
    }
})

// GET /
.controller("DashboardController", function($scope, $state, $http, Session, CurrentUser) {
    console.log("Dashboard controller", CurrentUser)
})