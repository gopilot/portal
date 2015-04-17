angular.module('pilot.auth', ['ui.router'])

// Router code
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: '/auth/login.html',
        controller: "LoginController"
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
