angular.module('controllers')
    .controller('ctrlManageSession', ['$http', '$location', 'SelectTrainingService','SelectSessionService', function ($http, $location, SelectTrainingService,SelectSessionService) {
        var self = this;
        self.listTrainingSession=[];
        self.isNoSessionPallend = false;

        self.training = SelectTrainingService.get();
        /*** Recupération les sessions **/
        $http.get("api/formations/" + self.training.id + "/sessions").then(function (data) {
            self.listTrainingSession = data.data;
            if (self.listTrainingSession.length === 0) self.isNoSessionPallend = true;
        });

        self.redirectRegisterTrainingSession = function () {
            $location.url("/RegisterTrainingSession");
        };

        self.returnToRegisterTraining = function () {
            $location.url("/RegisterTraining");
        };

        self.redirectToSession=function (session) {
            SelectSessionService.select(session);
            $location.url("/ChangeRegisterTrainingSession");
        };
    }])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/ManageSession', {
                templateUrl: 'templates/manageSession.html',
                controller: 'ctrlManageSession',
                controllerAs: 'MS',
                resolve: { isConnected : returnCurrentUserService }
            });
        function returnCurrentUserService(CurrentUserService) {
            return CurrentUserService.checkIsAdminConnected();
        }
        returnCurrentUserService.$inject = ['currentUserService'];
    }
    ]);