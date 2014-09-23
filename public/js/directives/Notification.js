/**
 * Created by Daniel on 9/20/2014.
 */
angular.module("NotifyAnim", []).factory('notify', function () {

    return {
        run: function () {
            $('.bottomright').animate({top:'13px'}, 300, function() {
                $(this).delay(3000).animate({top:'-75px'}, 300);
            })
        }
    };
});