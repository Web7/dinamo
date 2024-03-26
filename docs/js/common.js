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
	var gallerySlick;

	var initMenu = function() {
		$('.menu-item').each(function() {
			var $this = $(this);
			$this.attr({style: $this.data('style')})
		});
	}

	var initGallery = function() {
		$('.gallery-item').each(function() {
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

	var gallerySlickSettings = {
		infinite: true,
		slidesToShow: 1,
		dots: true,
		arrows: false
	}

	var $menuSlick = $('.menu-slick');
	var $gallerySlick = $('.gallery-slick');

	var initMenuSlick = function() {
		if ($menuSlick.exists()) {
			menuSlick = $menuSlick.slick(menuSlickSettings);
		}
	}

	var initGallerySlick = function() {
		if ($gallerySlick.exists()) {
			gallerySlick = $gallerySlick.slick(gallerySlickSettings);
		}
	}

	var initSliders = function() {
		var windowWidth = $(window).width()
		if( windowWidth > 540 &&  !menuSlick.hasClass('slick-initialized')) {
			$menuSlick.slick(menuSlickSettings);
		}
		if (windowWidth > 540 && gallerySlick && gallerySlick.hasClass('slick-initialized')) {
			$gallerySlick.slick('unslick');
		}
		if (windowWidth < 540 && !$gallerySlick.hasClass('slick-initialized')) {
			gallerySlick = $gallerySlick.slick(gallerySlickSettings);
		}
	}

	$(function(){
		initMenuSlick();
		initSliders();
		initMenu();
		initGallery();
	});

	$(window).on('resize', function () {
		initSliders();

		setTimeout(function(){
			initMenu();
			initGallery();
		}, 100)
	});

}, window.jQuery, window.Zepto));