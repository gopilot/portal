window.server = "https://api.gopilot.org"

angular.module('app', [
	'ui.router',
	'pilot.auth',
	'pilot.portal',
	'ngCookies'
])
.config(function($urlMatcherFactoryProvider){
	$urlMatcherFactoryProvider.strictMode(false);
})

