angular.module('controllers').factory('InitBddService', ['$http','hash', function ($http,hash) {

    var admin = {
        personnalIdNumber: "VIA0000",
        lastName: "Admin",
        firstName: "VISEO",
        email:"viseo.admin@viseo.com",
        password:"viseo01",
        isAdmin: true
    };
    var collaborator = {
        personnalIdNumber: "COL0000",
        lastName: "Julien",
        firstName: "Julien",
        email:"julien.collab@viseo.com",
        password:"viseo01",
        isAdmin: false
    };
    admin.password=hash(admin.password);

    return {
        init: function () {
            return  $http.post("api/collaborateurs", admin).then(function(data) {
                return $http.post("api/collaborateurs", collaborator)
            });
        }
    };
}]);