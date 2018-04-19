import TextareaEditor from '../src/editor';

let textarea, editor;

beforeEach(() => {
  textarea = document.createElement('textarea');
  document.body.appendChild(textarea);
  editor = new TextareaEditor(textarea);
})

afterEach(() => {
  document.body.removeChild(textarea);
})

describe('TextareaEditor', () => {
  test('should have a constructor', () => {
    expect(editor).toBeInstanceOf(TextareaEditor);
  })

  describe('#range()', () => {
    describe('when given an array', () => {
      test('should set the textbox selection', () => {
        textarea.value = 'Hello World!';
        editor.range([2, 5]);
        expect(textarea.selectionStart).toBe(2);
        expect(textarea.selectionEnd).toBe(5);
      })
    })

    describe('when called without arguments', () => {
      test('should return the current range', () => {
        textarea.value = 'Hello World!';
        textarea.selectionStart = 2;
        textarea.selectionEnd = 5;
        expect(editor.range()).toEqual([2, 5])
      })
    })
  })

  describe('#insert()', () => {
    test('should insert given text into the editor', () => {
      const text = 'Hello World!'
      editor.insert(text);
      expect(textarea.value).toBe(text);
    })

    test('should insert at the current selection', () => {
      textarea.value = 'Hello World!';
      editor.range([6, 11]);
      editor.insert('Mars');
      expect(textarea.value).toBe('Hello Mars!');
    })
  })

  describe('#selection()', () => {
    test('should return the text before, inside and after the current selection', () => {
      textarea.value = 'Hello World!';
      editor.range([6, 11]);
      expect(editor.selection()).toEqual({
        before: 'Hello ',
        content: 'World',
        after: '!'
      });
    })
  })

  describe('#format()', () => {
    test('should accept a format with prefix and suffix', () => {
      textarea.value = 'Hello World!';
      editor.range([6, 11]);
      editor.format({
        prefix: { value: '**' },
        suffix: { value: '**' }
      });
      expect(textarea.value).toBe('Hello **World**!');
    })

    test('should accept a format with prefix and suffix functions', () => {
      textarea.value = 'Hello World!';
      editor.range([6, 11]);
      editor.format({
        prefix: { value: function (v, i) { return i + v }},
        suffix: { value: function (v, i) { return i }}
      });
      expect(textarea.value).toBe('Hello 0WorldWorld0!');
    })

    test('should accept shorthand prefix and suffix', () => {
      const text = 'Hello World!'
      textarea.value = text;
      editor.range([6, 11]);
      editor.format({ prefix: '**', suffix: '**' });
      expect(textarea.value).toBe('Hello **World**!');
    })

    test('should preserve selected text', () => {
      const text = 'Hello World!'
      textarea.value = text;
      editor.range([6, 11]);
      editor.format({ prefix: '**', suffix: '**' });
      expect(editor.range()).toEqual([8, 13]);
    })

    describe('when given format has `block` set to true', () => {
      describe('when there is no text before or after the current selection', () => {
        test('should not insert newlines', () => {
          const text = 'Hello World!';
          textarea.value = text;
          editor.range([0, text.length]);
          editor.format({ block: true });
          expect(textarea.value).toBe(text);
        })

        test('should preserve selected text', () => {
          const text = 'Hello World!';
          const range = [0, text.length];
          textarea.value = text;
          editor.range(range);
          editor.format({ block: true });
          expect(editor.range()).toEqual(range);
        })
      })

      describe('when there is text before the current selection', () => {
        test('should insert newlines before', () => {
          const text = 'Hello World!';
          textarea.value = text;
          editor.range([1, text.length]);
          editor.format({ block: true });
          expect(textarea.value).toBe('H\n\nello World!');
        })

        test('should not force more than two newlines in a row', () => {
          const text = 'H\nello World!';
          textarea.value = text;
          editor.range([2, text.length]);
          editor.format({ block: true });
          expect(textarea.value).toBe('H\n\nello World!');
        })

        test('should preserve selected text', () => {
          const text = 'Hello World!';
          const range = [1, text.length];
          textarea.value = text;
          editor.range(range);
          editor.format({ block: true });
          expect(editor.range()).toEqual([3, 2 + text.length]);
        })
      })

      describe('when there is text after the current selection', () => {
        test('should insert newlines after', () => {
          const text = 'Hello World!';
          textarea.value = text;
          editor.range([0, text.length - 1]);
          editor.format({ block: true });
          expect(textarea.value).toBe('Hello World\n\n!');
        })

        test('should not force more than two newlines in a row', () => {
          const text = 'Hello World\n!';
          textarea.value = text;
          editor.range([0, text.length - 2]);
          editor.format({ block: true });
          expect(textarea.value).toBe('Hello World\n\n!');
        })

        test('should preserve selected text', () => {
          const text = 'Hello World!';
          const range = [0, text.length - 1];
          textarea.value = text;
          editor.range(range);
          editor.format({ block: true });
          expect(editor.range()).toEqual([0, text.length - 1]);
        })
      })
    })

    describe('when given format has `multiline` set to true', () => {
      test('should insert prefix and suffix on each line', () => {
        const text = 'Hello\nWorld!';
        textarea.value = text;
        editor.range([0, text.length]);
        editor.format({
          multiline: true,
          prefix: { value: function (v, i) { return i + '_' }},
          suffix: { value: function (v, i) { return '_' + i }}
        });
        expect(textarea.value).toBe('0_Hello_0\n1_World!_1');
      })

      test('should preserve selected text', () => {
        const text = 'Hello\nWorld!';
        textarea.value = text;
        editor.range([0, text.length]);
        editor.format({ multiline: true, prefix: '**', suffix: '**' });
        expect(editor.range()).toEqual([0, 20]);
      })

      describe('when no text is selected', () => {
        test('should set selection between prefix and suffix', () => {
          editor.format({ multiline: true, prefix: '**', suffix: '**' });
          expect(editor.range()).toEqual([2, 2]);
        })
      })
    })
  })

  describe('#unformat()', () => {
    test('should remove prefix and suffix', () => {
      const text = '**Hello World!**';
      textarea.value = text;
      editor.range([0, text.length]);
      editor.unformat({ prefix: '**', suffix: '**' });
      expect(textarea.value).toBe('Hello World!');
    })

    test('should remove prefix and suffix just outside selection', () => {
      const text = '**Hello World!**';
      textarea.value = text;
      editor.range([2, text.length - 2]);
      editor.unformat({ prefix: '**', suffix: '**' });
      expect(textarea.value).toBe('Hello World!');
    })

    test('should preserve selected text', () => {
      const text = '**Hello World!**';
      textarea.value = text;
      editor.range([0, text.length]);
      editor.unformat({ prefix: '**', suffix: '**' });
      expect(editor.range()).toEqual([0, text.length - 4]);
    })

    test('should use prefix and suffix pattern, if given', () => {
      const text = '9Hello World!2';
      textarea.value = text;
      editor.range([0, text.length]);
      editor.unformat({
        prefix: { value: 'something dynamic', pattern: '[0-9]' },
        suffix: { value: 'something dynamic', pattern: '[0-9]' }
      });
      expect(textarea.value).toBe('Hello World!');
    })

    test('should work with multiline commands', () => {
      const text = '**Hello**\n**World!**';
      textarea.value = text;
      editor.range([0, text.length]);
      editor.unformat({ multiline: true, prefix: '**', suffix: '**' });
      expect(textarea.value).toBe('Hello\nWorld!');
      expect(editor.range()).toEqual([0, 12])
    })
  })

  describe('#hasFormat()', () => {
    test('returns `true` if current selection has given format', () => {
      const text = '**Hello World!**';
      textarea.value = text;
      editor.range([0, text.length]);
      const result = editor.hasFormat({ prefix: '**', suffix: '**' });
      expect(result).toBe(true)
    })

    test('returns `false` if current selection does not have given format', () => {
      const text = 'H**ello World**!';
      textarea.value = text;
      editor.range([0, text.length]);
      const result = editor.hasFormat({ prefix: '**', suffix: '**' });
      expect(result).toBe(false)
    })

    test('should work when prefix and suffix is just outside current selection', () => {
      const text = '**Hello World!**';
      textarea.value = text;
      editor.range([2, text.length - 2]);
      const result = editor.hasFormat({ prefix: '**', suffix: '**' });
      expect(result).toBe(true)
    })

    test('should work with multiline commands', () => {
      const text = '**Hello**\n**World!**';
      textarea.value = text;
      editor.range([0, text.length]);
      const result = editor.hasFormat({ prefix: '**', suffix: '**', multiline: true });
      expect(result).toBe(true)
    })
  })
})
