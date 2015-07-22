/// <reference path="lib/def.d.ts" />

import ace = require('ace/ace');
import CompilationService = require('./CompilationService');
import HistoryProvider = require('./HistoryProvider');
import beautify = require('js-beautify');

declare var chrome:any;

var historyProvider = new HistoryProvider();
var historyDebug = document.getElementById("historyIndex");

var compileTimeout:number;

var app = () =>
{
	console.log(ace);

	var output = ace.edit("js-output");
	output.setTheme("lib/ace/theme-chrome");
	output.getSession().setUseWorker(false);
	output.getSession().setMode("lib/ace/mode-javascript");
	output.setReadOnly(true);

	var editor = ace.edit("ts-editor");
	editor.setTheme("lib/ace/theme-chrome");
	editor.getSession().setUseWorker(false);
	editor.getSession().setMode("lib/ace/mode-typescript");
	editor.getSession().setUseSoftTabs(true);

	var executeConsole = () =>
	{
		historyProvider.push(editor.getValue());
		var js = compliatiionService.compile(editor.getValue());
		chrome.devtools.inspectedWindow.eval(js, function(result, isException)
		{
		});
		output.setValue("");
	};

	var nextHistory = () =>
	{
		var data = historyProvider.next();
		editor.setValue(data);

	};
	var prevHistory = () =>
	{
		var data = historyProvider.previous();
		if(data != null)
		{
			editor.setValue(data);
		}
	};

	var compileOptions = {
		name: "compileIt",
		exec: executeConsole,
		bindKey: "Ctrl-Return|Command-Return|Shift-Return"
	};

	var historyBack = {
		name: "next",
		exec: prevHistory,
		bindKey: "Ctrl-Up|Command-Up|Shift-Up"
	};

	var historyForward = {
		name: "prev",
		exec: nextHistory,
		bindKey: "Ctrl-Down|Command-Down|Shift-Down"
	};


	editor.commands.addCommand(compileOptions);
	editor.commands.addCommand(historyBack);
	editor.commands.addCommand(historyForward);

	var compliatiionService = new CompilationService();

	editor.getSession().on("change", (e) =>
	{
		clearTimeout(compileTimeout);
		compileTimeout = setTimeout(() =>
		{
			var ts = editor.getValue();

			if(ts == void 0)
			{
				return;
			}

			var js = compliatiionService.compile(ts);
			output.setValue(js);
			output.selection.clearSelection();
		}, 1000);
	});
}

export = app;