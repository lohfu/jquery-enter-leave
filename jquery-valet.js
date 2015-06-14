/* Animate views */

var transitionend = 'transitionend oTransitionEnd webkitTransitionEnd';

$(document).on(transitionend, '.animate', function() {
	$(this).dequeue();
});

function transition($el) {
	// check if transition duration > 0, otherwise finish animation
	parseFloat($el.css('transition-duration')) || $el.dequeue();
	// TODO set timeout or similar to prevent broken transitions from dequeuing
}

function enter() {
	$(this).addClass('animate enter');

	// force redraw
	this.offsetHeight;

	transition($(this).addClass('active').removeClass('leave'));
}

function done(next) {
	$(this).removeClass('animate enter active');
	next();
}

function leave() {
	$(this).addClass('animate leave');

	// force redraw
	this.offsetHeight;

	transition($(this).addClass('active').removeClass('enter'));
}

// remove element when transition ends
function remove(next) {
	$(this).remove();
	next();
}

function hide(next) {
	// TODO remove active, animate, leave
	$(this).addClass('hidden').removeClass('visible');

	next();
}

$.fn.extend({

	alternate: function(animateHeight) {
		if(this.hasClass('hidden') || this.hasClass('leave'))
			this.enter(null, null, animateHeight);
		else 
			this.leave(true);
	},

	enter: function(element, method, animateHeight) {
		if(!element) this.stop().clearQueue();

		return this.queue(function(next) {
			if(element)
				$(element)[method || 'append'](this);
			else
				$(this).removeClass('hidden').addClass('visible');

			next();
		}).queue(function(next) {
			if(animateHeight)
				$(this).css('height', this.scrollHeight);

			next();
		}).queue(enter).queue(done);
	},

	leave: function(_hide) {
		return this.stop().queue([leave, _hide ? hide : remove ]);
	}
});
