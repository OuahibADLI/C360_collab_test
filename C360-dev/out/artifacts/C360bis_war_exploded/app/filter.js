//Filtre qui renvoie une sous liste d'objet
angular.module('filter')
    .filter('searchByString',[function () {
        return function () {
            var listObject = arguments[0];
            var stringToSearch = arguments[1];

            if (typeof(stringToSearch) !== "undefined") {
                var listeObjetFiltre = [];
                for (var i = 0; i < listObject.length; i++) {
                    for (var iteratorProperties = 2; iteratorProperties < arguments.length; iteratorProperties++) {
                        if (listObject[i][arguments[iteratorProperties]].toUpperCase().substr(0, stringToSearch.length)
                            == stringToSearch.toUpperCase()) {
                            listeObjetFiltre.push(listObject[i]);
                            break;
                        }
                    }
                }
                return listeObjetFiltre;
            }
            return listObject;
        };
    }]);