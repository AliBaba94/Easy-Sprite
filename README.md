[view on npm](https://www.npmjs.com/package/@ads-medienmanufaktur/easy-sprite)
# Easy Sprite by ADS Medienmanufaktur
#### Merge your SVG files or raw SVG code into one concise and minimal sprite sheet and build your own SVG library :)

---
## Overview
This package allows you to edit a sprite sheet without even opening it... All right from within your code!
You only have to provide a sprite sheet to use. If the sprite does not exist it will be created.

## Usage
### As a global CLI
```js
npm i -g @ads-medienmanufaktur/easy-sprite
```
From anywhere you can now use one of 2 commands:
```js
svg-sprite <command> or sprite <command>
```
The commands of the CLI respond to the exported functions of the API:
* --version,-v: Display version
* --help,-h: Display help
* --add,-a: Add SVG(s) to a sprite sheet (or initialize a new sprite sheet)
* --get,-g: Get all IDs in current sprite sheet
* --remove,-r: Remove an ID from the sprite sheet
You will be prompted to provide the parameters for the API functions in a step-by-step process.
All functions are chainable like:
```js
sprite --add --get
```
Chained commands are executed after all parameters for each command have been provided.

### As an API
To use this package in a project install and require it. Then you can call each function as you would using any other module. For more details, see the API Reference below.
If you intend to use the Easy Sprite API inside a VueJS project: don't! VueJS cannot handle importing NPM modules without them being a Vue plugin. At some point in the future, this will also be provided as a Vue plugin.
In the meantime: Use the modules API in a NodeJS Server and simply link the generated sprite sheet in he vueJS template as shown in the HTML below.

## Using the generated sprite sheet
In any HTML document create an SVG tag and inside it a USE tag. Using xlink:href attribute on the USE tag link to the external sprite sheet and require a specific icon using the ID (#) selector. Example:
```html
<svg class="icon" width="25" height="25">
    <use xlink:href="sprite#iconId"></use>
</svg>
```
## Notes on generated sprite sheet
All SVG code (including the code extracted from SVG files) will be optimized using [SVGO](https://github.com/svg/svgo).
By default all Fills are remove  to allow styling the icon with CSS. This results in unicolor icons (if the individual paths are not styled separately from the main SVG element).
To have multicolored icons, in the original SVG use a stroke to fill the shape.

# API Reference
    Simplify SVG  sprite handling

**Example**  
```jsconst svgSprite = require('easy-sprite');```

* [easy-sprite](#module_easy-sprite)
    * _static_
        * [.add(location, name, svgSource, isCode)](#module_easy-sprite.add) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.get(location, name)](#module_easy-sprite.get) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
        * [.remove(location, name, id)](#module_easy-sprite.remove) ⇒ <code>Promise.&lt;String&gt;</code>
    * _inner_
        * [~makeSVG(ids, file, isCode)](#module_easy-sprite..makeSVG) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [~objectifySvg(file, isCode, optimize)](#module_easy-sprite..objectifySvg) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [~nameToID(name)](#module_easy-sprite..nameToID) ⇒ <code>string</code>

<a name="module_easy-sprite.add"></a>

### svgSprite.add(location, name, svgSource, isCode) ⇒ <code>Promise.&lt;String&gt;</code>
Adds the given SVG(s) (either files or codes) to a provided sprite sheet. If the sprite sheet does not exist, it will be created. The path to the sprite sheet will be returned

**Kind**: static method of [<code>easy-sprite</code>](#module_easy-sprite)  

| Param | Type | Description |
| --- | --- | --- |
| location |  | The directory to save the sprite sheet in |
| name |  | The name to save the sprite sheet as (.svg will be appended if not present) |
| svgSource | <code>String</code> | The source of the SVG as a path string. This can either point to a single .svg file or a directory of SVG files |
| isCode | <code>Boolean</code> | A boolean which has to be provided when the SVG source is raw SVG code |

**Example**  
```jsconst svgSprite = require('easy-sprite')let msg;//adding SVG file(s)msg=await svgSprite.add(PATH.join(path,to,spriteDir),name,PATH.join(path,to,SVG,files),false);//adding raw SVG Codemsg=await svgSprite.add(PATH.join(path,to,sprite),code,true);console.log(msg);```
<a name="module_easy-sprite.get"></a>

### svgSprite.get(location, name) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Extracts all symbols from the SVG object {@see objectifySvg} and returns a map of their id attribute

**Kind**: static method of [<code>easy-sprite</code>](#module_easy-sprite)  

| Param | Description |
| --- | --- |
| location | The directory to save the sprite sheet in |
| name | The name to save the sprite sheet as (.svg will be appended if not present) |

**Example**  
```jsconst svgSprite = require('easy-sprite')const msg=await svgSprite.get(PATH.join(path,to,sprite));console.log(msg);```
<a name="module_easy-sprite.remove"></a>

### svgSprite.remove(location, name, id) ⇒ <code>Promise.&lt;String&gt;</code>
Deletes a specific ID from the given sprite sheet

**Kind**: static method of [<code>easy-sprite</code>](#module_easy-sprite)  

| Param | Type | Description |
| --- | --- | --- |
| location |  | The directory to save the sprite sheet in |
| name |  | The name to save the sprite sheet as (.svg will be appended if not present) |
| id | <code>String</code> | The id to be removed |

**Example**  
```jsconst svgSprite = require('easy-sprite')const msg=await svgSprite.remove(PATH.join(path,to,sprite),iconId);console.log(msg);```
<a name="module_easy-sprite..makeSVG"></a>

### easy-sprite~makeSVG(ids, file, isCode) ⇒ <code>Promise.&lt;Object&gt;</code>
Generates an object representation of the SVG sprite sheet and returns it. {@see objectifySvg}

**Kind**: inner method of [<code>easy-sprite</code>](#module_easy-sprite)  

| Param | Type | Description |
| --- | --- | --- |
| ids | <code>Array.&lt;String&gt;</code> | An array of existing IDs in the sprite {@see get} |
| file | <code>String</code> | The path to an SVG source |
| isCode | <code>Boolean</code> | A boolean indicating whether the SVG source is raw svg code or contained in a file |

<a name="module_easy-sprite..objectifySvg"></a>

### easy-sprite~objectifySvg(file, isCode, optimize) ⇒ <code>Promise.&lt;Object&gt;</code>
Parses an SVG string (either from file or from raw SVG code) and returns the SVG as an object to {@see makeSVG}. Module used for SVG parsing: [https://www.npmjs.com/package/svgson](https://www.npmjs.com/package/svgson)

**Kind**: inner method of [<code>easy-sprite</code>](#module_easy-sprite)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>String</code> | The path to the SVG file or raw SVG code |
| isCode | <code>Boolean</code> | Indicates whether the file is raw SVG code or not |
| optimize | <code>Boolean</code> | Whether to optimize the SVG data. Needed because symbol elements are stripped when parsing whole sprite sheet. |

<a name="module_easy-sprite..nameToID"></a>

### easy-sprite~nameToID(name) ⇒ <code>string</code>
Used to generate symbol IDs. IDs are derived from the lowercase filenames, which are hyphenated. E.g: Add User becomes add-user

**Kind**: inner method of [<code>easy-sprite</code>](#module_easy-sprite)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The name to convert |


* * *

&copy; 2020 ADS Medienmanufaktur &lt;info@ads-medienmanufaktur.de&gt;.

Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).

Easy Sprite is licensed under the [MIT license](https://github.com/acvm007/Easy-Sprite/blob/master/LICENSE.md).
