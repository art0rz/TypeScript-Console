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
            return ['file.ts'];
        };
        TSLanguageServiceHost.prototype.getScriptVersion = function (fileName) {
            return this._version.toString();
        };
        TSLanguageServiceHost.prototype.getScriptSnapshot = function (fileName) {
            return ts.ScriptSnapshot.fromString(this._source);
        };
        TSLanguageServiceHost.prototype.getCurrentDirectory = function () {
            return "";
        };
        TSLanguageServiceHost.prototype.getDefaultLibFileName = function (options) {
            return "lib.d.ts";
        };
        return TSLanguageServiceHost;
    })();
    var TSCompilerHost = (function () {
        function TSCompilerHost(contents) {
            this.contents = contents;
        }
        TSCompilerHost.prototype.getOutput = function () {
            return this.output;
        };
        TSCompilerHost.prototype.getSourceFile = function (fileName, languageVersion, onError) {
            if (fileName === "file.ts") {
                return ts.createSourceFile(fileName, this.contents, languageVersion);
            }
            if (fileName === "lib.d.ts") {
                return ts.createSourceFile(fileName, libdts, languageVersion);
            }
        };
        TSCompilerHost.prototype.getDefaultLibFileName = function (options) {
            return "lib.d.ts";
        };
        TSCompilerHost.prototype.writeFile = function (fileName, data, writeByteOrderMark, onError) {
            this.output = data;
        };
        TSCompilerHost.prototype.getCurrentDirectory = function () {
            return "";
        };
        TSCompilerHost.prototype.getCanonicalFileName = function (fileName) {
            return fileName;
        };
        TSCompilerHost.prototype.useCaseSensitiveFileNames = function () {
            return false;
        };
        TSCompilerHost.prototype.getNewLine = function () {
            return "\n";
        };
        return TSCompilerHost;
    })();
    return CompilationService;
});
