app.controller("MainCtrl", function($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$routeParams = $routeParams;
    $scope.$location = $location;
});

app.controller("HeaderCtrl", function($scope, $resource, $routeParams, $cookieStore, $rootScope, AuthenticationService) {
    var vm = this;
    $rootScope.user = $cookieStore.get('currentUser');
    $scope.logout = function(){
        AuthenticationService.ClearCredentials();
    }
});

app.controller("HomeCtrl", function($scope, $resource, $routeParams) {

});

app.controller("LodgeListCtrl", function($scope, $resource, $routeParams) {
    var Lodges = $resource("/api/lodges");
    Lodges.get("", function(lodges){
        console.log(lodges);
        $scope.lodges = lodges;
    });
});

app.controller("LoginController", function($location, AuthenticationService){
    var vm = this;

    vm.login = login;
    function login() {
        vm.dataLoading = true;
        AuthenticationService.Login(vm.email, vm.password, function (response) {
            console.log(response);
            if (response.success) {
                //AuthenticationService.SetCredentials();
                $location.path('/');
            } else {
                window.alert(response.message);
                vm.dataLoading = false;
            }
        });
    };
});


app.controller("RegisterController", function(UserService, $location, $rootScope){
    var vm = this;
    vm.register = register;

    function register() {
        vm.dataLoading = true;
        UserService.Create(vm.user)
            .then(function (response) {
                console.log(response);
                if (response.success) {
                    window.alert('Registration successful');
                    $location.path('/login');
                } else {
                    window.alert(response.message);
                    vm.dataLoading = false;
                }
            });
    }
});
