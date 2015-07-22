/// <reference path="lib/def.d.ts" />

import shim = require('./shim');
import libdts = require('./lib/typescript/lib-include');

class CompilationService
{
	output:shim.FileShim;
	settings:shim.IOShim;
	error:shim.FileShim;

	private _service:ts.LanguageService;
	private _host:TSLanguageServiceHost;

	constructor()
	{
		this.output = new shim.FileShim();
		this.error = new shim.FileShim();
		this.settings = new shim.IOShim();

		this._host = new TSLanguageServiceHost({
			target: ts.ScriptTarget.ES5
		});

		this._service = ts.createLanguageService(this._host);
	}

	public compile(contents:string):{errors:Array<ts.Diagnostic>;output:string}
	{
		this._host.updateSource(contents);
		var output = '';

		var errors = [].concat(
			this._service.getSemanticDiagnostics('file.ts'),
			this._service.getSyntacticDiagnostics('file.ts')
		);

		var outFile = this._service.getEmitOutput('file.ts').outputFiles.filter((o) => o.name == 'file.js');

		if(outFile.length != 0)
		{
			output = outFile[0].text;
		}

		return {
			errors: errors,
			output: output
		}
	}
}

class TSLanguageServiceHost implements ts.LanguageServiceHost
{
	private _version:number = 0;
	private _source:string = '';

	constructor(private _compilerOptions:ts.CompilerOptions)
	{
	}

	public updateSource(source:string)
	{
		this._source = source;
		this._version++;
	}

	public getCompilationSettings():ts.CompilerOptions
	{
		return this._compilerOptions;
	}

	public getScriptFileNames():string[]
	{
		return ['lib.d.ts', 'file.ts'];
	}

	public getScriptVersion(fileName:string):string
	{
		if (fileName == 'file.ts')
		{
			return this._version.toString();
		}

		return '0';
	}

	public getScriptSnapshot(fileName:string):ts.IScriptSnapshot
	{
		if(fileName == 'lib.d.ts')
		{
			return ts.ScriptSnapshot.fromString(libdts);
		}

		if(fileName == 'file.ts')
		{
			return ts.ScriptSnapshot.fromString(this._source);
		}
	}

	public getCurrentDirectory():string
	{
		return "";
	}

	public getDefaultLibFileName(options:ts.CompilerOptions):string
	{
		return "lib.d.ts";
	}
}

export = CompilationService;