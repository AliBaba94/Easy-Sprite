const PATH=require('path');
const svgSprite=require('../src/index');
const sprite=PATH.join(__dirname,'icons.svg');

async function test() {
	try {
		console.log('---------------------\n');
		console.log('Starting test');
		console.log('---------------------\n');
		console.log(await svgSprite.add(sprite, PATH.join(__dirname,'test icons'),false));
		console.log('---------------------\n');
		console.log(await svgSprite.get(sprite));
		console.log('---------------------\n');
		console.log(await svgSprite.add(sprite, PATH.join(__dirname,'more icons','add.svg'),false));
		console.log('---------------------\n');
		console.log(await svgSprite.remove(sprite, 'user'));
		console.log('---------------------\n');
		console.log(await svgSprite.get(sprite));
		console.log('---------------------\n');
		console.log('Test finished');
	}catch (e) {throw e}
}

test();
