// TODO animate these tabs so that they all load at the same time

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
        controller: 'AnnouncementsController',
    })
    .state('portal.event.mentors', {
        url: "/request-mentor",
        templateUrl: '/portal/event/mentors.html',
        controller: 'MentorsController',
    })
    .state('portal.event.schedule', {
        url: '/schedule',
        templateUrl: '/portal/event/schedule.html',
        controller: 'ScheduleController',
    })
    .state('portal.event.team', {
        url: '/team',
        templateUrl: '/portal/event/team.html',
        controller: 'TeamController',
    })
    .state('portal.event.projects', {
        url: '/projects',
        templateUrl: '/portal/event/projects.html',
        controller: 'ProjectsController',
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
    $scope.modalShown = false;

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
    $scope.inviteEmail = ""
    $scope.errorText = ""
    $scope.modalShown = false;
    $scope.team = [false, false, false, false];
    $scope.teamCount = 0;
    $scope.project = {};

    $http.get(server+"/events/"+$stateParams.slug+"/projects?team="+$scope.user.id)
    .success(function(data){
        if(data[0]){
            $scope.project = data[0];
            console.log($scope.project);
            var ids = _.map($scope.team, function(user){return user.id || user;});
            for(var i in $scope.project.team){
                if( !($scope.project.team[i].id == $scope.user.id || ids.indexOf($scope.project.team[i].id) > -1 ) ){
                    for(var j in $scope.team)
                        if(!$scope.team[j]){
                            console.log("placing user at", j)
                            $scope.team[j] = $scope.project.team[i];
                            break
                        }
                    $scope.teamCount += 1;
                }
            }
        }
    })
    $scope.openModal = function(i){
        if($scope.team[i]) return;
        console.log("opening modal");
        $scope.modalShown = true;
    }
    $scope.checkEmail = function(){
        if($scope.errorText && $scope.inviteEmail){
            $scope.errorText = "";
        }
    }
    $scope.invite = function(){
        if(!$scope.inviteEmail){
            $scope.errorText = "You need to input an email"
            return false
        }
        $scope.errorText = "";

        var url = '/projects';
        if($scope.project.id) 
            url = '/projects/'+$scope.project.id+'/addTeammate';
        
        $http.post(server+url, {
            'teammate': $scope.inviteEmail,
            'event': $stateParams.slug,
        })
        .success(function(data){
            $scope.project = data;
            console.log('returned!', data);
            var ids = _.map($scope.team, function(user){return user.id || user;});
            console.log(ids);
            for(var i in data.team){
                if( !(data.team[i].id == $scope.user.id || ids.indexOf(data.team[i].id) > -1 ) ){
                    for(var j in $scope.team)
                        if(!$scope.team[j]){
                            $scope.team[j] = data.team[i];
                            break
                        }
                    $scope.teamCount += 1;
                }
            }
            $scope.modalShown = false;
            $scope.inviteEmail = "";
        })
        .error(function(data){
            $scope.errorText = "We couldn't find that email. Make sure this is the email your teammate used to register for this event.";
        });
    }
    $scope.removeTeammate = function(i){
        $http.post(server+'/projects/'+$scope.project.id+'/removeTeammate', {
            'teammate': $scope.team[i].email
        })
        .success(function(data){
            $scope.project = data;
            $scope.teamCount -= 1;

            // Collapse list
            var k = i;
            while($scope.team[k+1]){
                $scope.team[k] = $scope.team[k+1];
                k++;
            }
            $scope.team[k] = false
        })
        .error(function(data){
            console.log("Error removing user", data);
        });
    }
})
.controller("ProjectsController", function($stateParams, $scope, $state, $http, AllEvents) {
    $scope.tab = "projects"
})