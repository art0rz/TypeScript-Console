/// <reference path="ace.d.ts" />
/// <reference path="typescript/typescriptServices.d.ts" />
/// <reference path="js-beautify/js-beautify.d.ts" />
/// <reference path="knockout/knockout.d.ts" />
/// <reference path="require.d.ts" />

declare module "ace/ace" {
	export = ace;
}

declare module "lib/ace/mode-typescript" {
	var exp:any;
	export = exp;
}

declare module "lib/ace/mode-javascript" {
	var exp:any;
	export = exp;
}

declare module "lib/ace/theme-chrome" {
	var exp:any;
	export = exp;
}