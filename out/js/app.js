window.server = "https://api.gopilot.org"
window.dateFormat = "MM/DD/YYYY hh:mm A"
window.serverDateFormat = "YYYY-MM-DD HH:mm:ss"
var sessionCache = {
    user: null
};

$(document).click(function() {
    // all dropdowns
    $('.select-element').removeClass('open');
});

angular.module('app', [
    'ui.router',
    'pilot.auth',
    'pilot.portal',
    'ngCookies'
])
.directive("customSelect", function(){
    return {
        require: '?ngModel',
        link: function(scope, element, attr, ngModel){
            console.log("customSelect");
            new CustomSelect(element[0], {
                onChange: function(value){
                    ngModel.$setViewValue(value);
                    scope.$apply()
                },
                ngModel: ngModel
            }, scope, attr);
        }
    }
})
/*
    TODOs:
        - Make custom <select> element for use with forms
        - Make registration form to recieve users from event sites
        - Attendees tab (table, sortable, filterable, etc)
        - Projects tab (search, filter, click to show project)
        - Schedule tab (talk to Gabe about designs?)
        - Registration page (search bar, easy to use)
*/