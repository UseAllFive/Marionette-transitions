/* globals jQuery, Marionette */
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

(function() {

    'use strict';

	Marionette.Region.prototype.open = function(view) {
    	this.$el.hide();
    	this.$el.html(view.el);
    	this.$el.slideDown("slow");
	};

    return {};

}());
