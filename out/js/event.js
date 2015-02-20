angular.module('pilot.event', ['ui.router'])
.config(function($stateProvider) {
    $stateProvider
    .state('portal.event', {
        abstract: true,
    	url: '/event/:slug',
    	templateUrl: '/portal/event/event.html',
    	controller: 'EventController'
    })
    .state('portal.event.announcements', {
        url: "",
        templateUrl: '/portal/event/announcements.html',
        controller: 'AnnouncementsController'
    })
    .state('portal.event.mentors', {
        url: "/request-mentor",
        templateUrl: '/portal/event/mentors.html',
        controller: 'MentorsController'
    })
    .state('portal.event.schedule', {
        url: '/schedule',
        templateUrl: '/portal/event/schedule.html',
        controller: 'ScheduleController'
    })
    .state('portal.event.team', {
        url: '/team',
        templateUrl: '/portal/event/team.html',
        controller: 'TeamController'
    })
    .state('portal.event.projects', {
        url: '/projects',
        templateUrl: '/portal/event/projects.html',
        controller: 'ProjectsController'
    })
})

.factory('AllEvents', function($http, $q) {
    var results = {
        all: [],
        upcoming: [],
        past: [],
        bySlug: {}
    }

    var deferred = $q.defer();


    if(sessionCache.allEvents){
        deferred.resolve(sessionCache.allEvents);
    }else{
        $http.get(server+'/events')
        .success(function(data){
            for(e in data){

                data[e].date = moment(data[e].start_date, "YYYY-MM-DD hh:mm:ss")
                results.all.push(data[e]);
                results.bySlug[data[e].slug] = data[e]
                if(data[e].date.unix() < moment().unix()){
                    results.past.push(data[e]);
                }else{
                    results.upcoming.push(data[e]);
                }
                sessionCache.allEvents = results
                deferred.resolve(results);
            }
        })
        .error(function(err){
        });
    }

    
    return deferred.promise;
})

// GET /event/(slug)
.controller("EventController", function($stateParams, $scope, $state, $http, AllEvents) {
    AllEvents.then(function(events){
        $scope.event = events.bySlug[$stateParams.slug];
        $scope.pageTitle = $scope.event.city;
    });
})
.controller("AnnouncementsController", function($stateParams, $scope, $state, $http, CurrentUser) {
    $scope.tab = "announcements";

    $http.get(server+"/events/"+$stateParams.slug+"/posts")
    .success(function(data){
        for(var i in data){
            data[i].fromNow = moment.utc(data[i].time).fromNow();
        }
        $scope.announcements = data;
    });

    $http.get(server+"/events/"+$stateParams.slug+"/tweets")
    .success(function(data){
        for(var i in data){
            data[i].fromNow = moment.utc(data[i].time).fromNow();
        }
        $scope.tweets = data;
    });

})
.controller("MentorsController", function($stateParams, $scope, $state, $http, AllEvents) {
    $scope.tab = "mentors";
    $scope.mentorRequest = {};
    $scope.errors = {}
    $scope.formError = false;

    $scope.requestMentor = function(){
        // TODO implement server-side for this
        
        $scope.errors.name = ! $scope.mentorRequest.name
        $scope.errors.location = ! $scope.mentorRequest.location
        $scope.errors.platform = ! $scope.mentorRequest.platform
        $scope.errors.problem = ! $scope.mentorRequest.problem

        if($scope.errors.name || $scope.errors.location || $scope.errors.platform || $scope.errors.problem){
            $scope.formError = true;
            return false
        }
        $scope.formError = false;

        alert($scope.mentorRequest.name+" is requesting a "+$scope.mentorRequest.platform+" mentor to come to "+$scope.mentorRequest.location+" to help him solve his problem: "+$scope.mentorRequest.problem);
    }
})
.controller("ScheduleController", function($stateParams, $scope, $state, $http, AllEvents) {
    $scope.tab = "schedule"
})
.controller("TeamController", function($stateParams, $scope, $state, $http, AllEvents) {
    $scope.tab = "team"
})
.controller("ProjectsController", function($stateParams, $scope, $state, $http, AllEvents) {
    $scope.tab = "projects"
})