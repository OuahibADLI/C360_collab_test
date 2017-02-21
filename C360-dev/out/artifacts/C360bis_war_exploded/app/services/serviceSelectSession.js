angular.module('controllers').factory('SelectSessionService', [function () {
    var sessionSelected;
    return {
        select: function (mySession) {
            if (mySession) {
                sessionSelected = mySession;
            }
        },
        get: function () {
            return sessionSelected;
        }
    };
}]);