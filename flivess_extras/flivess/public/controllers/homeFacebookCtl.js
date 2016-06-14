/**
 * Created by aitor on 30/4/16.
 */
angular.module('Flivess').controller('homeFacebookCtl', ['$scope', '$http', '$cookies', '$routeParams', '$rootScope', '$location', 'SocketIoFactory', function($scope, $http, $cookies, $routeParams, $rootScope, $location, socket) {
    var base_url_prod="http://localhost:8080";
    //var base_url_prod = "http://147.83.7.157:8080";
    $rootScope.isLogged=true;

    console.log($routeParams.facebook_id);

    var loadUser = function(){
        $http.get(base_url_prod + '/users/user/facebook/' + $routeParams.facebook_id).success(function (response) {
            console.log("QUE ME DEVUELVES PAYO?");
            console.log(response[0]);
            $cookies.putObject('user',response[0]);
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

                //$scope.$apply($scope.notlength=data.numeros);
                //$scope.$apply($scope.notification=data.notifications);
                $rootScope.notlength=data.numeros;
                $rootScope.notification=data.notifications;
                console.log(data);
            });

            $location.path('/home');
        });

    }
    loadUser();
}]);