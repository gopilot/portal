angular.module('pilot.portal', ['ui.router', 'pilot.event'])
.config(function($stateProvider) {
    $stateProvider
    .state('portal', {
        abstract: true,
        templateUrl: '/portal/layout.html',
        controller: "PortalController"
    })
    .state('portal.dashboard', {
    	url: '/',
    	templateUrl: '/portal/dashboard.html',
    	controller: 'DashboardController'
    })
    .state('portal.events', {
        url: '/events',
        templateUrl: '/portal/events.html',
        controller: 'EventListController'
    })
})

// Top-level controller, used in all logged-in requests
.controller("PortalController", function($scope, $state, CurrentUser, AllEvents, Session){
	console.log("Portal controller", CurrentUser)
    CurrentUser.then(function(user){
        if(user)
            $scope.user = user;
        else
            $state.go('login');
    });

    AllEvents.then(function(events){
        $scope.upcomingEvents = events.upcoming;
        $scope.pastEvents = events.past;
    });

    $scope.doLogout = function() {
        Session.destroy();
        $state.go('login');
    }
})

// GET /
.controller("DashboardController", function($filter, $scope, $state) {
    $scope.pageTitle = "Dashboard";
    $scope.fullHeader = true; 
})

// GET /events
.controller("EventListController", function($scope, $state, $http) {
    $scope.pageTitle = "All Events";
    $scope.fullHeader = true; 
})