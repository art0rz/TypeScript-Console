/// <reference path="../lib/def.d.ts" />
define(["require", "exports", './CompilationService', './HistoryProvider', './SettingsController', 'beautify', 'knockout'], function (require, exports, CompilationService, HistoryProvider, SettingsController, beautify, ko) {
    var TypeScriptConsole = (function () {
        function TypeScriptConsole() {
            var _this = this;
            this.typeScriptErrors = ko.observableArray();
            this._settingsController = new SettingsController(function () { return _this.handleSettingsChange(); });
            this._historyProvider = new HistoryProvider();
            this._compilationService = new CompilationService();
            this.initializeEditors();
            ko.applyBindings(this, document.getElementById('ko_root'));
            ko.applyBindings(this._settingsController, document.getElementById('settings_root'));
        }
        TypeScriptConsole.prototype.handleErrorClick = function (err) {
            var pos = err.file.getLineAndCharacterOfPosition(err.start);
            this._editor.focus();
            this._editor.moveCursorTo(pos.line, pos.character);
        };
        TypeScriptConsole.prototype.initializeEditors = function () {
            var _this = this;
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
            this._editor.getSession().on("change", function (e) { return _this.handleOnChange(); });
            this._editor.commands.addCommand({
                name: "compileIt",
                exec: function () { return _this.executeConsole(); },
                bindKey: "Ctrl-Return|Command-Return|Shift-Return"
            });
            this._editor.commands.addCommand({
                name: "next",
                exec: function () { return _this.prevHistory(); },
                bindKey: "Ctrl-Up|Command-Up|Shift-Up"
            });
            this._editor.commands.addCommand({
                name: "prev",
                exec: function () { return _this.nextHistory(); },
                bindKey: "Ctrl-Down|Command-Down|Shift-Down"
            });
        };
        TypeScriptConsole.prototype.executeConsole = function () {
            this._historyProvider.push(this._editor.getValue());
            chrome.devtools.inspectedWindow.eval(this._output.getValue(), function (result, isException) {
            });
        };
        TypeScriptConsole.prototype.prevHistory = function () {
            var data = this._historyProvider.previous();
            if (data != null) {
                this._editor.setValue(data);
            }
        };
        TypeScriptConsole.prototype.nextHistory = function () {
            var data = this._historyProvider.next();
            this._editor.setValue(data);
        };
        TypeScriptConsole.prototype.handleSettingsChange = function () {
            this.handleOnChange();
        };
        TypeScriptConsole.prototype.handleOnChange = function () {
            var ts = this._editor.getValue();
            if (ts == void 0) {
                return;
            }
            var out = this._compilationService.compile(ts, this._settingsController.getCompilerOptions());
            if (out.errors.length > 0) {
                this.typeScriptErrors(out.errors);
            }
            else {
                this.typeScriptErrors(void 0);
            }
            this._output.setValue(beautify.js_beautify(out.output));
            this._output.selection.clearSelection();
        };
        TypeScriptConsole.prototype.getErrLogString = function (err) {
            return this.getErrCategoryString(err.category) + "(" + err.start + ":" + err.length + ") TS" + err.code + ": " + ts.flattenDiagnosticMessageText(err.messageText, '\n');
        };
        TypeScriptConsole.prototype.getErrLogFileString = function (err) {
            return err.start + ":" + err.length;
        };
        TypeScriptConsole.prototype.getErrCategoryString = function (category) {
            switch (category) {
                case ts.DiagnosticCategory.Error:
                    {
                        return 'Error';
                    }
                case ts.DiagnosticCategory.Message:
                    {
                        return 'Message';
                    }
                case ts.DiagnosticCategory.Warning:
                    {
                        return 'Warning';
                    }
            }
        };
        return TypeScriptConsole;
    })();
    return TypeScriptConsole;
});
