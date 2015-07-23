define(["require", "exports"], function (require, exports) {
    var shim;
    (function (shim) {
        var FileShim = (function () {
            function FileShim() {
                this.buffer = "";
            }
            FileShim.prototype.Write = function (input) {
                this.buffer += input;
            };
            FileShim.prototype.WriteLine = function (input) {
                this.buffer += input;
            };
            FileShim.prototype.Close = function () {
            };
            return FileShim;
        })();
        shim.FileShim = FileShim;
        var IOShim = (function () {
            function IOShim() {
            }
            IOShim.prototype.createFile = function (fileName, useUTF8) {
                return new FileShim();
            };
            return IOShim;
        })();
        shim.IOShim = IOShim;
    })(shim || (shim = {}));
    return shim;
});
