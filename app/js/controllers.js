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
    vm.newcustomer = {};
    var Order = $resource("/api/orders/"+$routeParams.ordernr);
    Order.get("", function(order){
        console.log(order);
        vm.newcustomer['ordernr'] = order.ordernr;
        var priceperweek = 500*(order.endweek-order.startweek+1);
        if ("WinterRentals" in order)
            order.rentalprice = priceperweek * Object.keys(order.WinterRentals).length;
        if ("SummerRentals" in order)
            order.rentalprice = priceperweek * Object.keys(order.SummerRentals).length;
        $scope.order = order;
    })

    vm.add_customer = function(){
        console.log(vm.newcustomer);
        vm.dataLoading = true;
        $http.post('/api/orders/add_customer', vm.newcustomer).then(
            function(response){ // Success
                vm.dataLoading = false;
                console.log(response);
                window.alert('Successfully added new person');
                location.reload();// Reloads page
            }, function(){ // Error
                vm.dataLoading = false;
                window.alert('Error renting skis');
        });
    }
});

app.controller("WinterRentalCtrl", function($scope, $resource, $routeParams, $http){
    var vm = this;

    $scope.skitypes = ["Downhill", "Cross-country"];
    $scope.skishoesizes = [35,36,37,38,39,40,41,42,43,44,45,46];
    $scope.skipolelengths = [80,85,90,95,100,105,110,115,120,125,130,135,140];
    $scope.helmetsizes = ["XS", "S", "M", "L", "XL", "XXL"];

    console.log("Winterrental")
    vm.skis = { 'ordernr': $scope.order.ordernr,
                'startweek': $scope.order.startweek,
                'endweek': $scope.order.endweek};

    vm.rent = rent;
    function rent(){
        console.log(vm.skis);
        vm.dataLoading = true;
        $http.post('/api/rent/skis', vm.skis).then(
            function(response){ // Success
                vm.dataLoading = false;
                console.log(response);
                window.alert('Ski rental successful');
                location.reload();// Reloads page
            }, function(){ // Error
                vm.dataLoading = false;
                window.alert('Error renting skis');
        });
    }
});

app.controller("SummerRentalCtrl", function($scope, $resource, $routeParams, $http){
    var vm = this;
    $scope.order = $scope.$parent.order;

    $scope.biketypes = ["Road bike", "Mountainbike", "Downhill bike"];
    $scope.helmetsizes = ["XS", "S", "M", "L", "XL", "XXL"];

    vm.bike = { 'ordernr': $scope.order.ordernr,
                'startweek': $scope.order.startweek,
                'endweek': $scope.order.endweek };
    vm.rent = rent;
    function rent(){
        console.log(vm.bike)
        vm.dataLoading = true;
        $http.post('/api/rent/bike', vm.bike).then(
            function(response){ // Success
                vm.dataLoading = false;
                console.log(response);
                window.alert('Bike rental successful');
                location.reload();// Reloads page
            }, function(){ // Error
                vm.dataLoading = false;
                window.alert('Error renting bike');
        });
    }
});

app.controller("LodgeCtrl", function($scope, $resource, $routeParams, $http, $location){
    var vm = this;
    var Lodge = $resource("/api/lodges/"+$routeParams.lodgenr);
    Lodge.get("", function(lodge){
        console.log(lodge);
        $scope.lodge = lodge;
        if ('startweek' in lodge.orderdates){
            lodge.orderdates = {"fake": lodge.orderdates};
        }
        for (orderid in lodge.orderdates){
            var orderstart = lodge.orderdates[orderid]["startweek"];
            var orderlength = lodge.orderdates[orderid]["endweek"]-orderstart+1;
            var index = $scope.weeks_available.indexOf(orderstart);
            if (index){
                $scope.weeks_available.splice(index, orderlength);
            }
        }
    })
    var weeks = [];
    for (n=1; n<=53; n++){
        weeks.push(n);
    }
    $scope.weeks_available = weeks;
    vm.rent = rent;
    function rent(){
        vm.dataLoading = true;
        // Check that the weekspan is valid
        if (vm.weekstart > vm.weekend){
            window.alert("Startdate cannot be after enddate!");
            vm.dataLoading = false;
            return;
        }
        // Check that the lodge is actually available
        var rentweeks = [];
        for (week=parseInt(vm.weekstart); week<=vm.weekend; week++)
            rentweeks.push(week);
        var weeks_rentable = true;
        for (weeki in rentweeks){
            if ($scope.weeks_available.indexOf(rentweeks[weeki]) == -1){
                weeks_rentable = false;
                console.log("Week " + rentweeks[weeki] + " is already rented")
            }
        }
        if (!weeks_rentable){
            window.alert("The lodge is unavailable those weeks, please choose some other weeks");
            vm.dataLoading = false;
            return;
        }
        // Create order
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
                if (response.data.success){
                    console.log(response.data);
                    window.alert("Lodge successfully rented!");
                    $location.url("/");
                }
                else {
                    window.alert(response.data.message)
                }
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
