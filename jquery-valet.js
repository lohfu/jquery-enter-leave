var transition;
function tEv(){
	if(!transition) {
		var t;
		var el = document.createElement('fakeelement');
		var transitions = {
			'transition':'transitionend',
			'OTransition':'oTransitionEnd',
			'MozTransition':'transitionend',
			'WebkitTransition':'webkitTransitionEnd'
		};

		for(t in transitions){
			if( el.style[t] !== undefined ){
				transition = transitions[t];
				break;
			}
		}
	}
	return transition;
}
function check($el) {
	var arr, duration = parseFloat($el.css('transition-duration').replace(/[a-zA-Z]*$/, ''));

	if(duration > 0)
		return true;

	return false;
}
$.fn.enter = function(target, method, cb) {
	// TODO implement callback
	var that = this;
	function done() {
		that.removeClass('animate enter enter-active active');
	}

	if(method instanceof Function) {
		cb = method;
		method = undefined;
	}

	$(target)[method || 'append'](this);
	this.addClass('animate enter');
	if(check(this)) {
		this.addClass('enter-active active');
		this.one(tEv(), done);
	} else {
		done();
	}
	return this;
};

$.fn.exit = function(cb) {
	// TODO implement callback
	var that = this;
	function done() {
		that.remove().removeClass('animate exit exit-active active');
	}

	this.addClass('animate exit');
	if(check(this)) {
		this.addClass('exit-active active');
		this.one(tEv(), done);
	} else {
		done();
	}
	return this;
};

$.fn.JSONify = function(returnString) {
	var o = {};
	var
		rCRLF = /\r?\n/g,
		rcheckableType = /^(?:checkbox|radio)/i;

	var elements = this.find('[name], [data-name]').each(function() {
		var name = $(this).attr('name') || $(this).data('name');

		if(rcheckableType.test($(this).attr('type')) && !this.checked) return;

		var value = this.value || this.innerHTML;

		if(!value) return;

		var path = name.split('.');
		var ref = o;
		var i = 0;

		var match;

		// TODO optimise
		// make sure object hierarchy exists
		for (i = 0; i < path.length - 1; i++) {
			match = path[i].match(/\[(\d+)\]$/);

			if(match)
				path[i] = path[i].substring(0,match.index);

			if (!ref[path[i]]) {
				if(match) {
					ref[path[i]] = [{}];
				} else {
					ref[path[i]] = {};
				}
			}

			if(match) {
				if(ref[path[i]].length <= match[1]) ref[path[i]].push({});

				ref = ref[path[i]][match[1]];
			} else
				ref = ref[path[i]];
		}

		match = path[i].match(/\[(\d+)\]$/);

		if(match)
			path[i] = path[i].substring(0,match.index);

		// TODO optimise
		if (ref[path[i]]) {
			if(match) {
				if(ref[path[i]][match[1]]) {
					if(!ref[path[i]][match[1]].push) {
						ref[path[i]][match[1]] = [ ref[path[i]][match[1]] ];
					}
					ref[path[i]][match[1]].push(this.value);
				} else {
					ref[path[i]][match[1]] = this.value;
				}
			} else {
				if (!ref[path[i]].push) {
					// if value already exists but is not an array, create array from current value
					ref[path[i]] = [ref[path[i]]];
				}
				ref[path[i]].push(this.value);
			}
		} else {
			if(match) {
				ref[path[i]] = [];
				ref[path[i]][match[1]] = this.value;
			} else {
				ref[path[i]] = this.value;
			}
		}
	});
	return returnString ? JSON.stringify(o) : o;
};
