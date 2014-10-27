/**
 * Created by Daniel on 10/24/2014.
 */
angular.module('Anim',[]).factory('playAnim',function () {

    console.log("loading animations");

    var flag = false;

    var begin = function() {
        move('#a', 250, true);
        move('#b', 293, true);
        move('#c', 271, true);
        move('#d', 222, true);
    };

    var toggle = function() { flag = !flag; }

    var move = function (elt,
                         interval, flip) {
        if (flip)
            $(elt).animate({
                    height: '20%'
                }, interval,

                function () {
                    flip = !flip;
                    move(elt, interval - 20, flip);
                });
        else {
            if (flag) {
                $(elt).animate({
                        height: '100%'
                    }, interval,

                    function () {
                        flip = !flip;
                        move(elt, interval + 20, flip);
                    });
            }
            else {
                $(elt).animate({
                    height: '0px'
                }, interval);
            }
        }
    };

    return {run : begin,
        change : toggle};
}).factory('notifyAnim',function() {
    var slideUp = function() {
        $('.bottomright').animate({bottom:'15px',opacity:1},400);
    };

    var slideDown = function() {
        $('.bottomright').animate({bottom:'0px',opacity:0},400);
    };

    var scrolling = function(exec) {
        $('.table').scroll(function () {
            if ($('.table').scrollTop() + $('.table').height() == $('.songs').height()) {
                exec();
            }
        });
    }

    return {
        run : slideUp,
        out : slideDown,
        init : scrolling
    }

});