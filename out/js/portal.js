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
    .state('portal.settings', {
        url: '/settings',
        templateUrl: '/portal/settings.html',
        controller: 'SettingsController'
    })
})

// Top-level controller, used in all logged-in requests
.controller("PortalController", function($scope, $window, $state, $cookieStore, CurrentUser, AllEvents, Session){
    
    if(!CurrentUser()){
        console.log("redirecting back to login");
        $state.go('login');
    }else{
        $scope.user = CurrentUser();
    }


    AllEvents.then(function(events){
        $scope.upcomingEvents = events.upcoming;
        $scope.pastEvents = events.past;
    });

    $scope.doLogout = function() {
        Session.destroy();
        $state.go('login')
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

// GET /settings
.controller("SettingsController", function($scope, $state, $http) {
    $scope.pageTitle = "Settings";
    $scope.fullHeader = true; 
})