/// <reference path="lib/def.d.ts" />
define(["require", "exports", './shim', './lib/typescript/lib-include'], function (require, exports, shim, libdts) {
    var CompilationService = (function () {
        function CompilationService() {
            this.output = new shim.FileShim();
            this.error = new shim.FileShim();
            this.settings = new shim.IOShim();
        }
        CompilationService.prototype.compile = function (contents) {
            var compilerOptions = {
                target: 1 /* ES5 */
            };
            // Create a compilerHost object to allow the compiler to read and write files
            var compilerHost = new TSCompilerHost(contents);
            // Create a program from inputs
            var program = ts.createProgram(["file.ts"], compilerOptions, compilerHost);
            if (program.getDeclarationDiagnostics().length == 0 &&
                program.getGlobalDiagnostics().length == 0 &&
                program.getSemanticDiagnostics().length == 0 &&
                program.getSyntacticDiagnostics().length == 0) {
                program.emit();
            }
            return compilerHost.getOutput();
        };
        return CompilationService;
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
