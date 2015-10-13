app = angular.module('DBProjectSite', ["ngResource", "ngRoute", "ngCookies"]);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
        templateUrl: "templates/home.html",
        controller: "HomeCtrl",
        controllerAs: 'vm'
    });
    $routeProvider.when("/lodges/", {
        templateUrl: "templates/lodges.html",
        controller: "LodgeListCtrl",
        controllerAs: 'vm'
    });
    $routeProvider.when("/login/", {
        templateUrl: "templates/login.html",
        controller: "LoginController",
        controllerAs: 'vm'
    });
    $routeProvider.when("/register/", {
        templateUrl: "templates/register.html",
        controller: "RegisterController",
        controllerAs: 'vm'
    });
    $locationProvider.html5Mode(true);
});
