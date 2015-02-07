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
.factory('CurrentUser', function($cookieStore, $http, $q) {
    var user = {
        isLoggedIn: false,
        username: '',
        type: ''
    }

    var deferred = $q.defer();

    if(!$cookieStore.get("pilotSession")){
        deferred.resolve(false);
    }else if(sessionCache.user){
        console.log("using user cache");
        deferred.resolve(sessionCache.user);
    }else{
        var token = $cookieStore.get("pilotSession");
        console.log("GET /retrieve_user")
        $http({
            method: 'GET',
            url: window.server + "/auth/retrieve_user",
            headers: {
                'session': token
            }
        }).success(function(data) {
            // Setup CurrentUser object
            user.isLoggedIn = true;
            user.username = data.email;
            user.name = data.name;
            user.type = data.type;
            $http.defaults.headers.common['session'] = token
            
            sessionCache.user = user;
            deferred.resolve(user);
        }).error(function(){
        });
    }

    return deferred.promise;
})

.factory('Session', function($cookieStore, $http, CurrentUser) {
    var token = null;

    return {
        // Called to create a session when the user logs in
        create: function(t, data, rememberUser) {
            $cookieStore.put("pilotSession", t);
            
            token = t;
            $http.defaults.headers.common['session'] = t

            CurrentUser.isLoggedIn = true;
            CurrentUser.username = data.email;
            CurrentUser.name = data.name;
            CurrentUser.type = data.type;
        },

        getToken: function() {
            return token;
        },
        
        // Called to remove a session when the user logs out
        destroy: function() {
            // TODO close session on server
            $cookieStore.remove("pilotSession");
            delete $http.defaults.headers.common['session']

            CurrentUser.isLoggedIn = false;
            CurrentUser.username = "";
            CurrentUser.name = "";
            CurrentUser.type = "";
        },
    }
})

// Controller for the Login Page
.controller("LoginController", function($scope, $state, $http, Session, CurrentUser) {
    
    CurrentUser.then(function(user){
        if(user)
            $state.go('portal.dashboard');
    });

    $scope.user = {};

    $scope.doLogin = function() {
        console.log("logging in")
        $http.post(window.server + "/auth/login", {
            email: $scope.user.email,
            password: $scope.user.password,
        }).success(function(data) {
            Session.create(data.session, data.user);
            console.log("success in doLogin")
            // Redirect to dashboard
            $state.go('portal.dashboard'); // Not working??
        });
    };
})
