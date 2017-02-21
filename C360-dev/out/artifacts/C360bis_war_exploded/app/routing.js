angular.module('App')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/pageblanche',{
                templateUrl: 'pageblanche.html'
            })
            .otherwise({redirectTo:'/'});
    }]);