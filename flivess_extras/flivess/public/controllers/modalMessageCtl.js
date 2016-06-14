/**
 * Created by aitor on 22/4/16.
 */

angular.module('Flivess').controller('modalMessageCtl', ['$scope', '$element', 'friend', 'close', function($scope, $element, friend, close) {
        console.log("Dentro de modalMessageCtl");
        $scope.message = null;
        $scope.title = friend;

        //  This close function doesn't need to use jQuery or bootstrap, because
        //  the button has the 'data-dismiss' attribute.
        $scope.send = function() {
            $element.modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            close({
                message: $scope.message
            }, 500); // close, but give 500ms for bootstrap to animate
        };

        //  This cancel function must use the bootstrap, 'modal' function because
        //  the doesn't have the 'data-dismiss' attribute.
        $scope.cancel = function() {
            //  Manually hide the modal.
            $element.modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            //  Now call close, returning control to the caller.
            close({
            }, 500); // close, but give 500ms for bootstrap to animate
        };

    }]);
