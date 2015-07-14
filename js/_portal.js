angular.module('pilot.portal', ['ui.router', 'pilot.event'])
.config(function($stateProvider) {
    $stateProvider
    .state('portal', {
        abstract: true,
        templateUrl: '/portal/layout.html',
        controller: "PortalController"
    })
    .state('portal.dashboard', {
    	url: '/?event&registered',
    	templateUrl: '/portal/dashboard.html',
    	controller: 'DashboardController',
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
        if($scope.user.type === 'organizer'){
            $scope.upcomingEvents = events.upcoming;
            $scope.pastEvents = events.past;
        }else{
            $scope.upcomingEvents = [];
            $scope.pastEvents = [];
            $scope.user.events.forEach(function(id){
                var event = events.byId[id];
                console.log(event.name, Date(event.end_date), Date(), Date(event.end_date) > Date())
                if(moment.utc(event.end_date).unix() > moment.utc().unix()){
                    $scope.upcomingEvents.push(event);
                }else{
                    $scope.pastEvents.push(event);
                }
            });
        }
    });

    $scope.doLogout = function() {
        Session.destroy();
        $state.go('login')
    }

    $scope.openSelect = function (event){
        console.log("opening", event.target)
        $(event.target).toggleClass('open');
        return event.stopPropagation()();
    }
})

// GET /
.controller("DashboardController", function($filter, $scope, $stateParams, AllEvents, $timeout) {
    $scope.pageTitle = "Dashboard";
    $scope.fullHeader = true; 
    $scope.event = {}

    if($stateParams.registered){
        AllEvents.then(function(events){
            $scope.event = events.byId[$stateParams.event];
            $timeout(function(){
                console.log('timeout')
                $scope.showModal = true;
            }, 500)
        })
    }
})

// GET /events
.controller("EventListController", function($scope, $state, $http) {
    $scope.pageTitle = "All Events";
    $scope.fullHeader = true; 
})

// GET /settings
.controller("SettingsController", function($scope, $state, $http, Session) {
    $scope.pageTitle = "Settings";
    $scope.fullHeader = true;
    console.log($scope.user);
    $scope.updateUser = function(user){
        if(user.has_experience)
            user.has_experience = user.has_experience=='true';
        delete user.events;
        $http.put(server+'/users/'+user.id+"", user)
        .success(function(data){
            console.log("User updated!", data);
            Session.refresh();
        })
        .error(function(data){
            alert("Error: "+data);
        })
    }
})