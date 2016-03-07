# jquery-enter-leave

Simplifies animating elements added or removed to the DOM. Greatly inspired by functionality in Angular's ngAnimate.

## Introduction

Exposes two functions on jQuery instances, `enter` and `leave`. `enter` should be used to animate
inserts into the DOM, and `leave` is used to animate removals.

## Install

```
npm install jquery-enter-leave
```

Simply make sure to `require('jquery-enter-leave')` to load the plugin.
If you want to load the `toggle`, `show` and `hide` methods, also `require('jquery-enter-leave/toggle')`.

## `enter` and `leave`

Sample JS:

```js
$('main > .page').leave(options);

page.enter($('main'), options, function() {
	console.log('done');
});
```

Sample SCSS:

```scss
main {
	@include clear;
	flex: 1 0 auto;
	overflow-x: hidden;//needed to fix chrome animation bug (logo seems to move);

	> .page {
		width: 100%;
		position: relative;
		left: 0;
		&.animate {
			transition: left $transition-time;
			float: left;
			margin-right: -100%;
		}
		&.enter {
			left: 100%;
			&.back {
				left: -100%;
			}
		}

		&.leave.active {
			left: -100%;
			&.back {
				left: 100%;
			}
		}
		&.enter.active, &.leave {
			left: 0;
		}
	}
}
```

## `toggle`, `show` and `hide`

The `jquery-enter-leave/toggle` module overwrites the default `toggle`, `show`
and `hide` methods. However, the custom logic is only used if
`!!options.transition === true`, otherwise control will be passed over the
original method.

```js
$('.question').on('click', function() {
	$(this).next('.answer').toggle({ transition: true });
});
```

CAUTION!: jQuery will call `this.animate` inside these methods if an object
is passed as a parameter. So passing `enter-leave` options but forgetting
to pass `transtion: true` will call jQuery's animate. IE do not do (for example)
`$el.show({ animateHeight: true })`.

### `className`

A custom class to add and remove.

### `animateHeight`

Since animating to `height: auto` with CSS is not possible,
one needs to pass the `animateHeight: true`. This will set
some inline CSS, using `$(this).css('height', this.scrollHeight);`.

 
Sample SCSS: 

```scss
&.animate {
	transition: height 0.5s;
}

&.enter:not(.active), &.leave.active {
	height: 0 !important;
}
```
