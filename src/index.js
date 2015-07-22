///<reference path='../lib/def.d.ts' />

requirejs.config({
	baseUrl: './',
	waitSeconds: 15,
	map: {},
	paths: {
		'ace/ace': 'lib/ace/ace',
		'knockout': 'lib/knockout/knockout',
		'beautify': 'lib/js-beautify/js-beautify'
	},
	shim: {
	}
});

requirejs([
	'app'
], function (app) {
	new app();
});
