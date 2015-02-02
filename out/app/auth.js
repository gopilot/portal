angular.module('pilot.auth', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: '/partials/auth/login.html',
        controller: "LoginCtrl"
    })
})

.controller("LoginCtrl", function($scope, $http, Session, CurrentUser) {
    $scope.user = {};

    $scope.doLogin = function() {
        $http.post(window.server + "/login", {
            email: $scope.user.email,
            password: $scope.user.password,
        }).success(function(data) {
            Session.create(data.session, data.user);
        });
    };
})

.factory('CurrentUser', function() {
    // Default user object
    var user = {
        isLoggedIn: false,
        username: '',
    }

    return user;
})

.factory('Session', function($cookieStore, $http, CurrentUser) {
    var token;

    var retrieveToken = function() {
        console.log(sessionStorage);
        if($cookieStore.get("pilotSession")) return $cookieStore.get("pilotSession");
        if("pilotSession" in sessionStorage) return sessionStorage.pilotSession;

        return null;
    }

    var updateUser = function(u) {
        CurrentUser.isLoggedIn = true;
        CurrentUser.username = u.email;
        CurrentUser.name = u.name;
        CurrentUser.type = u.type;
    }

    var validateAndSetUser = function() {
        if(token) {
            console.log("T", token);
            $http.get(window.server + "/retrieve_user", {
                params: {
                    session: token 
                }
            }).success(function(data) {
                updateUser(data);
            })
        }
    };

    token = retrieveToken();
    validateAndSetUser();

    return {
        create: function(t, u, rememberUser) {
            if(rememberUser) {
                $cookieStore.put("pilotSession", t);
            }
            else {
                sessionStorage["pilotSession"] = t;
            }
            token = t;

            updateUser(u);
        },
        getToken: function() {
            return token;
        },
        destroy: function() {
            // TODO close session on server
            $cookieStore.remove("pilotSession");
            delete sessionStorage["pilotSession"];
            CurrentUser.isLoggedIn = false;
            CurrentUser.username = "";
            CurrentUser.name = "";
            CurrentUser.type = "";
        },
    }
})
