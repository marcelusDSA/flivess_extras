/**
 * Created by irkalla on 14.04.16.
 */

angular.module('Flivess').controller('friendsCtl', ['$scope', '$http', '$cookies', '$location', '$mdDialog', function($scope, $http, $cookies, $location, $mdDialog) {
    var base_url_prod="http://localhost:8080";
    //var base_url_prod = "http://147.83.7.157:8080";


    var userLogged = $cookies.getObject('user');
    $scope.userlogged = userLogged;
    $scope.noFollowing = false;

    var refresh = function() {
        $http.get(base_url_prod + '/friends/' + userLogged.username).success(function (data) {
            console.log(data);
            $scope.users = data;
                if($scope.users == '')
                    $scope.noFollowing = true;
                else $scope.noFollowing = false;
        }).error(function (data, status) {
            alert('get data error!');
        });
    }

    refresh();


    $scope.profile = function (name) {
        $location.path('/profile/' + name);
    };

  $scope.showConfirm = function(ev, username) {
      console.log(username);
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
            .title('Would you like to unfollow this user?')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('YES')
            .cancel('NO');
      $mdDialog.show(confirm).then(function() {
        $http.delete('/friend/' + userLogged.username + "/" + username).success(function () {
                    refresh();
        });
      }, function() {
        console.log("EN LA OTRA FUNCION");
      });
    };
    /*
        var userLogged = $cookies.getObject('user');
        console.log(userLogged.username);

        var refresh = function() {

            $http.get(base_url_prod + '/friends/' + userLogged.username).success(function (response) {

                console.log("Acabo de recibir los amigos");
                console.log(response);
                $scope.friends = response;

            });
        }
        refresh();

        $scope.remove = function (friend) {
            $http.delete('/friend/' + userLogged.username + "/" + friend).success(function () {
                refresh();
            });
        };

        $scope.profile = function (name) {
            $location.path('/profile/' + name);
        }
    */



}]);