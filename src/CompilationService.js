/// <reference path="lib/def.d.ts" />
define(["require", "exports", './shim', './lib/typescript/lib-include'], function (require, exports, shim, libdts) {
    var CompilationService = (function () {
        function CompilationService() {
            this.output = new shim.FileShim();
            this.error = new shim.FileShim();
            this.settings = new shim.IOShim();
            this._host = new TSLanguageServiceHost({
                target: 1 /* ES5 */
            });
            this._service = ts.createLanguageService(this._host);
        }
        CompilationService.prototype.compile = function (contents) {
            this._host.updateSource(contents);
            var output = '';
            var errors = [].concat(this._service.getSemanticDiagnostics('file.ts'), this._service.getSyntacticDiagnostics('file.ts'));
            var outFile = this._service.getEmitOutput('file.ts').outputFiles.filter(function (o) { return o.name == 'file.js'; });
            if (outFile.length != 0) {
                output = outFile[0].text;
            }
            return {
                errors: errors,
                output: output
            };
        };
        return CompilationService;
    })();
    var TSLanguageServiceHost = (function () {
        function TSLanguageServiceHost(_compilerOptions) {
            this._compilerOptions = _compilerOptions;
            this._version = 0;
            this._source = '';
        }
        TSLanguageServiceHost.prototype.updateSource = function (source) {
            this._source = source;
            this._version++;
        };
        TSLanguageServiceHost.prototype.getCompilationSettings = function () {
            return this._compilerOptions;
        };
        TSLanguageServiceHost.prototype.getScriptFileNames = function () {
            return ['lib.d.ts', 'file.ts'];
        };
        TSLanguageServiceHost.prototype.getScriptVersion = function (fileName) {
            if (fileName == 'file.ts') {
                return this._version.toString();
            }
            return '0';
        };
        TSLanguageServiceHost.prototype.getScriptSnapshot = function (fileName) {
            if (fileName == 'lib.d.ts') {
                return ts.ScriptSnapshot.fromString(libdts);
            }
            if (fileName == 'file.ts') {
                return ts.ScriptSnapshot.fromString(this._source);
            }
        };
        TSLanguageServiceHost.prototype.getCurrentDirectory = function () {
            return "";
        };
        TSLanguageServiceHost.prototype.getDefaultLibFileName = function (options) {
            return "lib.d.ts";
        };
        return TSLanguageServiceHost;
    })();
    return CompilationService;
});
