# textarea-editor

Simple markdown editor for textareas, without a UI. Inspired by Github's comment editor.

[![npm version](http://img.shields.io/npm/v/textarea-editor.svg?style=flat)](https://npmjs.org/package/textarea-editor)
[![Build Status](http://img.shields.io/travis/eivindfjeldstad/textarea-editor.svg?style=flat)](https://travis-ci.org/eivindfjeldstad/textarea-editor)

## Install

```
$ npm i textarea-editor
```

## Usage

```js
const textarea = document.querySelector('textarea');
const editor = new TextareaEditor(editor);

editor.insert('Hello world!');
editor.range([0, 5]);
editor.format('bold');
assert(textarea.value == '**Hello** world!');

editor.unformat('bold');
editor.format('italic');
assert(textarea.value == '_Hello_ world!');
```

For an example with a UI, see the `example` folder.

All default commands are exposed via `TextareaEditor.commands`, and can easily be modified to fit your application (e.g. adding a UI for browsing images).

You can also execute custom commands directly:

```js
editor.format({ prefix: '#{', suffix: '}' });
assert(textarea.value == '#{Hello world!}');
```

For example commands, check out the source code.

## License

MIT
