
	var editor = ace.edit("ts-editor");
    editor.setTheme("ace/theme/chrome");
	editor.getSession().setUseWorker(false);
    editor.getSession().setMode("ace/mode/typescript");
	
    var output = ace.edit("js-output");
    output.setTheme("ace/theme/chrome");
	output.getSession().setUseWorker(false);
    output.getSession().setMode("ace/mode/javascript");