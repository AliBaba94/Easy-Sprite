[view on npm](https://www.npmjs.com/package/@ads-medienmanufaktur/easy-sprite)
# Easy Sprite by ADS Medienmanufaktur
#### Merge your SVG files or raw SVG code into one concise and minimal sprite sheet and build your own SVG library :)

---
## Overview
This package allows you to edit a sprite sheet without even opening it... All right from within your code!
You only have to provide a sprite sheet to use. If the sprite does not exist it will be created.

## Notes on generated sprite sheet
All SVG code (including the code extracted from SVG files) will be optimized using [SVGO](https://github.com/svg/svgo).
By default all Fills are remove from to allow styling the icon with css. This results in unicolor icons (if the individual paths are not styled separately from the main SVG element.)

## Usage in a project
Following soon

# API Reference
    Simplify SVG  sprite handling

**Example**  
```jsconst svgSprite = require('easy-sprite');```

* [easy-sprite](#module_easy-sprite)
    * _static_
        * [.add(sprite, svgSource, isCode)](#module_easy-sprite.add) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.get(sprite)](#module_easy-sprite.get) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
        * [.remove(sprite, id)](#module_easy-sprite.remove) ⇒ <code>Promise.&lt;String&gt;</code>
    * _inner_
        * [~makeSVG(ids, file, isCode)](#module_easy-sprite..makeSVG) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [~objectifySvg(file, isCode, optimize)](#module_easy-sprite..objectifySvg) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [~nameToID(name)](#module_easy-sprite..nameToID) ⇒ <code>string</code>

<a name="module_easy-sprite.add"></a>

### svgSprite.add(sprite, svgSource, isCode) ⇒ <code>Promise.&lt;String&gt;</code>
Adds the given SVG(s) (either files or codes) to a provided sprite sheet. If the sprite sheet does not exist, it will be created. The path to the sprite sheet will be returned

**Kind**: static method of [<code>easy-sprite</code>](#module_easy-sprite)  

| Param | Type | Description |
| --- | --- | --- |
| sprite | <code>String</code> | path to the sprite sheet |
| svgSource | <code>String</code> | the source of the SVG as a path string. This can either point to a single .svg file or a directory of SVG files |
| isCode | <code>Boolean</code> | a boolean which has to be provided when the SVG source is raw SVG code |

**Example**  
```jsconst svgSprite = require('easy-sprite')const msg=await svgSprite.add(PATH.join(path,to,sprite), PATH.join(path,to,files),false);console.log(msg);```
<a name="module_easy-sprite.get"></a>

### svgSprite.get(sprite) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Extracts all symbols from the SVG object {@see objectifySvg} and returns a map of their id attribute

**Kind**: static method of [<code>easy-sprite</code>](#module_easy-sprite)  

| Param | Type | Description |
| --- | --- | --- |
| sprite | <code>String</code> | path to the sprite sheet |

**Example**  
```jsconst svgSprite = require('easy-sprite')const msg=await svgSprite.get(PATH.join(path,to,sprite));console.log(msg);```
<a name="module_easy-sprite.remove"></a>

### svgSprite.remove(sprite, id) ⇒ <code>Promise.&lt;String&gt;</code>
Deletes a specific ID from the given sprite sheet

**Kind**: static method of [<code>easy-sprite</code>](#module_easy-sprite)  

| Param | Type | Description |
| --- | --- | --- |
| sprite | <code>String</code> | the path to the sprite file |
| id | <code>String</code> | the id to be removed |

**Example**  
```jsconst svgSprite = require('easy-sprite')const msg=await svgSprite.remove(PATH.join(path,to,sprite),iconId);console.log(msg);```
<a name="module_easy-sprite..makeSVG"></a>

### easy-sprite~makeSVG(ids, file, isCode) ⇒ <code>Promise.&lt;Object&gt;</code>
Generates an object representation of the SVG sprite sheet and returns it. {@see objectifySvg}

**Kind**: inner method of [<code>easy-sprite</code>](#module_easy-sprite)  

| Param | Type | Description |
| --- | --- | --- |
| ids | <code>Array.&lt;String&gt;</code> | an array of existing IDs in the sprite {@see get} |
| file | <code>String</code> | the path to an SVG source |
| isCode | <code>Boolean</code> | a boolean indicating whether the SVG source is raw svg code or contained in a file |

<a name="module_easy-sprite..objectifySvg"></a>

### easy-sprite~objectifySvg(file, isCode, optimize) ⇒ <code>Promise.&lt;Object&gt;</code>
Parses an SVG string (either from file or from raw SVG code) and returns the SVG as an object to {@see makeSVG}. Module used for SVG parsing: [https://www.npmjs.com/package/svgson](https://www.npmjs.com/package/svgson)

**Kind**: inner method of [<code>easy-sprite</code>](#module_easy-sprite)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>String</code> | the path to the SVG file or raw SVG code |
| isCode | <code>Boolean</code> | indicates whether the file is raw SVG code or not |
| optimize | <code>Boolean</code> | whether to optimize the SVG data. Needed because symbol elements are stripped when parsing whole sprite sheet. |

<a name="module_easy-sprite..nameToID"></a>

### easy-sprite~nameToID(name) ⇒ <code>string</code>
Used to generate symbol IDs. IDs are derived from the lowercase filenames, which are hyphenated. E.g: Add User becomes add-user

**Kind**: inner method of [<code>easy-sprite</code>](#module_easy-sprite)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 


* * *

&copy; 2020 ADS Medienmanufaktur &lt;info@ads-medienmanufaktur.de&gt;.

Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).

Easy Sprite is licensed under the [MIT license](https://github.com/acvm007/Easy-Sprite/blob/master/LICENSE.md).
