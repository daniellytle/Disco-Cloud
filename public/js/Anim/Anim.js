/**
 * Created by Daniel on 10/24/2014.
 */
angular.module('Anim',[]).factory('playAnim',function () {

    console.log("loading animations");

    var begin = function() {
        $('.animPlugin').addClass("spin");
        console.log("spinning");
    };

    var close = function() {
        $('.animPlugin').removeClass("spin");
        console.log("stop spinning");
    }

    var toggle = function() {
        $('.messageWrap').addClass("out");
    };

    var toggleout = function() {
        $('.messageWrap').removeClass("out");
    };

    return {run : begin,
        stop : close,
        hide : toggle,
        show : toggleout};
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