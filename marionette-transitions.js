/*

██╗   ██╗███████╗███████╗     █████╗ ██╗     ██╗         ███████╗██╗██╗   ██╗███████╗
██║   ██║██╔════╝██╔════╝    ██╔══██╗██║     ██║         ██╔════╝██║██║   ██║██╔════╝
██║   ██║███████╗█████╗      ███████║██║     ██║         █████╗  ██║██║   ██║█████╗
██║   ██║╚════██║██╔══╝      ██╔══██║██║     ██║         ██╔══╝  ██║╚██╗ ██╔╝██╔══╝
╚██████╔╝███████║███████╗    ██║  ██║███████╗███████╗    ██║     ██║ ╚████╔╝ ███████╗
 ╚═════╝ ╚══════╝╚══════╝    ╚═╝  ╚═╝╚══════╝╚══════╝    ╚═╝     ╚═╝  ╚═══╝  ╚══════╝

Author: Travis Glines
Collaborators:
- Justin Anastos

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
        // Default fading duration in seconds. This can be overriden by
        // setting the value when `Marionette.FadeInOutRegionCSS3` is
        // extended or by setting the value on an instance of
        // `Marionette.FadeInOutRegionCSS3`.
        regionFadeDuration: 0.8,

        // Override the `show` function.
        show: function(view, options) {
            var $region = this.$el;
            var alreadyWaiting;
            var currentView = this.currentView;

            // See if there is no current view or a region. If so, then we
            // don't need to do anything fancy. Just send to the original
            // function.
            if (!currentView || !$region) {
                Marionette.Region.prototype.show.call(this, view, options);
                view.triggerMethod('before:fade:in');
                view.triggerMethod('after:fade:in');

                return;
            }

            // Check if we're waiting for another transition. We'll use this
            // value a few lines down.
            alreadyWaiting = !!this.waitingForViewTransition;

            // Save what we're waiting for. This will override any old
            // values, which is the desired behavior.
            this.waitingForViewTransition = _.toArray(arguments);

            // Bail if we're already waiting
            if (alreadyWaiting) {
                return;
            }

            // Wait for event to get fired after the region is closed.
            this.once('after:fade:out', _.bind(function() {
                var fadeInView = this.waitingForViewTransition[0];

                // Transition is done.
                //
                // Show the new view. This will use the arguments from the
                // last time show was called. More can be called between
                // when the fade out starts and finishes. THis makes sure
                // that we get the right view to show.
                //
                // Fade it back on.

                $region.css({
                    opacity: 1
                });

                this.waitingForViewTransition[0].triggerMethod('before:fade:in');
                this.trigger('before:fade:in');

                // Show the view in the region, but don't close the old one
                // since we already did that.
                Marionette.Region.prototype.show.apply(this, this.waitingForViewTransition.concat({
                    preventClose: true
                }));

                // Remove the waiting state
                this.waitingForViewTransition = null;

                _.delay(_.bind(function() {
                    fadeInView.triggerMethod('after:fade:in');

                    // Regions don't have a `triggerMethod`, so just use
                    // `trigger`.
                    this.trigger('after:fade:in');
                }, this), this.regionFadeDuration / 2 * 1000);

            }, this));

            this.close();
        },

        close: function(options) {
            var $region = this.$el;

            // Add opacity transition to the region
            $region.css(prefix('transition', 'opacity ' + (this.regionFadeDuration / 2) + 's cubic-bezier(0, 0, 0.5, 1)'));

            // Trigger event on region
            this.trigger('before:fade:out');

            if (this.currentView) {
                // Trigger event on view
                this.currentView.triggerMethod('before:fade:out');

                // Fade it out
                $region.css({
                    opacity: 0
                });

                // When the transition is complete, then call `_fadeOutComplete`.
                _.delay(_.bind(this._fadeOutComplete, this, arguments), this.regionFadeDuration / 2 * 1000);
            } else {
                this._fadeOutComplete();
            }
        },

        // When the fade out is complete, execute the actual close code and
        // fire events.
        _fadeOutComplete: function(args) {
            // Close the region before events get sent out
            Marionette.Region.prototype.close.apply(this, args);

            this.trigger('after:fade:out');

            if (this.currentView) {
                this.currentView.triggerMethod('after:fade:out');
            }
        }
    });

    return {};

}));
