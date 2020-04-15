const fs=require('fs-extra');
const PATH=require('path');
const SVGO=require('svgo');
const {parse, stringify} = require('svgson');

/**
 * Simplify SVG  sprite handling
 * @module easy-sprite
 * @typicalname svgSprite
 * @example
 * ```js
 * const svgSprite = require('easy-sprite');
 * ```
 */
module.exports={
	add,
	get,
	remove
};

/**
 * Adds the given SVG(s) (either files or codes) to a provided sprite sheet. If the sprite sheet does not exist, it will be created. The path to the sprite sheet will be returned
 * @param {String} sprite - path to the sprite sheet
 * @param {String} svgSource - the source of the SVG as a path string. This can either point to a single .svg file or a directory of SVG files
 * @param {Boolean} isCode - a boolean which has to be provided when the SVG source is raw SVG code
 * @returns {Promise<String>}
 * @alias module:easy-sprite.add
 * @example
 * ```js
 * const svgSprite = require('easy-sprite')
 * let msg;
 * //adding SVG file(s)
 * msg=await svgSprite.add(PATH.join(path,to,sprite),PATH.join(path,to,SVG,files),false);
 * //adding raw SVG Code
 * msg=await svgSprite.add(PATH.join(path,to,sprite),code,true);
 * console.log(msg);
 * ```
 */
function add(sprite,svgSource,isCode){
	return new Promise(async (resolve, reject) =>{
		try{
			let spriteObj={
				name:'svg',
				type:'element',
				value:'',
				attributes:{xmlns: 'http://www.w3.org/2000/svg'}
			},report={msg:`The following IDs already exist in ${sprite}`,ids:[]};
			if(await fs.exists(sprite))
				spriteObj=await parse(fs.readFileSync(sprite,'utf8'));
			else
				spriteObj.children=[{
					name: 'defs',
					type: 'element',
					value: '',
					attributes: {},
					children:[]
				}];
			const existingIDs=await get(sprite);
			const symbols=[];
			let files;
			if(PATH.extname(svgSource) && PATH.extname(svgSource)==='.svg' || isCode)
				files=[svgSource];
			else if(!PATH.extname(svgSource))
				files=fs.readdirSync(svgSource, 'utf8').filter(file=>{return PATH.extname(file)==='.svg'}).map(file=>{return PATH.join(svgSource,file)});
			for(const file of files){
				const {symbol,definitions,duplicates}=await makeSVG(existingIDs,file,isCode);
				if(duplicates.length)
					report.ids.push(...duplicates);
				else{
					spriteObj.children[0].children.push(definitions);
					symbols.push(symbol);
				}
			}
			spriteObj.children.push(symbols);
			fs.outputFileSync(sprite,stringify(spriteObj));
			if(report.ids.length)
				return resolve(`File saved as ${sprite}. ${report.msg}: ${report.ids.join()}`);
			else
				return resolve(`File saved as ${sprite}.`);
		}catch (e) {return reject(new Error(e))}
	});
}

/**
 * Generates an object representation of the SVG sprite sheet and returns it. {@see objectifySvg}
 * @param {Array<String>} ids - an array of existing IDs in the sprite {@see get}
 * @param {String} file - the path to an SVG source
 * @param {Boolean} isCode - a boolean indicating whether the SVG source is raw svg code or contained in a file
 * @returns {Promise<Object>}
 * @inner
 */
function makeSVG(ids,file,isCode) {
	return new Promise(async(resolve, reject) =>{
		try{
			const duplicates=[];
			let symbol={},definitions={};
			const svgObj=await objectifySvg(file,isCode,true);
			const id=nameToID(PATH.basename(file, '.svg'));
			if(ids.includes(id))
				duplicates.push(id);
			else{
				const idx=svgObj.children.indexOf(svgObj.children.filter(child=>{return child.name==='defs'})[0]);
				definitions=svgObj.children.splice(idx, 1)[0].children.map(child=>{
					child.attributes.id=`${id}-${child.attributes.id}`;
					return child;
				});
				symbol={
					name:'symbol',
					type:'element',
					value:'',
					attributes:{id,viewBox:svgObj.attributes.viewBox},
					children:svgObj.children.map(child=>{
						if(child.attributes.hasOwnProperty('filter'))
							child.attributes.filter=`url(#${id}-${child.attributes.filter.match(/filter.+?(?=\))/)[0]})`;
						return child
					})
				};
			}
			return resolve({duplicates,symbol,definitions});
		}catch (e) {return reject(new Error(e))}
	});
}

/**
 * Parses an SVG string (either from file or from raw SVG code) and returns the SVG as an object to {@see makeSVG}. Module used for SVG parsing: {@link https://www.npmjs.com/package/svgson}
 * @param {String} file - the path to the SVG file or raw SVG code
 * @param {Boolean} isCode - indicates whether the file is raw SVG code or not
 * @param {Boolean} optimize - whether to optimize the SVG data. Needed because symbol elements are stripped when parsing whole sprite sheet.
 * @returns {Promise<Object>}
 * @inner
 */
function objectifySvg(file,isCode,optimize) {
	return new Promise(async(resolve, reject) =>{
		try{
			const svgo=new SVGO(require('./SVGO.config').options);
			const data=isCode ? file : await fs.readFile(file,'utf8');
			if(optimize){
				const svg=await svgo.optimize(data);
				return resolve(await parse(svg.data));
			}
			else
				return resolve(await parse(data));
		}catch (e) {return reject(new Error(e))}
	});
}

/**
 * Used to generate symbol IDs. IDs are derived from the lowercase filenames, which are hyphenated. E.g: Add User becomes add-user
 * @param {String} name
 * @returns {string}
 * @memberof module:easy-sprite
 * @inner
 */
function nameToID(name) {
	const arr=name.toLowerCase().split(' ');
	return arr.length===1 ? arr[0] : arr.join('-');
}

/**
 * Extracts all symbols from the SVG object {@see objectifySvg} and returns a map of their id attribute
 * @param {String} sprite - path to the sprite sheet
 * @returns {Promise<Array<String>>}
 * @alias module:easy-sprite.get
 * @example
 * ```js
 * const svgSprite = require('easy-sprite')
 *
 * const msg=await svgSprite.get(PATH.join(path,to,sprite));
 * console.log(msg);
 * ```
 */
function get(sprite){
	return new Promise(async (resolve, reject) =>{
		try {
			if(await fs.exists(sprite)){
				const spriteData=await objectifySvg(sprite,false,false);
				return resolve(spriteData.children
					.filter(d => {return d.name === 'symbol'})
					.map(d => {return d.attributes.id}));
			}
			else
				return resolve([]);
		}catch (e) {return reject(new Error(e))}
	});
}

/**
 * Deletes a specific ID from the given sprite sheet
 * @alias module:add-two-values.remove
 * @param {String} sprite - the path to the sprite file
 * @param {String} id - the id to be removed
 * @returns {Promise<String>}
 * @alias module:easy-sprite.remove
 * @example
 * ```js
 * const svgSprite = require('easy-sprite')
 *
 * const msg=await svgSprite.remove(PATH.join(path,to,sprite),iconId);
 * console.log(msg);
 * ```
 */
function remove(sprite,id) {
	return new Promise(async (resolve, reject) =>{
		try {
			const found=[];
			let spriteObj=await objectifySvg(sprite,false,false);
			spriteObj.children.forEach(child=>{
				if(child.attributes.id===id)
					found.push(child);
				else if(child.name==='defs'){
					found.push(child.children.filter(child => {
						return child.attributes.id.match(new RegExp(`${id}-filter.+`))
					})[0]);
				}
			});
			found.forEach(f=>{
				if(f.name==='symbol')
					spriteObj.children.splice(spriteObj.children.indexOf(f),1);
				else
					spriteObj.children[0].children.splice(spriteObj.children[0].children.indexOf(found[1]),1);
			});
			fs.outputFileSync(sprite,stringify(spriteObj));
			return resolve(`Icon "${id}" removed from ${sprite}`)
		}catch (e) {return reject(new Error(e))}
	});
}
