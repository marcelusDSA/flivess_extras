/**
 * Created by irkalla on 14.04.16.
 */

angular.module('Flivess').controller('historicalCtl', ['$scope', '$http', '$cookies', '$rootScope', '$location', '$mdDialog', function($scope, $http, $cookies, $rootScope, $location, $mdDialog) {
   console.log("EN HISTORIAL CTL");
    var base_url_prod="http://localhost:8080";
    //var base_url_prod = "http://147.83.7.157:8080";

    $rootScope.isLogged=true;
    var userLogged = $cookies.getObject('user');
    $scope.noHistorical = false;

    var refresh = function() {
        $http.get(base_url_prod + '/tracks/' + userLogged.username).success(function (data) {
            console.log(data);
            if(data=="") {
                $scope.noHistorical = true;
            }
            else {
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    console.log("INSIDE");
                    var final_time_m = Math.floor(data[i].time / 60);
                    var final_time_s = Math.floor(data[i].time - (final_time_m * 60));
                    data[i].time = final_time_m + ' m ' + final_time_s + ' s';
                    if (data[i].distance < 1) data[i].distance = data[i].distance * 1000 + ' m';
                    else data[i].distance = data[i].distance + ' Km';

                    if (data[i].avg_speed>0) data[i].avg_speed= Math.floor(60/(data[i].avg_speed)).toFixed(2);
                }
                console.log(data);
                $scope.routes = data;
            }
        });
    };

    refresh();

    $scope.details = function (id) {
        $location.path('/details/' + id);
    };

    $scope.showConfirm = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Would you like to delete this tracks?')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('YES')
            .cancel('NO');
        $mdDialog.show(confirm).then(function() {
            var rutas = new Array();
            angular.forEach($scope.routes, function (item) {
                console.log(item);
                if(item.selected) rutas.push(item._id);
            });
            for(var i=0; i<rutas.length; i++){
                $http.delete(base_url_prod + '/track/' + rutas[i]).success(function (data) {
                    refresh();
                });
            }
        }, function() {
            console.log("EN EL POZO");
        });
    };
}]);