angular.module('controllers').factory('MockConnexionService',[function() {
    var collaboratorSelected;
    return {
        select: function(myCollaborator){
            if(myCollaborator) {
                collaboratorSelected = myCollaborator;
            }
        },
        getCollaboratorDescription: function () {
            return collaboratorSelected;
        },
        getCollaboratorIdentity: function () {
            return {id: collaboratorSelected.id};
        }
    };
}]);