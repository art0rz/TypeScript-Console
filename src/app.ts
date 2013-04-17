/// <reference path="lib/ace.d.ts" />
/// <reference path="compliationService.ts" />

declare var chrome: any;
declare var js_beautify: any;

var editor = ace.edit("ts-editor");
editor.setTheme("ace/theme/chrome");
editor.getSession().setUseWorker(false);
editor.getSession().setMode("ace/mode/typescript");
editor.getSession().setUseSoftTabs(true);

var output = ace.edit("js-output");
output.setTheme("ace/theme/chrome");
output.getSession().setUseWorker(false);
output.getSession().setMode("ace/mode/javascript");
output.setReadOnly(true);

var executeConsole = () => {
    var js = compliatiionService.compile(editor.getValue());
    chrome.devtools.inspectedWindow.eval(js, function (result, isException) { });
    editor.setValue("");
    output.setValue("");
}

var compileOptions = {
    name: "compileIt",
    exec: executeConsole,
    bindKey: "Ctrl-Return|Command-Return|Shift-Return"
};
editor.commands.addCommand(compileOptions);

var compliatiionService = new CompliationService();

editor.getSession().on("change", e => {
    var js = compliatiionService.compile(editor.getValue());
    output.setValue(js_beautify(js,null));
});







