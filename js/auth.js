angular.module('pilot.auth', ['ui.router'])

// Router code
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: '/auth/login.html',
        controller: "LoginController"
    })
    .state('register', {
        url: '/register?token',
        templateUrl: '/auth/register.html',
        controller: "RegisterController"
    })
})
.factory('CurrentUser', function($cookieStore, $http) {
    return function(){
        var sess = $cookieStore.get('pilotSession');
        if(sess){
            $http.defaults.headers.common['session'] = sess;
        }
        return $cookieStore.get('pilotUser')
    }
})
.factory('Session', function($cookieStore, $http) {
    return {
        create: function(t, user) {
            $cookieStore.put("pilotUser", user);
            $cookieStore.put("pilotSession", t);
            
            $http.defaults.headers.common['session'] = t
        },

        refresh: function() {
            console.log("Refreshing", window.server + "/auth/retrieve_user");
            return $http.get(window.server + "/auth/retrieve_user")
            .success(function(data) {
                $cookieStore.put("pilotUser", data);
            });
        },

        getToken: function() {
            return $cookieStore.get("pilotSession");
        },
        
        destroy: function() {
            
            // TODO close session on server
            $cookieStore.remove("pilotSession");
            $cookieStore.remove("pilotUser");

            delete $http.defaults.headers.common['session'];
        },
    }
})

// Controller for the Login Page
.controller("LoginController", function($scope, $window, $state, $http, Session, CurrentUser) {
    
    if(CurrentUser()){
        $state.go('portal.dashboard');
    }

    $scope.user = {};
    var rand = Math.floor(Math.random()*16)+1;
    $scope.backgroundImage = "url(/img/backgrounds/"+rand+".jpg)";

    $scope.doLogin = function() {
        $http.post(window.server + "/auth/login", {
            email: $scope.user.email,
            password: $scope.user.password,
        }).success(function(data) {
            Session.create(data.session, data.user);
            $state.go('portal.dashboard')
        });
    };
})

.controller("RegisterController", function($scope, $http, $stateParams, Session, $state, AllEvents){
    console.log("RegisterController");
    $scope.fullHeader = true;
    $scope.user = {};

    var rand = Math.floor(Math.random()*16)+1;
    $scope.backgroundImage = "url(/img/backgrounds/"+rand+".jpg)";
    
    $http.get("https://api.gopilot.org/users/find_incomplete/"+$stateParams.token)
    .error(function(data){

    })
    .success(function(data){
        Session.create(data.session, data.user);
        $scope.user = data.user;
        $scope.event_id = data.user.events[0]
        
    });

    $scope.register = function(user){
        $scope.user.notes = {}
        $scope.user.notes[$scope.event_id] = $scope.user.event_notes
        $scope.user.has_experience = user['has_experience'] === "true";
        delete $scope.user[ 'events' ];
        delete $scope.user[ 'event_notes' ];

        $http.put(server+'/users/'+$scope.user.id+"", $scope.user)
        .success(function(data){
            console.log("User updated!", data);
            Session.refresh();
            $state.go('portal.dashboard', {'registered': true, 'event': $scope.event_id});
        })
        .error(function(data){
            alert("Error: "+data);
        })
    }
});
