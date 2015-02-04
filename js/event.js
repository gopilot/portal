angular.module('pilot.event', ['ui.router'])
.config(function($stateProvider) {
    $stateProvider
    .state('portal.event', {
    	url: '/event/:slug',
    	templateUrl: '/portal/event/event.html',
    	controller: 'EventController'
    })
})

// GET /event/(slug)
.controller("EventController", function($stateParams, $scope, $state, $http, Session, CurrentUser) {
    $scope.pageTitle = "Event Name";
    $scope.eventSlug = $stateParams.slug;
});