/**
 * Created by irkalla on 14.04.16.
 */

angular.module('Flivess').controller('profileEditCtl', ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location) {
    var base_url_prod="http://localhost:8080";
    //var base_url_prod = "http://147.83.7.157:8080";

    var userLogged = $cookies.getObject('user');
    console.log(userLogged.username);

    $http.get(base_url_prod + '/user/' + userLogged._id).success(function(response){
        console.log("He obtenido lo que pedia");
        $scope.user = response;
        $scope.contact = "";
    });

    $scope.range_weight = function(start,end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    $scope.range_height = function(start,end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    $scope.updateUser = function() {

        console.log($scope.user._id);
        $http.put(base_url_prod + '/user/' + $scope.user._id, $scope.user).success(function (response) {
            $cookies.putObject('user', response);
            $location.path('/profile/' + userLogged.username);
        })
    };
}]);