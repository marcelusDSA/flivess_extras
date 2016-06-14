/**
 * Created by aitor on 31/5/16.
 */
angular.module('Flivess').controller('editPhotoCtl', ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location) {
    var base_url_prod="http://localhost:8080";
    //var base_url_prod = "http://147.83.7.157:8080";
    var userLogged = $cookies.getObject('user');

    $http.get(base_url_prod + '/user/' + userLogged._id).success(function(response){
        console.log("He obtenido lo que pedia");
        $scope.myImage = response.imgurl;
    });

    $scope.myCroppedImage='';

    var handleFileSelect=function(evt) {
        var file=evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function($scope){
                $scope.myImage=evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

    $scope.updatePhoto = function () {
        /*var img = $scope.myCroppedImage;
        var imageBase64 = img;
        var blob = new Blob([imageBase64], {type: "image/jpeg"});
        console.log(blob);
        var file = new File([blob], 'imageFileName.jpg', {type: "image/jpeg"});
        console.log(file);
        var formData = new FormData();
        formData.append('file', file);
        console.log(formData);*/


        var img = $scope.myCroppedImage;
        var imageBase64 = img;
        var blob = dataURItoBlob(imageBase64);

        function dataURItoBlob(dataURI) {

            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {type:mimeString});
        }
        var file = new File([blob], 'fileName.jpeg', {type: "image/jpeg"});
        var formData = new FormData();
        formData.append('file', file);
        console.log(formData);

        $http.put(base_url_prod + '/addimg/' + userLogged.username, formData, {
                headers: {
                    "Content-type": undefined
                },
                transformRequest: angular.identity
            }
        ).success(function () {
            $location.path('/editprofile');
        });
    }


}]);