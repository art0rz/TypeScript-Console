///<reference path='../lib/def.d.ts' />

requirejs.config({
	baseUrl: './',
	waitSeconds: 15,
	map: {},
	paths: {
		'knockout': 'lib/knockout/knockout',
		'beautify': 'lib/js-beautify/js-beautify'
	},
	shim: {
	}
});

requirejs([
	'app/app',
    'knockout'
], function (app, ko) {
	ko.bindingHandlers.allowBindings = {
		isBound: false,
		init: function(element, valueAccessor) {
			// Let bindings proceed as normal *only if* my value is false
			var shouldAllowBindings = ko.utils.unwrapObservable(valueAccessor());

			this.isBound = shouldAllowBindings;

			return { controlsDescendantBindings: !shouldAllowBindings };
		},
		update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var shouldAllowBindings = ko.utils.unwrapObservable(valueAccessor());

			if (shouldAllowBindings && !this.isBound)
			{
				this.isBound = true;
				ko['applyBindingsToDescendants'](bindingContext, element);
			}
		}
	};
	ko.virtualElements.allowedBindings['allowBindings'] = true;

	new app();
});
