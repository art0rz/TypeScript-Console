define(["require", "exports"], function (require, exports) {
    var HistoryProvider = (function () {
        function HistoryProvider() {
            this.historyStack = [];
            this.currentIndex = 0;
        }
        HistoryProvider.prototype.push = function (data) {
            this.historyStack[this.currentIndex] = data;
            this.currentIndex += 1;
        };
        HistoryProvider.prototype.next = function () {
            if (this.currentIndex < this.historyStack.length && this.historyStack.length > 0) {
                this.currentIndex += 1;
                return this.historyStack[this.currentIndex];
            }
            return null;
        };
        HistoryProvider.prototype.previous = function () {
            if (this.currentIndex > 0) {
                this.currentIndex -= 1;
                return this.historyStack[this.currentIndex];
            }
            return null;
        };
        return HistoryProvider;
    })();
    return HistoryProvider;
});
