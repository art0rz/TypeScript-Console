/// <reference path="../lib/def.d.ts" />
define(["require", "exports", 'knockout'], function (require, exports, ko) {
    var InputType;
    (function (InputType) {
        InputType[InputType["SELECT"] = 0] = "SELECT";
        InputType[InputType["TOGGLE"] = 1] = "TOGGLE";
    })(InputType || (InputType = {}));
    var SettingsController = (function () {
        function SettingsController(_onChange) {
            var _this = this;
            this._onChange = _onChange;
            this.InputType = InputType;
            this._compilerOptions = [
                {
                    configurationKey: 'target',
                    label: 'ECMAScript target',
                    type: InputType.SELECT,
                    list: ko.observableArray([
                        { label: 'ES3', value: 0 /* ES3 */ },
                        { label: 'ES5', value: 1 /* ES5 */ },
                        { label: 'ES6', value: 2 /* ES6 */ },
                        { label: 'Latest', value: 2 /* Latest */ },
                    ]),
                    value: ko.observable(1 /* ES5 */)
                },
                {
                    configurationKey: 'module',
                    label: 'Module',
                    type: InputType.SELECT,
                    list: ko.observableArray([
                        { label: 'None', value: 0 /* None */ },
                        { label: 'AMD', value: 2 /* AMD */ },
                        { label: 'CommonJS', value: 1 /* CommonJS */ },
                        { label: 'System', value: 4 /* System */ },
                        { label: 'UMD', value: 3 /* UMD */ },
                    ]),
                    value: ko.observable(2 /* AMD */)
                },
                {
                    configurationKey: 'experimentalDecorators',
                    type: InputType.TOGGLE,
                    label: 'Enable decorators (experimental)',
                    value: ko.observable(false)
                }
            ];
            chrome.storage.sync.get('compilerOptions', function (result) {
                if (result == void 0 || result.compilerOptions == void 0) {
                    return;
                }
                Object.keys(result.compilerOptions).forEach(function (key) {
                    _this._compilerOptions.forEach(function (opt) {
                        if (opt.configurationKey == key) {
                            opt.value(result.compilerOptions[key]);
                        }
                    });
                });
            });
            this._compilerOptions.forEach(function (opt) { return opt.value.subscribe(function () {
                chrome.storage.sync.set({ compilerOptions: _this.getCompilerOptions() }, function () {
                    _this._onChange();
                });
            }); });
        }
        SettingsController.prototype.getCompilerOptions = function () {
            var config = {};
            this._compilerOptions.forEach(function (c) { return config[c.configurationKey] = c.value(); });
            return config;
        };
        return SettingsController;
    })();
    return SettingsController;
});
