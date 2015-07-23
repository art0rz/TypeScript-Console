/// <reference path="../lib/def.d.ts" />

import ko = require('knockout');

enum InputType {
	SELECT,
	TOGGLE
}

interface IConfigurationInput<T>
{
	configurationKey:string;
	label:string;
	type:InputType;
	list?:KnockoutObservableArray<{label:string;value:T;}>;
	value:KnockoutObservable<T>;
}

class SettingsController
{
	public InputType = InputType;

	private _compilerOptions:Array<IConfigurationInput<any>> = [
		{
			configurationKey: 'target',
			label: 'ECMAScript target',
			type: InputType.SELECT,
			list: ko.observableArray([
				{label: 'ES3', value: ts.ScriptTarget.ES3},
				{label: 'ES5', value: ts.ScriptTarget.ES5},
				{label: 'ES6', value: ts.ScriptTarget.ES6},
				{label: 'Latest', value: ts.ScriptTarget.Latest},
			]),
			value: ko.observable<ts.ScriptTarget>(ts.ScriptTarget.ES5)
		},
		{
			configurationKey: 'module',
			label: 'Module',
			type: InputType.SELECT,
			list: ko.observableArray([
				{label: 'None', value: ts.ModuleKind.None},
				{label: 'AMD', value: ts.ModuleKind.AMD},
				{label: 'CommonJS', value: ts.ModuleKind.CommonJS},
				{label: 'System', value: ts.ModuleKind.System},
				{label: 'UMD', value: ts.ModuleKind.UMD},
			]),
			value: ko.observable<ts.ModuleKind>(ts.ModuleKind.AMD)
		},
		{
			configurationKey: 'experimentalDecorators',
			type: InputType.TOGGLE,
			label: 'Enable decorators (experimental)',
			value: ko.observable<boolean>(false)
		}
	];

	constructor(private _onChange:() => void)
	{
		this._compilerOptions.forEach((opt) => opt.value.subscribe(() => this._onChange()));
	}

	public getCompilerOptions():ts.CompilerOptions
	{
		var config:ts.CompilerOptions = {};
		this._compilerOptions.forEach((c) => config[c.configurationKey] = c.value());

		return config;
	}
}

export = SettingsController;