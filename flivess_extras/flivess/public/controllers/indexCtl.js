/**
 * Created by irkalla on 20.04.16.
 */
angular.module('Flivess').controller('indexCtl', ['$scope', '$http', '$cookies', '$rootScope', '$location', 'SocketIoFactory', function($scope, $http, $cookies, $rootScope, $location, socket) {

    var base_url_prod="http://localhost:8080";
    //var base_url_prod = "http://147.83.7.157:8080";
    var userLogged = $cookies.getObject('user');

    if(angular.isUndefined(socket)==true || socket==null){
        console.log("EN LA MIERDA");
    }

   /* if(angular.isUndefined($cookies.getObject('user')) == false)
    {
        var userLogged = $cookies.getObject('user');
        socket.on('new notification', function (data) {
            console.log("NOVA NOTIFICACIO");
            socket.emit('notification', userLogged.username, function (data) {
                console.log("ME DEVUELVE MIS NOTIFICACIONES");
                console.log(data);
            })
        })
    }*/

    $scope.perfil = function (username) {
        console.log(username);
        $location.path('/profile/' + username);
    };


    $scope.logOut = function() {
        console.log("DENTRO DEL LOGOUT");
        socket.disconnect();
        /*
        socket.on('disconnect', function(data){
            console.log(data);
        });*/
        $cookies.remove('user');


    };


    $scope.clickNot = function (user) {
        console.log("EL USARNAME PARA LAS NOTIFICACIONES: " + user);
        if ($rootScope.notlength != 0) {
            $http.put(base_url_prod + '/notifications/saw/' + user);
            $rootScope.notlength = 0;
        };
    };


//Search functions

    $http.get(base_url_prod+'/allusers/').success(function(data) {
        $scope.users = data;
        console.log("Obtengo users");
    });

    $scope.selected = undefined;

    $scope.onSelect = function ($item, $model, $label) {

        window.location.href = "#/profile/" + $model.username;
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
        console.log($model);
        $scope.userSelected = $model.username;

    };

    $scope.modelOptions = {
        debounce: {
            default: 500,
            blur: 250
        },
        getterSetter: true
    };
//--------------------------------------
}]);