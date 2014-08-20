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
        define(['underscore', 'marionette'], factory);
    } else {
        // Browser globals
        /* globals _, Marionette */
        factory(_, Marionette);
    }
}(function(_, Marionette) {
    var FIRST_LOAD_DATA_NAME = 'Marionette.FadeInOutRegionCSS3.notFirstLoad';
    var PREFIXES = ['-webkit-', '-moz-', '-o-', ''];

    function prefix(property, value) {
        var result = {};

        _.each(PREFIXES, function(prefix) {
            result[prefix + property] = value;
        });

        return result;
    }

    Marionette.FadeInRegion = Marionette.Region.extend({
        open: function(view) {
            this.$el.hide(1000, _(function() {
                this.$el.html(view.el);
                this.$el.fadeIn();
            }).bind(this));
        }
    });

    Marionette.FadeInOutRegion = Marionette.Region.extend({
        open: function(view) {
            if (this.$el.data(FIRST_LOAD_DATA_NAME)) {
                this.$el.fadeOut(1000, _(function() {
                    this.$el.html(view.el);
                    this.$el.fadeIn();
                }).bind(this));
            } else {
                this.$el.data(FIRST_LOAD_DATA_NAME, true);
                this.$el.html(view.el);
            }
        }
    });

    Marionette.SlideDownRegion = Marionette.Region.extend({
        open: function(view) {
            if (this.$el.data(FIRST_LOAD_DATA_NAME)) {
                this.$el.hide();
                this.$el.html(view.el);
                this.$el.slideDown();
            } else {
                this.$el.data(FIRST_LOAD_DATA_NAME, true);
                this.$el.html(view.el);
            }
        }
    });

    Marionette.FadeInOutRegionCSS3 = Marionette.Region.extend({
        regionFadeDuration: 0.4,

        open: function(view) {
            var $region = this.$el;
            var fadeDuration = this.regionFadeDuration;
            var originalTriggerMethod = view.triggerMethod;

            if ($region.data(FIRST_LOAD_DATA_NAME)) {
                // Intercept all `triggerMethod` calls while the animation
                // is taking place. This will prevent `show` from being
                // captured elsewhere. We will restore the function after
                // the animation and manually fire a `show` event.
                view.triggerMethod = function(event) {};

                $region.css({
                    opacity: 0
                });

                _.delay(_.bind(function() {
                    // Done animating out

                    // Show HTML
                    $region.html(view.el);

                    // Restore `triggerMethod`
                    view.triggerMethod = originalTriggerMethod;

                    // Fire `show` event.
                    view.triggerMethod('show');

                    // Animate back in
                    $region.css({
                        opacity: 1
                    });
                }, this), fadeDuration * 1000);
            } else {
                $region.data(FIRST_LOAD_DATA_NAME, true);
                $region.html(view.el);
                $region.css(prefix('transition', 'opacity ' + this.regionFadeDuration + 's cubic-bezier(0, 0, 0.5, 1)'));
            }
        }
    });

    return {};

}));
