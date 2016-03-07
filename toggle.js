var toggle = $.fn.toggle,
	show = $.fn.show,
	hide = $.fn.hide;

$.fn.extend({
	toggle: function(options) {
		if(!options || !options.transition)
			return toggle.apply(this, arguments);

		if(this.hasClass('hidden') || this.hasClass('leave'))
			this.show(options);
		else 
			this.hide(options);
	},

	show: function(options) {
		if(!options || !options.transition)
			return show.apply(this, arguments);

		this.finish()
			.queue(function(next) {
				$(this).addClass('visible');

				next();
			});

		return this.enter(null, options);
	},

	hide: function(options) {
		if(!options || !options.transition)
			return hide.apply(this, arguments);

		return this.leave(options, function() {
			$(this).addClass('hidden').removeClass('visible');
		});
	}
});
