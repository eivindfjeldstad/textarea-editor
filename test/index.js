import 'babel-polyfill';
import TextareaEditor from '..';
import {expect} from 'chai';

let textarea, editor;

beforeEach(() => {
  textarea = document.createElement('textarea');
  document.body.appendChild(textarea);
  editor = new TextareaEditor(textarea);
})

afterEach(() => {
  document.body.removeChild(textarea);
})

describe('TextareaEditor', function () {
  it('should have a constructor', () => {
    expect(editor).to.be.an.instanceof(TextareaEditor);
  })

  describe('#range()', () => {
    context('when given an array', () => {
      it('should set the textbox selection', () => {
        textarea.value = 'Hello World!';
        editor.range([2, 5]);
        expect(textarea.selectionStart).to.eq(2);
        expect(textarea.selectionEnd).to.eq(5);
      })
    })

    context('when called without arguments', () => {
      it('should return the current range', () => {
        textarea.value = 'Hello World!';
        textarea.selectionStart = 2;
        textarea.selectionEnd = 5;
        expect(editor.range()).to.eql([2, 5])
      })
    })
  })

  describe('#insert()', () => {
    it('should insert given text into the editor', () => {
      const text = 'Hello World!'
      editor.insert(text);
      expect(textarea.value).to.eq(text);
    })

    it('should insert at the current selection', () => {
      textarea.value = 'Hello World!';
      editor.range([6, 11]);
      editor.insert('Mars');
      expect(textarea.value).to.eq('Hello Mars!');
    })
  })

  describe('#selection()', () => {
    it('should return the text before, inside and after the current selection', () => {
      textarea.value = 'Hello World!';
      editor.range([6, 11]);
      expect(editor.selection()).to.eql({
        before: 'Hello ',
        content: 'World',
        after: '!'
      });
    })
  })

  describe('#format()', () => {
    it('should accept a format with prefix and suffix', () => {
      textarea.value = 'Hello World!';
      editor.range([6, 11]);
      editor.format({
        prefix: { value: '**' },
        suffix: { value: '**' }
      });
      expect(textarea.value).to.eq('Hello **World**!');
    })

    it('should accept a format with prefix and suffix functions', () => {
      textarea.value = 'Hello World!';
      editor.range([6, 11]);
      editor.format({
        prefix: { value: function (v, i) { return i + v }},
        suffix: { value: function (v, i) { return i }}
      });
      expect(textarea.value).to.eq('Hello 0WorldWorld0!');
    })

    it('should accept shorthand prefix and suffix', () => {
      const text = 'Hello World!'
      textarea.value = text;
      editor.range([6, 11]);
      editor.format({ prefix: '**', suffix: '**' });
      expect(textarea.value).to.eq('Hello **World**!');
    })

    it('should preserve selected text', () => {
      const text = 'Hello World!'
      textarea.value = text;
      editor.range([6, 11]);
      editor.format({ prefix: '**', suffix: '**' });
      expect(editor.range()).to.eql([8, 13]);
    })

    context('when given format has `block` set to true', () => {
      context('when there is no text before or after the current selection', () => {
        it('should not insert newlines', () => {
          const text = 'Hello World!';
          textarea.value = text;
          editor.range([0, text.length]);
          editor.format({ block: true });
          expect(textarea.value).to.eq(text);
        })

        it('should preserve selected text', () => {
          const text = 'Hello World!';
          const range = [0, text.length];
          textarea.value = text;
          editor.range(range);
          editor.format({ block: true });
          expect(editor.range()).to.eql(range);
        })
      })

      context('when there is text before the current selection', () => {
        it('should insert newlines before', () => {
          const text = 'Hello World!';
          textarea.value = text;
          editor.range([1, text.length]);
          editor.format({ block: true });
          expect(textarea.value).to.eq('H\n\nello World!');
        })

        it('should not force more than two newlines in a row', () => {
          const text = 'H\nello World!';
          textarea.value = text;
          editor.range([2, text.length]);
          editor.format({ block: true });
          expect(textarea.value).to.eq('H\n\nello World!');
        })

        it('should preserve selected text', () => {
          const text = 'Hello World!';
          const range = [1, text.length];
          textarea.value = text;
          editor.range(range);
          editor.format({ block: true });
          expect(editor.range()).to.eql([3, 2 + text.length]);
        })
      })

      context('when there is text after the current selection', () => {
        it('should insert newlines after', () => {
          const text = 'Hello World!';
          textarea.value = text;
          editor.range([0, text.length - 1]);
          editor.format({ block: true });
          expect(textarea.value).to.eq('Hello World\n\n!');
        })

        it('should not force more than two newlines in a row', () => {
          const text = 'Hello World\n!';
          textarea.value = text;
          editor.range([0, text.length - 2]);
          editor.format({ block: true });
          expect(textarea.value).to.eq('Hello World\n\n!');
        })

        it('should preserve selected text', () => {
          const text = 'Hello World!';
          const range = [0, text.length - 1];
          textarea.value = text;
          editor.range(range);
          editor.format({ block: true });
          expect(editor.range()).to.eql([0, text.length - 1]);
        })
      })
    })

    context('when given format has `multiline` set to true', () => {
      it('should insert prefix and suffix on each line', () => {
        const text = 'Hello\nWorld!';
        textarea.value = text;
        editor.range([0, text.length]);
        editor.format({
          multiline: true,
          prefix: { value: function (v, i) { return i + '_' }},
          suffix: { value: function (v, i) { return '_' + i }}
        });
        expect(textarea.value).to.eq('0_Hello_0\n1_World!_1');
      })

      it('should preserve selected text', () => {
        const text = 'Hello\nWorld!';
        textarea.value = text;
        editor.range([0, text.length]);
        editor.format({ multiline: true, prefix: '**', suffix: '**' });
        expect(editor.range()).to.eql([0, 20]);
      })

      context('when no text is selected', () => {
        it('should set selection between prefix and suffix', () => {
          editor.format({ multiline: true, prefix: '**', suffix: '**' });
          expect(editor.range()).to.eql([2, 2]);
        })
      })
    })
  })

  describe('#unformat()', () => {
    it('should remove prefix and suffix', () => {
      const text = '**Hello World!**';
      textarea.value = text;
      editor.range([0, text.length]);
      editor.unformat({ prefix: '**', suffix: '**' });
      expect(textarea.value).to.eq('Hello World!');
    })

    it('should remove prefix and suffix just outside selection', () => {
      const text = '**Hello World!**';
      textarea.value = text;
      editor.range([2, text.length - 2]);
      editor.unformat({ prefix: '**', suffix: '**' });
      expect(textarea.value).to.eq('Hello World!');
    })

    it('should preserve selected text', () => {
      const text = '**Hello World!**';
      textarea.value = text;
      editor.range([0, text.length]);
      editor.unformat({ prefix: '**', suffix: '**' });
      expect(editor.range()).to.eql([0, text.length - 4]);
    })

    it('should use prefix and suffix pattern, if given', () => {
      const text = '9Hello World!2';
      textarea.value = text;
      editor.range([0, text.length]);
      editor.unformat({
        prefix: { value: 'something dynamic', pattern: '[0-9]' },
        suffix: { value: 'something dynamic', pattern: '[0-9]' }
      });
      expect(textarea.value).to.eq('Hello World!');
    })

    it('should work with multiline commands', () => {
      const text = '**Hello**\n**World!**';
      textarea.value = text;
      editor.range([0, text.length]);
      editor.unformat({ multiline: true, prefix: '**', suffix: '**' });
      expect(textarea.value).to.eq('Hello\nWorld!');
      expect(editor.range()).to.eql([0, 12])
    })
  })

  describe('#hasFormat()', () => {
    it('returns `true` if current selection has given format', () => {
      const text = '**Hello World!**';
      textarea.value = text;
      editor.range([0, text.length]);
      const result = editor.hasFormat({ prefix: '**', suffix: '**' });
      expect(result).to.be.true
    })

    it('returns `false` if current selection does not have given format', () => {
      const text = 'H**ello World**!';
      textarea.value = text;
      editor.range([0, text.length]);
      const result = editor.hasFormat({ prefix: '**', suffix: '**' });
      expect(result).to.be.false
    })

    it('should work when prefix and suffix is just outside current selection', () => {
      const text = '**Hello World!**';
      textarea.value = text;
      editor.range([2, text.length - 2]);
      const result = editor.hasFormat({ prefix: '**', suffix: '**' });
      expect(result).to.be.true
    })

    it('should work with multiline commands', () => {
      const text = '**Hello**\n**World!**';
      textarea.value = text;
      editor.range([0, text.length]);
      const result = editor.hasFormat({ prefix: '**', suffix: '**', multiline: true });
      expect(result).to.be.true
    })
  })
})
