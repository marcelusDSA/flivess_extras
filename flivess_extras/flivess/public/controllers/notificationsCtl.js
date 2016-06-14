/**
 * Created by aitor on 28/5/16.
 */

angular.module('Flivess').controller('notificationsCtl', ['$scope', '$http', '$cookies', '$rootScope', '$location', '$mdDialog', function($scope, $http, $cookies, $rootScope, $location, $mdDialog) {
    console.log("EN HISTORIAL CTL");
    var base_url_prod = "http://localhost:8080";
    //var base_url_prod = "http://147.83.7.157:8080";
    var userLogged = $cookies.getObject('user');

    $http.get(base_url_prod + '/notifications/user/' + userLogged.username).success(function (response) {
        console.log(response);
        $scope.notifications = response;
    });

}]);