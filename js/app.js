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
    
});

/*
    TODOs:
        - Make custom <select> element for use with forms
        - Make registration form to recieve users from event sites
        - Attendees tab (table, sortable, filterable, etc)
        - Projects tab (search, filter, click to show project)
        - Schedule tab (talk to Gabe about designs?)
        - Registration page (search bar, easy to use)
*/