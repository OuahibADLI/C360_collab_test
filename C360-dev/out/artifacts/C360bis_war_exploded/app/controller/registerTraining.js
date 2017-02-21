angular.module('controllers')
    .controller('controllerRegisterTraining', ['$http', '$location', '$timeout', 'SelectTrainingService', 'mySharedService', '$scope',
        function ($http, $location, $timeout, SelectTrainingService, mySharedService, $scope) {

            var self = this;
            self.regex = {};
            self.isNewTrainingTitle = true;
            self.isFalseForm = false;
            self.isThereAnEmptyField = false;
            self.isTrainingSaved = false;
            /*** Recupération des regex **/
            $http.get("api/formations/regex").then(function (data) {
                self.regex.trainingTitle = new RegExp(data.data.TRAINING_TITLE);
                self.regex.numberHalfDays = new RegExp(data.data.NUMBER_HALF_DAYS);
            });
            /*** Recupération des Thèmes **/
            $http.get("api/themes").then(function (data) {
                self.topicList = data.data;
            });
            /*** Recupération des formations **/
            $http.get("api/formations").then(function (data) {
                self.trainingList = data.data;
            });
            /*** Injecter le thème ajouté dans la liste currente **/
            $scope.$on('handleTopicBroadcast', function () {
                self.topicList.push(mySharedService.topicToAdd);
            });

            self.isErrorInputMessageDisplayed = function (inputForm, focus) {
                return !inputForm.$error.required && inputForm.$invalid && !focus;
            };

            self.verifyForm = function (trainingForm) {
                self.isNewTrainingTitle = true;
                self.isFalseForm = false;
                self.isThereAnEmptyField = false;
                self.isTrainingSaved = false;
                if (trainingForm.$error.required) {
                    self.isThereAnEmptyField = true;
                    self.isFalseForm = false;
                }
                else if (trainingForm.$invalid) {
                    self.isFalseForm = true;
                    self.isThereAnEmptyField = false;
                }
                else {
                    self.saveAction();
                }
            };

            self.saveAction = function () {
                self.training.trainingTitle = self.training.trainingTitle.replace(/ +/g, " ");
                $http.post("api/formations", self.training).then(function (response) {
                        self.trainingList.push(response.data);
                        self.isTrainingSaved = true;
                        self.training.trainingTitle = null;
                        self.training.topicDescription = null;
                        self.training.numberHalfDays = null;
                        self.setConfirmationMessageTimOut();
                    },
                    function (error) {
                        if (error.data.message === "trainingTitle") {
                            self.isNewTrainingTitle = false;
                        } else {
                            console.error(error);
                        }
                    });
            };

            self.setConfirmationMessageTimOut = function () {
                $timeout(function () {
                    self.isTrainingSaved = false;
                }, 3000);
            };

            var indexedTeams = [];
            self.returnTrainingListToFilter = function () {
                indexedTeams = [];
                return self.trainingList;
            };
            self.filterTopic = function (training) {
                var isNewTopic = indexedTeams.indexOf(training.topicDescription.name) == -1;
                if (isNewTopic) indexedTeams.push(training.topicDescription.name);
                return isNewTopic;
            };
            self.manageSession = function (training) {
                SelectTrainingService.select(training);
                $location.url("/ManageSession");
            };
        }])

    .controller('controllerAddTopic', function ($scope, $http, ngDialog, mySharedService) {
        var self = $scope;
        var myRegEx = new RegExp('^[a-zA-Z0-9+#\'-. áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+$');
        self.isNewTopic = true;
        self.isErroneousTopic = false;
        self.addTopic = function (topic) {
            if (topic === undefined || topic.name === '' || self.verifyTopicName(topic)) {
                self.isErroneousTopic = true;
            }
            else {
                $http.post("api/themes", topic).then(function (response) {
                        topic = response.data;
                        mySharedService.broadcastTopic(topic);
                        ngDialog.close();
                    },
                    function (error) {
                        if (error.data.message === "name") {
                            self.isNewTopic = false;
                        } else {
                            console.error(error);
                        }
                    });
            }
        };
        self.verifyTopicName = function (topic) {
            return !myRegEx.test(topic.name);
        };
        self.initializeAlertMessage = function () {
            self.isNewTopic = true;
            self.isErroneousTopic = false;
        };
    })

    .factory('mySharedService', function ($rootScope) {
        var sharedTopicObject = {};
        sharedTopicObject.broadcastTopic = function (topicToAddToCurrentList) {
            sharedTopicObject.topicToAdd = topicToAddToCurrentList;
            this.$broadcastItem();
        };
        sharedTopicObject.$broadcastItem = function () {
            $rootScope.$broadcast('handleTopicBroadcast');
        };
        return sharedTopicObject;
    })

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/RegisterTraining', {
                templateUrl: 'templates/registerTraining.html',
                controller: 'controllerRegisterTraining',
                controllerAs: 'DF',
                resolve: {isAdminConnected: returnCurrentUserService}
            });

        function returnCurrentUserService(CurrentUserService) {
            return CurrentUserService.checkIsAdminConnected();
        }

        returnCurrentUserService.$inject = ['currentUserService'];
    }
    ]);