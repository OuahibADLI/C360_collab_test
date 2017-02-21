angular.module('serviceDatepicker').factory('DatepickerService', [function () {

    return {
        build: function () {
            var disabled = function disabled(data) {
                var date = data.date,
                    mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            };
            var popup1 = {
                opened: false
            };
            var holidaysCalculation = function (year) {
                var JourAn = new Date(year, "00", "01");
                var FeteTravail = new Date(year, "04", "01");
                var Victoire1945 = new Date(year, "04", "08");
                var FeteNationale = new Date(year, "06", "14");
                var Assomption = new Date(year, "07", "15");
                var Toussaint = new Date(year, "10", "01");
                var Armistice = new Date(year, "10", "11");
                var Noel = new Date(year, "11", "25");
                //**var SaintEtienne = new Date(year, "11", "26");**//
                var G = year % 19;
                var C = Math.floor(year / 100);
                var H = (C - Math.floor(C / 4) - Math.floor((8 * C + 13) / 25) + 19 * G + 15) % 30;
                var I = H - Math.floor(H / 28) * (1 - Math.floor(H / 28) * Math.floor(29 / (H + 1)) * Math.floor((21 - G) / 11));
                var J = (year * 1 + Math.floor(year / 4) + I + 2 - C + Math.floor(C / 4)) % 7;
                var L = I - J;
                var MoisPaques = 3 + Math.floor((L + 40) / 44);
                var JourPaques = L + 28 - 31 * Math.floor(MoisPaques / 4);
                var Paques = new Date(year, MoisPaques - 1, JourPaques);
                //**var VendrediSaint = new Date(year, MoisPaques-1, JourPaques-2);**//
                var LundiPaques = new Date(year, MoisPaques - 1, JourPaques + 1);
                var Ascension = new Date(year, MoisPaques - 1, JourPaques + 39);
                var Pentecote = new Date(year, MoisPaques - 1, JourPaques + 49);
                var LundiPentecote = new Date(year, MoisPaques - 1, JourPaques + 50);
                //**SaintEtienne et Vendredi Saint sont des fêtes exclusivement**//
                //**alscacienne est ignoré **//
                return new Array(JourAn, Paques, LundiPaques, FeteTravail, Victoire1945, Ascension, Pentecote, LundiPentecote, FeteNationale, Assomption, Toussaint, Armistice, Noel);
            };
            var calculateMinimumDate = function (beginDate, numberOfDays) {
                var beginDateYear = beginDate.getFullYear();
                var beginDateMonth = beginDate.getMonth();
                var beginDateDay = beginDate.getDate();
                //**initialiser des compteurs**//
                var cpt_i = 0;
                var cpt_j = 0;
                var cpt_k = 0;
                //**init. des tableaux récupérant les jours feries de l'annee en cours et de l'annee suivante.**//
                var tab_1 = new Array;
                var tab_2 = new Array;
                tab_1 = holidaysCalculation(beginDateYear);
                tab_2 = holidaysCalculation(beginDateYear + 1);
                for (cpt_i; cpt_j < numberOfDays; cpt_i++) {
                    var date_eval = new Date(beginDateYear, beginDateMonth, beginDateDay + cpt_i);
                    var day_date_eval = date_eval.getDay();
                    if ((day_date_eval != 6) && (day_date_eval != 0)) {
                        cpt_j++;
                        for (cpt_k = 0; cpt_k < 13; cpt_k++) {
                            if (date_eval.getMonth() == tab_1[cpt_k].getMonth() && date_eval.getFullYear() == tab_1[cpt_k].getFullYear() && date_eval.getDate() == tab_1[cpt_k].getDate()) {
                                cpt_j--;
                                break;
                            }
                            if (date_eval.getMonth() == tab_2[cpt_k].getMonth() && date_eval.getFullYear() == tab_2[cpt_k].getFullYear() && date_eval.getDate() == tab_2[cpt_k].getDate()) {
                                cpt_j--;
                                break;
                            }
                        }
                    }
                }
                return date_eval;
            };
            return {
                dt: new Date(),
                dateOptions: {
                    dateDisabled: disabled,
                    formatYear: 'yy',
                    maxDate: new Date(2020, 5, 22),
                    minDate: new Date(),
                    startingDay: 1
                },
                altInputFormats: ['M!/d!/yyyy'],
                popup1: popup1,
                today: function (date) {
                    date = new Date();
                },
                open1: function () {
                    popup1.opened = true;
                },
                setEndDate: function (beginDate, numberOfHalfDays) {
                    var numberOfDays = numberOfHalfDays / 2;
                    return calculateMinimumDate(beginDate, numberOfDays);
                }
            };
        }
    };
}]);