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

app.controller("HomeCtrl", function($scope, $rootScope, $resource, $routeParams) {
    if ($rootScope.user){
        var Orders = $resource("/api/users/"+$rootScope.user.email+"/orders");
        Orders.get("", function(orders){
            var orderlist = {};
            orders = orders.toJSON();
            if (orders["ordernr"]){
                orderlist[orders["ordernr"]] = orders;
            }
            else
                orderlist = orders;
            $scope.orders = orderlist;
            console.log(orderlist);
        })
    }
});

app.controller("OrderCtrl", function($scope, $resource, $routeParams, $http){
    var vm = this;
    var Order = $resource("/api/orders/"+$routeParams.ordernr);
    Order.get("", function(order){
        console.log(order);
        $scope.order = order;
    })
});

app.controller("WinterRentalCtrl", function($scope, $resource, $routeParams, $http){
    var vm = this;
    $scope.skitypes = ["skitype1", "skitype2"];
    console.log($scope.skitypes);
    /*
    var Order = $resource("/api/orders/"+$routeParams.ordernr);
    Order.get("", function(order){
        console.log(order);
        $scope.order = order;
    })
    */
});

app.controller("SummerRentalCtrl", function($scope, $resource, $routeParams, $http){
    var vm = this;
    $scope.biketypes = ["biketype1", "biketype2"];
    /*
    var Order = $resource("/api/orders/"+$routeParams.ordernr);
    Order.get("", function(order){
        console.log(order);
        $scope.order = order;
    })
    */
});

app.controller("LodgeCtrl", function($scope, $resource, $routeParams, $http){
    var vm = this;
    var Lodge = $resource("/api/lodges/"+$routeParams.lodgenr);
    Lodge.get("", function(lodge){
        console.log(lodge);
        $scope.lodge = lodge;
    })
    vm.rent = rent;
    function rent(){
        vm.dataLoading = true;
        var order = {
            "lodgenr": $scope.lodge.lodgenr,
            "email": "johan@bjareho.lt",
            "price": $scope.lodge.pricehigh,
            "weekstart": vm.weekstart,
            "weekend": vm.weekend,
        };
        console.log(order);
        $http.post('/api/lodge/rent/', order).then(
            // Success
            function(response){
                vm.dataLoading = false;
                console.log(response);
            }, // Error
            function(response){
                vm.dataLoading = false;
                console.log(response);
            }
    );}
});

app.controller("LodgeListCtrl", function($scope, $resource, $routeParams, $location) {
    var Lodges = $resource("/api/lodges");
    Lodges.get("", function(lodges){
        console.log(lodges);
        $scope.lodges = lodges;
    });
    $scope.gotoLodge = function(lodgenr) {
        $location.url('/lodges/'+lodgenr);
    };
});

app.controller("LoginController", function($location, AuthenticationService){
    var vm = this;

    vm.login = login;
    function login() {
        vm.dataLoading = true;
        console.log(vm);
        AuthenticationService.Login(vm.email, vm.password, function (response) {
            console.log(response);
            if (response.success) {
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
