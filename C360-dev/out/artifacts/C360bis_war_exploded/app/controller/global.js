angular.module('controllers').controller('globalController', ['InitBddService', 'MockConnexionService', '$http', 'currentUserService', '$location', function (InitBddService, MockConnexionService, $http, currentUserService, $location) {
    var self = this;
    self.showBddButton = false;

    $http.get("api/collaborateurs").then(function (response) {
        self.collaborators = response.data;
        if (self.collaborators.length === 0) {
            self.showBddButton = true
        }
        else {
            self.showBddButton = false;
            self.collaboratorSelected = self.collaborators[0];
            self.collaboratorConnected = self.collaborators[0];
        }

    });

    self.initBase = function () {
        InitBddService.init();
        self.showBddButton = false;
    };

    self.disconnectUser = function () {
        if (self.isUserConnected() !== undefined) {
            currentUserService.disconnectCurrentUser();
            $location.url('/');
            location.reload();
        }
    };

    self.displayCollaborator = function () {
        if (currentUserService.getUserLastName() != undefined) {
            return ' ' + currentUserService.getUserFirstName() + ' ' + currentUserService.getUserLastName().toUpperCase();
        }
    };

    self.selectCollaborator = function (myCollaborator) {
        MockConnexionService.select(myCollaborator);
        self.collaboratorConnected = MockConnexionService.getCollaboratorDescription();
    };

    self.isUserConnected = function () {
        return currentUserService.isUserConnected();
    }

}]);