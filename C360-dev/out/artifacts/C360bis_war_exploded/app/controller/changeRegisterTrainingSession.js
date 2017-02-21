angular.module('controllers')
    .controller('controllerChangeRegisterTrainingSession', ['DatepickerService', '$http', '$filter', '$location', 'SelectSessionService', 'SelectTrainingService', function (datepicker, $http, $filter, $location, SelectSessionService, SelectTrainingService) {
        var self = this;
        self.isSessionAlreadyPlanned = false;
        self.isFalseForm = false;
        self.isFalseTimeSlot = false;
        self.regex = {};
        self.regex.beginning = "^(((0[1-9]|[12]\\d|3[01])\\/(0[13578]|1[02])\\/((1[6-9]|[2-9]\\d)\\d{2}))|((0[1-9]|[12]\\d|30)\\/(0[13456789]|1[012])\\/((1[6-9]|[2-9]\\d)\\d{2}))|((0[1-9]|1\\d|2[0-8])\\/02\\/((1[6-9]|[2-9]\\d)\\d{2}))|(29\\/02\\/((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$";
        self.regex.ending = "^(((0[1-9]|[12]\\d|3[01])\\/(0[13578]|1[02])\\/((1[6-9]|[2-9]\\d)\\d{2}))|((0[1-9]|[12]\\d|30)\\/(0[13456789]|1[012])\\/((1[6-9]|[2-9]\\d)\\d{2}))|((0[1-9]|1\\d|2[0-8])\\/02\\/((1[6-9]|[2-9]\\d)\\d{2}))|(29\\/02\\/((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$";
        self.training = SelectTrainingService.get();
        initTimeSlot();
        self.beginningHour = self.timeSlotsTraining[0];
        self.endHour = self.timeSlotsTraining[20];
        self.d1 = datepicker.build();
        self.d2 = datepicker.build();
        setEndDateByAddingNumberOfHalfDays(self.training.numberHalfDays);
        selectTime(self.d1.dt, self.beginningHour);
        selectTime(self.d2.dt, self.endHour);

        var meetingRoom1 = {name: 'Salle Phuket'};
        var meetingRoom2 = {name: 'Salle Bali'};
        self.meetingRoomList = [meetingRoom1, meetingRoom2];
        self.trainingLocation = meetingRoom1;

        function setEndDateByAddingNumberOfHalfDays(sessionNumberHalfDays) {
            self.d2.dt = self.d2.setEndDate(self.d1.dt,sessionNumberHalfDays);
        }

        function selectTime(date, time) {
            var tab = time.split(":");
            date.setHours(parseInt(tab[0], 10));
            date.setMinutes(parseInt(tab[1], 10));
        }

        var session = SelectSessionService.get();
        self.d1.dt = parseDate(session.beginning);
        self.d2.dt = parseDate(session.ending);
        self.beginningHour = session.beginningTime;
        self.endHour = session.endingTime;
        self.trainingLocation = self.meetingRoomList.find(function (elem) {
            return session.location === elem.name;
        });
        self.training = session.trainingDescription;

        function parseDate(input) {
            var parts = input.split('/');
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }

        self.selectTime = function (date, time) {
            var tab = time.split(":");
            date.setHours(parseInt(tab[0], 10));
            date.setMinutes(parseInt(tab[1], 10));
        };

        function initTimeSlot() {
            function pad2(number) {
                return (number < 10 ? '0' : '') + number;
            }

            var myArray = [];
            var beginningHour = 8;
            var endHour = 18;
            var feet = 30;
            var endMinute = 30;
            var beginningMinute = 0;
            var numberFeetHour = 60 / feet;
            var numberHours = (endHour - beginningHour) * numberFeetHour;
            var numberFeetMinutes = (endMinute - beginningMinute) / feet;

            for (var recorder = 0; recorder < (numberHours + numberFeetMinutes); recorder++) {
                myArray.push(pad2((beginningHour + Math.floor(recorder / numberFeetHour))).toString() + ":" + pad2((recorder % numberFeetHour * feet)).toString());
            }
            self.timeSlotsTraining = myArray;
        }

        self.saveAction = function () {
            var session = {
                id: SelectSessionService.get().id,
                trainingDescription: self.training,
                beginning: $filter('date')(self.d1.dt, "dd/MM/yyyy"),
                ending: $filter('date')(self.d2.dt, "dd/MM/yyyy"),
                beginningTime: self.beginningHour,
                endingTime: self.endHour,
                location: self.trainingLocation.name
            };
            $http.put("api/sessions", session).then(function (data) {
                    self.isSessionAlreadyPlanned = false;
                    $location.url('/ManageSession');
                },
                function (error) {
                    if (error.data.message === "TrainingSession already planned") {
                        self.isSessionAlreadyPlanned = true;
                    } else {
                        console.error(error);
                    }
                });
        };

        validateTraining = function () {
            if (self.training === undefined) self.isFalseForm = true;
            else self.DateCorrect();
        };

        self.DateCorrect = function () {
            if (self.d1.dt < self.d2.dt) {
                self.isFalseForm = false;
                self.isFalseTimeSlot = false;
            }
            else {
                self.isFalseTimeSlot = true;
            }
        };

        self.verifyForm = function (sessionFormIsInvalid) {
            selectTime(self.d1.dt, self.beginningHour);
            selectTime(self.d2.dt, self.endHour);
            if (sessionFormIsInvalid === false) {
                validateTraining();
                if (self.isFalseForm === false && self.isFalseTimeSlot === false && self.isFalseDate === false && self.isWorkingDay === true) self.saveAction();
            }
            else {
                self.isFalseForm = true;
                if (self.isFalseDate == true) self.isFalseForm = false;
            }
        };
        self.isFalseDate = false;
        self.isWorkingDay = true;
        self.checkDateValide = function (date) {
            self.isFalseForm = false;
            self.isWorkingDay = true;
            self.isFalseDate = false;
            if (date.dt === undefined) {
                self.isFalseTimeSlot = false;
                self.isFalseDate = true;
            }
            else {
                if (self.isWeekend(date)) {
                    self.isWorkingDay = false;
                }
            }
        };
        self.isWeekend = function (date) {
            return (date.dt.getDay() == 0 || date.dt.getDay() == 6);
        };
    }])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/ChangeRegisterTrainingSession', {
                templateUrl: 'templates/registerTrainingSession.html',
                controller: 'controllerChangeRegisterTrainingSession',
                controllerAs: 'DS',
                resolve: { isConnected : returnCurrentUserService }
            });
        function returnCurrentUserService(CurrentUserService) {
            return CurrentUserService.checkIsAdminConnected();
        }
        returnCurrentUserService.$inject = ['currentUserService'];
    }
    ]);