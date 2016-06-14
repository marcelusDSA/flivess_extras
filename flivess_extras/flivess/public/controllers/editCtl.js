/**
 * Created by aitor on 1/6/16.
 */

angular.module('Flivess').controller('editCtl', ['$scope', '$http', '$cookies', '$rootScope', '$location','$routeParams', 'SocketIoFactory', function($scope, $http, $cookies, $rootScope, $location, $routeParams, socket)  {
    var base_url_prod="http://localhost:8080";
    //var base_url_prod = "http://147.83.7.157:8080";
    $scope.vlogin=true;


    if(!angular.isUndefined($cookies.getObject('user'))){
        $location.path('/home');
    }

    $rootScope.isLogged=false;

    $http.get(base_url_prod + '/users/user/facebook/' + $routeParams.facebook_id).success(function (response) {
        console.log("QUE ME DEVUELVES PAYO?");
        console.log(response[0]);
        $scope.usuario = response[0];
    });

    $scope.register = function(){
        $scope.alert.message="";

        if (angular.isUndefined($scope.user.username)){
            console.log("FALTA ALGUN DATO");
            $scope.alertReg = true;
            $scope.alert.message= "Fields uncomplete";

        }

        else if(!angular.isUndefined($scope.user.username)){
            $scope.usuario.username = $scope.user.username;
            $http.put(base_url_prod + '/user_facebook/' + $scope.usuario._id,  $scope.usuario).success(function (response) {
                $cookies.putObject('user', response);
                $rootScope.userlog = $cookies.getObject('user');

                socket.connect();
                socket.on('connection', function(data){
                    console.log(data);
                    socket.emit('username',$rootScope.userlog.username);
                    socket.emit('notification',$rootScope.userlog.username);
                });
                socket.on('listaUsers', function(data){
                    console.log("LOS USUARIOS");
                    console.log(data);
                });
                console.log("3");
                socket.on('new notification', function(data){
                    socket.emit('notification',$rootScope.userlog.username, function(data){
                    } )
                });
                socket.on('notification', function(data){

                    $rootScope.notlength=data.numeros;
                    $rootScope.notification=data.notifications;
                    console.log(data);
                });


                window.location.href = "#/home";
            })
        }
        else{
            console.log("FALTA ALGUN DATO 22");
            $scope.alertReg = true;
            $scope.alert.message= "Fields uncomplete";

        }
    };


    $scope.closeAlert = function(){
        $scope.alertReg=false;
        $scope.alert.message="";
    }

    $scope.cambio = function () {
        $scope.vlogin=true;
        $scope.alertReg=false;
        $scope.alert.message="";
    }

}]);