angular.module('controllers').factory('SelectTrainingService', [function () {
    var trainingSelected;
    return {
        select: function (myTraining) {
            if (myTraining) {
                trainingSelected = myTraining;
            }
        },
        get: function () {
            return trainingSelected;
        }
    };
}]);