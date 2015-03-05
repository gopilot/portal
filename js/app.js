window.server = "https://api.gopilot.org"
window.dateFormat = "MM/DD/YYYY hh:mm A"
window.serverDateFormat = "YYYY-MM-DD HH:mm:ss"
var sessionCache = {
    user: null
};

angular.module('app', [
    'ui.router',
    'pilot.auth',
    'pilot.portal',
    'ngCookies'
])
.config(function($urlRouterProvider, $locationProvider, $httpProvider){
    // $urlRouterProvider.rule(function($injector, $location) {

    //     var path = $location.path();
    //     var hasTrailingSlash = path[path.length-1] === '/';

    //     if(hasTrailingSlash) {

    //       //if last charcter is a slash, return the same url without the slash  
    //       var newPath = path.substr(0, path.length - 1); 
    //       console.log("removing path string");
    //       return newPath; 
    //     } 
    // });
});

