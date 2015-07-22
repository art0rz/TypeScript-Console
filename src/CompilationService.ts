/// <reference path="lib/def.d.ts" />

import shim = require('./shim');
import libdts = require('./lib/typescript/lib-include');

class CompilationService
{
	output:shim.FileShim;
	settings:shim.IOShim;
	error:shim.FileShim;

	constructor()
	{
		this.output = new shim.FileShim();
		this.error = new shim.FileShim();
		this.settings = new shim.IOShim();
	}

	public compile(contents:string)
	{
		var compilerOptions:ts.CompilerOptions = {
			target: ts.ScriptTarget.ES5
		};

		// Create a compilerHost object to allow the compiler to read and write files
		var compilerHost = new TSCompilerHost(contents);

		// Create a program from inputs
		var program = ts.createProgram(["file.ts"], compilerOptions, <ts.CompilerHost> compilerHost);

		if(
			program.getDeclarationDiagnostics().length == 0 &&
			program.getGlobalDiagnostics().length == 0 &&
			program.getSemanticDiagnostics().length == 0 &&
			program.getSyntacticDiagnostics().length == 0
		)
		{
			program.emit();
		}

		return compilerHost.getOutput();
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