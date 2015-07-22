/// <reference path="lib/def.d.ts" />

import CompilationService = require('./CompilationService');
import HistoryProvider = require('./HistoryProvider');
import beautify = require('beautify');
import ko = require('knockout');

declare var chrome:any;

class TypeScriptConsole
{
	private _historyProvider:HistoryProvider;
	private _compilationService:CompilationService;

	private _editor:AceAjax.Editor;
	private _output:AceAjax.Editor;

	private typeScriptErrors:KnockoutObservableArray<ts.Diagnostic> = ko.observableArray<ts.Diagnostic>();

	constructor()
	{
		this._historyProvider = new HistoryProvider();
		this._compilationService = new CompilationService();

		this.initializeEditors();

		ko.applyBindings(this, document.getElementById('ko_root'));
	}

	public handleErrorClick(err:ts.Diagnostic)
	{
		var pos = err.file.getLineAndCharacterOfPosition(err.start);
		this._editor.moveCursorTo(pos.line, pos.character);
		this._editor.focus();
	}

	private initializeEditors()
	{
		this._output = ace.edit("js-output");
		this._output.setTheme("ace/theme/chrome");
		this._output.getSession().setUseWorker(false);
		this._output.getSession().setMode("ace/mode/javascript");
		this._output.setReadOnly(true);
		this._output.$blockScrolling = Infinity;

		this._editor = ace.edit("ts-editor");
		this._editor.setTheme("ace/theme/chrome");
		this._editor.getSession().setUseWorker(false);
		this._editor.getSession().setMode("ace/mode/typescript");
		this._editor.getSession().setUseSoftTabs(true);
		this._editor.$blockScrolling = Infinity;

		this._editor.getSession().on("change", (e) => this.handleOnChange());

		this._editor.commands.addCommand({
			name: "compileIt",
			exec: () => this.executeConsole(),
			bindKey: "Ctrl-Return|Command-Return|Shift-Return"
		});
		this._editor.commands.addCommand({
			name: "next",
			exec: () => this.prevHistory(),
			bindKey: "Ctrl-Up|Command-Up|Shift-Up"
		});
		this._editor.commands.addCommand({
			name: "prev",
			exec: () => this.nextHistory(),
			bindKey: "Ctrl-Down|Command-Down|Shift-Down"
		});
	}

	private executeConsole()
	{
		this._historyProvider.push(this._editor.getValue());
		this._compilationService.compile(this._editor.getValue());

		chrome.devtools.inspectedWindow.eval(
			this._output.getValue(),
			(result, isException)  =>
			{

			}
		);
	}

	private prevHistory()
	{
		var data = this._historyProvider.previous();
		if(data != null)
		{
			this._editor.setValue(data);
		}
	}

	private nextHistory()
	{
		var data = this._historyProvider.next();
		this._editor.setValue(data);
	}

	private handleOnChange()
	{
		var ts = this._editor.getValue();

		if(ts == void 0)
		{
			return;
		}

		var out = this._compilationService.compile(ts);

		if(out.errors.length > 0)
		{
			this.typeScriptErrors(out.errors);
		}
		else
		{
			this.typeScriptErrors(void 0);
		}

		this._output.setValue(beautify.js_beautify(out.output));
		this._output.selection.clearSelection();
	}

	private getErrLogString(err:ts.Diagnostic)
	{
		return `${this.getErrCategoryString(err.category)}(${err.start}:${err.length}) TS${err.code}: ${ts.flattenDiagnosticMessageText(err.messageText, '\n')}`;
	}

	private getErrLogFileString(err:ts.Diagnostic)
	{
		return `${err.start}:${err.length}`;
	}

	private getErrCategoryString(category:ts.DiagnosticCategory)
	{
		switch(category)
		{
			case ts.DiagnosticCategory.Error:
			{
				return 'Error';
			}
			case ts.DiagnosticCategory.Message:
			{
				return 'Message'
			}
			case ts.DiagnosticCategory.Warning:
			{
				return 'Warning'
			}
		}
	}
}

export = TypeScriptConsole;