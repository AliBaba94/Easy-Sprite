import arg from 'arg'
import inquirer from 'inquirer'
import { PathPrompt } from 'inquirer-path';
import svgSprite from '../src/index';
import {name,version,description} from '../package';

function parsArguments(rawArgs){
	const args=arg({
		'--version':Boolean,
		'--help':Boolean,
		'--add': Boolean,
		'--get': Boolean,
		'--remove': Boolean,
		'-v':'--version',
		'-h':'--help',
		'-a':'--add',
		'-g':'--get',
		'-r':'--remove',
	},{argv:rawArgs.slice(2)});
	return{
		version:args['--version'] || false,
		help:args['--help'] || false,
		add:args['--add'] || false,
		get:args['--get'] || false,
		remove:args['--remove'] || false
	}
}

async function getParams(options){
	const qs={
		path:{
			type:'path',
			name:'path',
			message:'Please provide a directory to your sprite sheet',
			default:options.path || options.src || process.cwd()
		},
		name:{
			type:'input',
			name:'name',
			message:'Please provide an name for the sprite sheet (will be created if non-existent)',
			default:options.name || 'icons.svg'
		},
		src:{
			type:'path',
			name:'src',
			message:'Please provide a location to your SVG file or your SVG directory',
			default:options.path || options.src || process.cwd()
		},
		id:{
			type:'input',
			name:'id',
			message:'Please provide an icon ID to be removed',
			default:options.id
		},
	};
	const questions=[];
	if(options.add)
		questions.push(qs.path,qs.name,qs.src);
	else if(options.get)
		questions.push(qs.path,qs.name);
	else if(options.remove)
		questions.push(qs.path,qs.name,qs.id);
	else{
		console.log('Please specify a function to call');
		process.exit(-1);
	}
	inquirer.registerPrompt('path', PathPrompt);
	const answers=await inquirer.prompt(questions);
	return {params:answers,options:{...options,...answers}}
}

exports.cli=async (args)=>{
	let options=parsArguments(args);
	if(options.version){
		console.log(`${name}@${version}`);
		console.log(description);
	}
	else if(options.help){
		const opts=[{
				command:'--version | -v',
				description:'Display the version'
			},{
				command:'--help | -h',
				description:'Display help'
			}
		];
		const commands=[
			{
				command:'--add | -a',
				description:'Add a single .svg or a directory of SVGs to the specified sprite sheet (non-existent sprite sheets will be created)'
			}, {
				command:'--get | -g',
				description:'Get all the icon IDs from the provided sprite sheet.'
			},
			{
				command:'--remove | -r',
				description:'Remove the specified icon ID from the provided sprite sheet.'
			}
		];
		console.log('Usage:');
		console.log('\t','Type a command to call a functions on the sprite sheet.\n\tYou will be asked to provide the necessary parameters like the path to the sprite sheet, the path to the icon(s) or the icon ID');
		console.log('Options:');
		opts.forEach((o,i)=>{
			console.log('\t',`${o.command}: ${o.description}`);
		});

		console.log('Commands:');
		commands.forEach((h,i)=>{
			console.log('\t',`${h.command}: ${h.description}`);
		});
	}
	else {
		const executables=[];
		for(const key of Object.keys(options)) {
			if (options[key]){
				const params=await getParams(options);
				options=params.options;
				executables.push({method:key,...params.params});
				console.log('------------------');
				delete options[key];
			}
			else delete options[key];
		}
		for(const exe of executables){
			switch (exe.method) {
				case 'get':
					console.log(await svgSprite.get(exe.path, exe.name)); break;
				case 'remove':
					console.log(await svgSprite.remove(exe.path, exe.name, exe.id));
					break;
				default:
					console.log(await svgSprite.add(exe.path, exe.name, exe.src));
			}
		}
	}
};
