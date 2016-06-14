/**
 * Created by irkalla on 14.04.16.
 */
// configure our routes
angular.module('Flivess', ['ngRoute', 'ngCookies','ui.bootstrap','angularModalService', 'ngAnimate', 'googlechart', 'ngMaterial', 'ngImgCrop'])
    .config(function($routeProvider) {
        console.log("EN ROUTES.JS");
        $routeProvider
        // route for the home page
            .when('/', {
                templateUrl : 'views/login.html',
                controller  : 'loginCtl'
            })

            .when('/edit/:facebook_id', {
                templateUrl : 'views/edit.html',
                controller  : 'editCtl'
            })

            .when('/friends', {
                templateUrl : 'views/following.html',
                controller  : 'friendsCtl'
            })

            .when('/messages', {
                templateUrl : 'views/messages.html',
                controller  : 'messagesCtl'
            })

            .when('/editprofile', {
                templateUrl : 'views/profileEdit.html',
                controller  : 'profileEditCtl'
            })

            .when('/edit_foto', {
                templateUrl : 'views/edit_photo.html',
                controller  : 'editPhotoCtl'
            })

            .when('/profile/:friend', {
                templateUrl : 'views/profile.html',
                controller  : 'profileCtl'
            })

            .when('/home', {
                templateUrl : 'views/home.html',
                controller  : 'homeCtl'
            })

            .when('/home/:facebook_id', {
                templateUrl : 'views/home.html',
                controller  : 'homeFacebookCtl'
            })

            .when('/contact', {
                templateUrl : 'views/contact.html'
            })

            .when('/about', {
                templateUrl : 'views/about.html'
            })

            .when('/details/:id', {
                templateUrl : 'views/raceDetails.html',
                controller  : 'raceDetailsCtl'
            })

            .when('/historical', {
                templateUrl : 'views/historical.html',
                controller  : 'historicalCtl'
            })

            .when('/notifications', {
                templateUrl : 'views/notifications.html',
                controller  : 'notificationsCtl'
            })
    })
    .run(['$rootScope','$cookies', 'SocketIoFactory', function ($rootScope, $cookies,socket) {
        if(angular.isUndefined($cookies.getObject('user'))){
            $rootScope.isLogged=false;
        }
        else{
            $rootScope.userlog = $cookies.getObject('user');
            $rootScope.isLogged=true;
            console.log("Holiii" +$rootScope.userlog.username);
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
            })
        }
    }])

    .directive('uploaderModel', ["$parse", function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs) {
                iElement.on("change", function (e) {
                    $parse(iAttrs.uploaderModel).assign(scope, iElement[0].files[0]);
                });
            }
        };
    }])


.factory("SocketIoFactory", function ($rootScope) {
    var socket = null;
    var nodePath = "http://localhost:3000/";

    function listenerExists(eventName) {
        return socket.hasOwnProperty("$events") && socket.$events.hasOwnProperty(eventName);
    }

    return {
        connect: function () {
            socket = io.connect(nodePath);
        },
        connected: function () {
            return socket != null;
        },
        on: function (eventName, callback) {
            console.log("INSIDE ON");
            socket.on(eventName, function () {
                console.log("INSIDE ON IN ON");
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            console.log("INSIDE EMIT");
            socket.emit(eventName, data, function () {
                console.log("INSIDE EMIT IN EMIT");
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        },
        disconnect: function () {
            socket.disconnect();
        }
    };
});