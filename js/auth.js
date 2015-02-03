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
.factory('CurrentUser', function() {
    var user = {
        isLoggedIn: false,
        username: '',
        callbacks: [],
        registerCallback: function(cb){
            this.callbacks.push(cb);
        }
    }

    return user;
})

.factory('CheckAuth', function($cookieStore, $http, CurrentUser) {
    return function(callback){
        if(!$cookieStore.get("pilotSession"))
            return callback(false);

        var token = $cookieStore.get("pilotSession");
        $http({
            method: 'GET',
            url: window.server + "/auth/retrieve_user",
            headers: {
                'session': token
            }
        }).success(function(data) {
            // Setup CurrentUser object
            CurrentUser.isLoggedIn = true;
            CurrentUser.username = data.email;
            CurrentUser.name = data.name;
            CurrentUser.type = data.type;
            $http.defaults.headers.common['session'] = token

            return callback(CurrentUser);
        }).error(function(){
            return callback(false);
        });
    }
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
.controller("LoginController", function($scope, $location, $http, Session, CurrentUser, CheckAuth) {
    
    CheckAuth(function(user){
        if(user){
            $location.path('/');
        }
    })

    $scope.user = {};
    console.log("Login controller", CurrentUser)


    $scope.doLogin = function() {
        console.log("logging in")
        $http.post(window.server + "/auth/login", {
            email: $scope.user.email,
            password: $scope.user.password,
        }).success(function(data) {
            Session.create(data.session, data.user);
            console.log("success in doLogin")
            // Redirect to dashboard
            $location.path('/');
        });
    };
})
