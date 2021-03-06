# textarea-editor

Simple markdown editor for textareas, without a UI. Inspired by Github's comment editor.

[![npm version](http://img.shields.io/npm/v/textarea-editor.svg?style=flat-square)](https://npmjs.org/package/textarea-editor)
[![Build Status](http://img.shields.io/travis/eivindfjeldstad/textarea-editor.svg?style=flat-square)](https://travis-ci.org/eivindfjeldstad/textarea-editor)
[![Codecov](https://img.shields.io/codecov/c/github/eivindfjeldstad/validate.svg?style=flat-square)](https://codecov.io/gh/eivindfjeldstad/textarea-editor)

## Usage

```js
import TextareaEditor from 'textarea-editor';
const textarea = document.querySelector('textarea');
const editor = new TextareaEditor(textarea);

editor.insert('Hello world!');
editor.range([0, 5]);
editor.format('bold');
assert(textarea.value == '**Hello** world!');

editor.unformat('bold');
editor.format('italic');
assert(textarea.value == '_Hello_ world!');
```

For an example with a UI, see the `example` folder or run `yarn start`.

All default formats are exposed, and can easily be modified or extended.

### Custom formats

A format should be an object with the following properties:

-   `block` - (Optional) A boolean indicating whether or not this is a block, and should be newline separated from the rest of the text (e.g. code block).
-   `multiline` - (Optional) A boolean indicating whether or not this is a multiline format (e.g. ordered list).
-   `prefix`
    -   `value` - A string or a function that generates a value (useful for prefixes that change based on line number, such as ordered lists). The function gets called for each line in the current selection (unless `.multiline` is `false`, in which case the entire selected text is passed), and is given the line, the line number, and any additional arguments passed to `.format()`.
    -   `pattern` - A string containing a pattern that identifies the prefix when used in a regular expression (double escape special chars).
    -   `antipattern` - (Optional) A string containing a pattern that identifies prefixes that would be found by `.pattern`, but should be ignored because they are part of other prefixes (e.g `##` would match parts of `###`). This is a very ugly hack, should find a better way to solve this in the future.
-   `suffix`
    -   Same properties as `.prefix`, but gets inserted after the current selection.

#### Example

```js
textarea.value = 'Hello\nWorld';

const orderedList = {
  block: true,
  multiline: true,
  prefix: {
    value: (line, no) => `${no}. `,
    pattern: '[0-9]+\\. '
  }
};

editor.range([0, textarea.value.length])
editor.format(orderedList);
assert(textarea.value == '1. Hello\n2. World');
```

Simple formats can be defined by giving `.prefix` and `.suffix` a string value.

```js
textarea.value = 'Hello World';
editor.range([0, textarea.value.length]);
editor.format({ prefix: '#{', suffix: '}' });
assert(textarea.value == '#{Hello World}');
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [TextareaEditor](#textareaeditor)
    -   [range](#range)
    -   [insert](#insert)
    -   [focus](#focus)
    -   [toggle](#toggle)
    -   [format](#format)
    -   [unformat](#unformat)
    -   [hasFormat](#hasformat)
-   [Formats](#formats)
    -   [bold](#bold)
    -   [italic](#italic)
    -   [strikethrough](#strikethrough)
    -   [link](#link)
    -   [image](#image)
    -   [header1](#header1)
    -   [header2](#header2)
    -   [header3](#header3)
    -   [header4](#header4)
    -   [header5](#header5)
    -   [header6](#header6)
    -   [code](#code)
    -   [orderedList](#orderedlist)
    -   [unorderedList](#unorderedlist)
    -   [taskList](#tasklist)
    -   [blockquote](#blockquote)

### TextareaEditor

TextareaEditor class.

**Parameters**

-   `el` **[HTMLElement](https://developer.mozilla.org/docs/Web/HTML/Element)** the textarea element to wrap around

#### range

Set or get selection range.

**Parameters**

-   `range` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)?**

Returns **([Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) \| [TextareaEditor](#textareaeditor))**

#### insert

Insert given text at the current cursor position.

**Parameters**

-   `text` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** text to insert

Returns **[TextareaEditor](#textareaeditor)**

#### focus

Set foucs on the TextareaEditor's element.

Returns **[TextareaEditor](#textareaeditor)**

#### toggle

Toggle given `format` on current selection.
Any additional arguments are passed on to `.format()`.

**Parameters**

-   `format` **([String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))** name of format or an object
-   `args` **...any**

Returns **[TextareaEditor](#textareaeditor)**

#### format

Format current selcetion with given `format`.

**Parameters**

-   `name` **([String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))** name of format or an object
-   `args` **...any**

Returns **[TextareaEditor](#textareaeditor)**

#### unformat

Remove given `format` from current selection.

**Parameters**

-   `name` **([String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))** name of format or an object

Returns **[TextareaEditor](#textareaeditor)**

#### hasFormat

Check if current seletion has given format.

**Parameters**

-   `name` **([String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))** name of format or an object

Returns **[Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)**

### Formats

Default formats.

#### bold

Bold text.

**Examples**

```javascript
editor.format('bold');
assert(textarea.value == '**Hello World**')
```

#### italic

Italic text.

**Examples**

```javascript
editor.format('italic');
assert(textarea.value == '_Hello World_')
```

#### strikethrough

Strikethrough text.

**Examples**

```javascript
editor.format('strikethrough');
assert(textarea.value == '~~Hello World~~')
```

#### link

Insert link.

**Examples**

```javascript
editor.format('link', '/example');
assert(textarea.value == '[Hello World](/example)')
```

#### image

Insert image.

**Examples**

```javascript
editor.format('image', '/example.png');
assert(textarea.value == '![Hello World](/example.png)')
```

#### header1

Header 1.

**Examples**

```javascript
editor.format('header1');
assert(textarea.value == '# Hello World')
```

#### header2

Header 2.

**Examples**

```javascript
editor.format('header2');
assert(textarea.value == '## Hello World')
```

#### header3

Header 3.

**Examples**

```javascript
editor.format('header3');
assert(textarea.value == '### Hello World')
```

#### header4

Header 4.

**Examples**

```javascript
editor.format('header4');
assert(textarea.value == '#### Hello World')
```

#### header5

Header 5.

**Examples**

```javascript
editor.format('header5');
assert(textarea.value == '##### Hello World')
```

#### header6

Header 6.

**Examples**

```javascript
editor.format('header6');
assert(textarea.value == '###### Hello World')
```

#### code

Insert code block.

**Examples**

````javascript
editor.format('code');
assert(textarea.value == '```\nHello World\n```')
````

#### orderedList

Ordered list.

**Examples**

```javascript
editor.format('orderedList');
assert(textarea.value == '1. Hello World')
```

#### unorderedList

Unordered list.

**Examples**

```javascript
editor.format('unorderedList');
assert(textarea.value == '- Hello World')
```

#### taskList

Task list.

**Examples**

```javascript
editor.format('taskList');
assert(textarea.value == '- [ ] Hello World')
```

#### blockquote

Blockquote.

**Examples**

```javascript
editor.format('blockquote');
assert(textarea.value == '> Hello World')
```

## License

MIT
