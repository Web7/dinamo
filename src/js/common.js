(function (factory, jQuery, Zepto) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object' && typeof Meteor === 'undefined') {
		module.exports = factory(require('jquery'));
	} else {
		factory(jQuery || Zepto);
	}
}(function($){
	'use strict';

	$.fn.exists = function () {
		return this.length !== 0;
	};

	var menuSlick;

	var initMenu = function() {
		$('.menu-item').each(function() {
			var $this = $(this);
			$this.attr({style: $this.data('style')})
		});
	}

	var menuSlickSettings = {
		infinite: true,
		slidesToShow: 6,
		variableWidth: true,
		centerMode: true,
		appendArrows: $('.menu-slick-arrows'),
		responsive: [{
			breakpoint: 540,
			settings: 'unslick'
		}]
	};

	var $menuSlick = $('.menu-slick');

	var initMenuSlick = function() {
		if ($menuSlick.exists()) {
			menuSlick = $menuSlick.slick(menuSlickSettings);
		}
	}

	$(function(){
		initMenuSlick();
		initMenu();
	});

	$(window).on('resize', function () {
		if( $(window).width() > 540 &&  !menuSlick.hasClass('slick-initialized')) {
			$menuSlick.slick(menuSlickSettings);
		}
		setTimeout(function(){
			initMenu();
		}, 100)
	});

}, window.jQuery, window.Zepto));