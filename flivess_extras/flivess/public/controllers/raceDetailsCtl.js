/**
 * Created by aitor on 1/5/16.
 */

angular.module('Flivess').controller('raceDetailsCtl', ['$scope', '$http', '$cookies', '$routeParams', '$location', '$mdDialog', function($scope, $http, $cookies, $routeParams, $location, $mdDialog) {
    var base_url_prod="http://localhost:8080";
    //var base_url_prod = "http://147.83.7.157:8080";


    var userLogged = $cookies.getObject('user');
    console.log("LA ID: "+ $routeParams.id);
    $scope.myTrack = false;
    $http.get(base_url_prod + '/track/' + $routeParams.id).success(function (response) {
        console.log(response);
        console.log(userLogged.username + " y el otro " + response.track_pedido.username);
        if(userLogged.username == response.track_pedido.username) $scope.myTrack = true;

        var final_time_m = Math.floor(response.track_pedido.time / 60);
        var final_time_s = Math.floor(response.track_pedido.time - (final_time_m * 60));
        response.track_pedido.time =final_time_m+' min '+final_time_s+' s';

        if(response.track_pedido.distance<1) response.track_pedido.distance=response.track_pedido.distance * 1000 + ' m';
        else response.track_pedido.distance=response.track_pedido.distance + ' Km';

        if (response.track_pedido.avg_speed>0)response.track_pedido.avg_speed= Math.floor(60/(response.track_pedido.avg_speed)).toFixed(2);

        $http.get(response.track_pedido.pointsurl).success(function(data) {
            console.log(data);
            var map = new google.maps.Map(document.getElementById("map"),
                {
                    zoom: 17,
                    center: new google.maps.LatLng(data[1].latitude,data[1].longitude),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });


            var route = [];
            for (var i = 0; i < data.length; i++){
                route[i] = new google.maps.LatLng(data[i].latitude,data[i].longitude);
            }
            var path = new google.maps.Polyline(
                {
                    path: route,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.7,
                    strokeWeight: 3
                });
            path.setMap(map);

            var marker=new google.maps.Marker({
                position:new google.maps.LatLng(data[0].latitude,data[0].longitude),
                label: 'START'
            });
            marker.setMap(map);

            var icon = {
                url: "css/maps/flag2.png", // url
                scaledSize: new google.maps.Size(50, 50), // scaled size
            };
            var marker2=new google.maps.Marker({
                position:new google.maps.LatLng(data[data.length-1].latitude,data[data.length-1].longitude),
                icon: icon
            });
            marker2.setMap(map);

            var datos = new Array();
            datos[0] =
            {
                c: [
                    {
                        "v": "Start"
                    },
                    {
                        "v": data[0].altitude
                    }
                ]
            }
            for (var i=1; i<data.length; i++) {
                if(i==data.length-1){
                    datos[i] =
                    {
                        c: [
                            {
                                "v": "Finish"
                            },
                            {
                                "v": data[i].altitude
                            }
                        ]
                    }
                }
                else {
                    var tiempo = data[i].timestamp - data[0].timestamp;
                    var dateA = new Date(tiempo);
                    datos[i] =
                    {
                        c: [
                            {
                                "v": dateA.getSeconds() + " sec"
                            },
                            {
                                "v": data[i].altitude
                            }
                        ]
                    }
                }
                if(data.length>240) {
                    i = i + 20;
                }
                if(240>data.length>120) {
                    i = i + 10;
                }
            }
            console.log(datos);

            $scope.chartObject = {
                "type": "AreaChart",
                "displayed": false,
                "data": {
                    "cols": [
                        {
                            "id": "month",
                            "label": "Month",
                            "type": "string",
                            "p": {}
                        },
                        {
                            "id": "laptop-id",
                            "label": "",
                            "type": "number",
                            "p": {}
                        }
                    ],
                    "rows": datos
                },
                "options": {
                    "title": "Altitude",
                    "isStacked": "true",
                    "fill": 20,
                    "displayExactValues": true,
                    "vAxis": {
                        "title": "Altitude (m)",
                        "gridlines": {
                            "count": 12
                        }
                    },
                    "tooltip": {
                        "isHtml": true
                    }
                },
                "formatters": {},
                "view": {}
            };


        });

        $scope.route = response.track_pedido;


        console.log(response.ranking.length);
        response.ranking.sort(function(a, b) {
            var s = parseFloat(a.time) - parseFloat(b.time);
            console.log("EL A: " + s);
            return s;
        });
        for(var i=0; i<response.ranking.length; i++) {
            console.log("1 TIEMPO: "+response.ranking[i].time);
            var final_time_m = Math.floor(response.ranking[i].time / 60);
            var final_time_s = Math.floor(response.ranking[i].time - (final_time_m * 60));
            response.ranking[i].time = final_time_m + ' min ' + final_time_s + ' s';
            console.log("2 TIEMPO: "+ response.ranking[i].time);
        }

        $scope.ranking = response.ranking;

    });

    $scope.showConfirm = function(ev, id) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Would you like to delete this track?')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('YES')
            .cancel('NO');
        $mdDialog.show(confirm).then(function() {
            $http.delete(base_url_prod + '/track/' + id).success(function (data) {
                $location.path('/historical');
            });
        }, function() {
            console.log("EN EL POZO");
        });
    };




    $scope.details = function (id) {
        $location.path('/details/' + id);
    };



    /*var datos =[
        {
            "c": [
                {
                    "v": "January"
                },
                {
                    "v": 19,
                    "f": "42 items"
                }
            ]
        },
        {
            "c": [
                {
                    "v": "February"
                },
                {
                    "v": 13
                }
            ]
        },
        {
            "c": [
                {
                    "v": "March"
                },
                {
                    "v": 24
                }
            ]
        }
    ];
    console.log(datos);*/
}]);