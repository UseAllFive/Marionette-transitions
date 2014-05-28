/* globals jQuery, Backbone, Marionette */
/*

██╗   ██╗███████╗███████╗     █████╗ ██╗     ██╗         ███████╗██╗██╗   ██╗███████╗
██║   ██║██╔════╝██╔════╝    ██╔══██╗██║     ██║         ██╔════╝██║██║   ██║██╔════╝
██║   ██║███████╗█████╗      ███████║██║     ██║         █████╗  ██║██║   ██║█████╗
██║   ██║╚════██║██╔══╝      ██╔══██║██║     ██║         ██╔══╝  ██║╚██╗ ██╔╝██╔══╝
╚██████╔╝███████║███████╗    ██║  ██║███████╗███████╗    ██║     ██║ ╚████╔╝ ███████╗
 ╚═════╝ ╚══════╝╚══════╝    ╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝     ╚═╝  ╚═══╝  ╚══════╝

Author: Travis Glines
Author URI: http://useallfive.com/

Description: Support for transitions and animations between views in Marionette
Package URL: https://github.com/UseAllFive/Marionette-transitions

*/

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'marionette'], factory);
    } else {
        // Browser globals
        factory(jQuery, Backbone.Marionette);
    }    
}(function($, Marionette) {    

    Marionette.FadeInRegion = Marionette.Region.extend({
        open: function(view) {
            this.$el.hide(1000, (function() {
                this.$el.html(view.el);
                this.$el.fadeIn();
            }).bind(this));
        }
    });

    Marionette.FadeInOutRegion = Marionette.Region.extend({
        open: function(view) {
            if(this.$el.data('not_first_load')){
                this.$el.fadeOut(1000, (function() {
                    this.$el.html(view.el);
                    this.$el.fadeIn();
                }).bind(this));
            } else {
                this.$el.data('not_first_load', true)                
                this.$el.html(view.el);
            }
        }
    });

    return {};

}));
