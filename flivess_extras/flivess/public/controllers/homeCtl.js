/**
 * Created by irkalla on 14.04.16.
 */

angular.module('Flivess').controller('homeCtl', ['$scope', '$http', '$cookies', '$rootScope', function($scope, $http, $cookies, $rootScope) {
    var base_url_prod="http://localhost:8080";
    //var base_url_prod = "http://147.83.7.157:8080";

    $rootScope.isLogged=true;
    var userLogged = $cookies.getObject('user');
    console.log("EL USERNAME: "+ userLogged.username);
    $scope.noFollowing = false;

    $http.get(base_url_prod + '/tracks/friends/' + userLogged.username).success(function (data) {
        console.log(data);
        if(data=="") {
            $scope.noFollowing = true;
        }
        else{

            var int=0;
            for (var i = 0; i < data.length; i++) {
                var final_time_m = Math.floor(data[i].time / 60);
                var final_time_s = Math.floor(data[i].time - (final_time_m * 60));
                data[i].time =final_time_m+' min '+final_time_s+' s';

                if(data[i].distance<1) data[i].distance=data[i].distance * 1000 + ' m';
                else data[i].distance=data[i].distance + ' Km';

                if (data[i].avg_speed>0) data[i].avg_speed= Math.floor(60/(data[i].avg_speed)).toFixed(2);

                $http.get(data[i].pointsurl).success(function (datos) {
                    for (var i = 0; i < datos.length; i++) {
                        if (i == 0) data[int].path = datos[i].latitude + "," + datos[i].longitude;
                        else data[int].path += "|" + datos[i].latitude + "," + datos[i].longitude;
                    }
                    data[int].center = datos[1].latitude + "," + datos[1].longitude;
                    var marker1 = datos[0].latitude + "," + datos[0].longitude;
                    var marker2 = datos[datos.length -1].latitude + "," + datos[datos.length -1].longitude;

                    //strokeColor: "#FF0000",
                    //strokeOpacity: 0.7,
                    //strokeWeight: 3
                    data[int].img="http://maps.googleapis.com/maps/api/staticmap?center=" + data[int].center+"&zoom=17&size=470x180&maptype=roadmap&path=color:0xff0000ff|weight:3|"+data[int].path +"&sensor=false&markers=color:blue%7Clabel:S%7C"+marker1+"&markers=color:red%7Clabel:F%7C"+marker2;
                    //zoom:17
                    //mapTypeId: google.maps.MapTypeId.ROADMAP
                    int++;
                });
            }
            console.log(data);
            $scope.routes = data;
        }
    });
}]);