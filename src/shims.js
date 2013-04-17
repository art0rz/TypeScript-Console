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
var IOShim = (function () {
    function IOShim() { }
    IOShim.prototype.createFile = function (fileName, useUTF8) {
        return new FileShim();
    };
    return IOShim;
})();
//@ sourceMappingURL=shims.js.map
