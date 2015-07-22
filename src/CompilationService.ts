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
		return ['file.ts'];
	}

	public getScriptVersion(fileName:string):string
	{
		return this._version.toString();
	}

	public getScriptSnapshot(fileName:string):ts.IScriptSnapshot
	{
		return ts.ScriptSnapshot.fromString(this._source);
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

class TSCompilerHost implements ts.CompilerHost
{
	private output:string;

	constructor(private contents:string)
	{

	}

	public getOutput():string
	{
		return this.output;
	}

	public getSourceFile(fileName:string, languageVersion:ts.ScriptTarget, onError?:(message:string) => void):ts.SourceFile
	{
		if(fileName === "file.ts")
		{
			return ts.createSourceFile(fileName, this.contents, languageVersion);
		}

		if(fileName === "lib.d.ts")
		{
			return ts.createSourceFile(fileName, libdts, languageVersion);
		}
	}

	public getDefaultLibFileName(options:ts.CompilerOptions):string
	{
		return "lib.d.ts";
	}

	public writeFile(fileName:string, data:string, writeByteOrderMark:boolean, onError?:(message:string) => void):void
	{
		this.output = data;
	}

	public getCurrentDirectory():string
	{
		return "";
	}

	public getCanonicalFileName(fileName:string):string
	{
		return fileName;
	}

	public useCaseSensitiveFileNames():boolean
	{
		return false;
	}

	public getNewLine():string
	{
		return "\n";
	}
}

export = CompilationService;