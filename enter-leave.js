/* Animate views */

var transitionend = 'transitionend';

$(document).on(transitionend, '.animate.active', function() {
	$(this).dequeue();
});

function transition(className, options, complete) {
	options = options || {};

	if (options.className)
		className += ' ' + options.className;

	var stop;

	return {
		start: function(next, hooks) {
			hooks.stop = stop = animate.call(this, className, options);
		},

		finish: function() {
			if (complete) complete.call(this);
			stop();
			$(this).removeClass('animate active').css({ height: '' }).dequeue();
		}
	};
}

function animate(className, options) {
	var elem = $(this).addClass('animate ' + className);

	// force redraw
	this.offsetHeight;

	var timeout = setTimeout(function() {
		elem.addClass('active');

		var duration = parseFloat(elem.css('transition-duration'));

		timeout = setTimeout(function() {
			// finish animation if we are still waiting for transitionend

			if (elem.is('.animate.active')) elem.dequeue();
		}, duration > 0 ? duration * 1100 : 0);
	});

	return function() {
		clearTimeout(timeout);
		elem.removeClass(className);
	};
}

$.fn.extend({
	enter: function(element, options, complete) {
		options = options || {};

		var enter = transition('enter', options, complete);

		return this.queue(function() {
			$(element)[options.method || 'append'](this);

			$(this).removeClass('hidden');

			if (options.animateHeight)
				$(this).css('height', this.scrollHeight);

			enter.start.apply(this, arguments);
		}).queue(enter.finish);
	},

	leave: function(options, complete) {

		var leave = transition('leave', options, complete || function() {
			// remove element when transition ends
			$(this).remove();
		});

		this.finish();

		if (options && options.animateHeight && !this.hasClass('animate')) {
			this.queue(function(next, hooks) {
				$(this).css('height', this.scrollHeight);

				this.offsetHeight;

				var timeout = setTimeout(next);

				hooks.stop = function() {
					clearTimeout(timeout);
				};
			});
		}
		
		return this.queue(leave.start).queue(leave.finish);
	}
});
