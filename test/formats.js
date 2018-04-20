import TextareaEditor, {Formats} from '../src/editor';

let textarea, editor;

beforeEach(() => {
  textarea = document.createElement('textarea');
  document.body.appendChild(textarea);
  editor = new TextareaEditor(textarea);
})

afterEach(() => {
  document.body.removeChild(textarea);
})

describe('Formats', () => {
  describe('bold', () => {
    test('should format correctly', () => {
      textarea.value = 'Hello World';
      editor.range([0, textarea.value.length]);
      editor.format('bold');
      expect(textarea.value).toBe('**Hello World**')
    })

    test('should unformat correctly', () => {
      textarea.value = '**Hello World**';
      editor.range([0, textarea.value.length]);
      editor.unformat('bold');
      expect(textarea.value).toBe('Hello World')
    })
  })

  describe('italic', () => {
    test('should format correctly', () => {
      textarea.value = 'Hello World';
      editor.range([0, textarea.value.length]);
      editor.format('italic');
      expect(textarea.value).toBe('_Hello World_')
    })

    test('should unformat correctly', () => {
      textarea.value = '_Hello World_';
      editor.range([0, textarea.value.length]);
      editor.unformat('italic');
      expect(textarea.value).toBe('Hello World')
    })
  })

  describe('link', () => {
    test('should format correctly', () => {
      textarea.value = 'Hello World';
      editor.range([0, textarea.value.length]);
      editor.format('link', '/example');
      expect(textarea.value).toBe('[Hello World](/example)')
    })

    test('should unformat correctly', () => {
      textarea.value = '[Hello World](/example)';
      editor.range([0, textarea.value.length]);
      editor.unformat('link');
      expect(textarea.value).toBe('Hello World')
    })

    test('should not unformat images', () => {
      textarea.value = '![Hello World](/example.png)';
      editor.range([2, 13]);
      editor.unformat('link');
      expect(textarea.value).toBe('![Hello World](/example.png)')
    })
  })

  describe('image', () => {
    test('should format correctly', () => {
      textarea.value = 'Hello World';
      editor.range([0, textarea.value.length]);
      editor.format('image', '/example.png');
      expect(textarea.value).toBe('![Hello World](/example.png)')
    })

    test('should unformat correctly', () => {
      textarea.value = '![Hello World](/example.png)';
      editor.range([0, textarea.value.length]);
      editor.unformat('image');
      expect(textarea.value).toBe('Hello World')
    })
  })

  describe('header1', () => {
    test('should format correctly', () => {
      textarea.value = 'Hello World';
      editor.range([0, textarea.value.length]);
      editor.format('header1');
      expect(textarea.value).toBe('# Hello World')
    })

    test('should unformat correctly', () => {
      textarea.value = '# Hello World';
      editor.range([0, textarea.value.length]);
      editor.unformat('header1');
      expect(textarea.value).toBe('Hello World')
    })

    test('should not unformat other headers', () => {
      textarea.value = '### Hello World';
      editor.range([4, textarea.value.length]);
      editor.unformat('header1');
      expect(textarea.value).toBe('### Hello World')
    })
  })

  describe('header2', () => {
    test('should format correctly', () => {
      textarea.value = 'Hello World';
      editor.range([0, textarea.value.length]);
      editor.format('header2');
      expect(textarea.value).toBe('## Hello World')
    })

    test('should unformat correctly', () => {
      textarea.value = '## Hello World';
      editor.range([0, textarea.value.length]);
      editor.unformat('header2');
      expect(textarea.value).toBe('Hello World')
    })

    test('should not unformat other headers', () => {
      textarea.value = '### Hello World';
      editor.range([4, textarea.value.length]);
      editor.unformat('header2');
      expect(textarea.value).toBe('### Hello World')
    })
  })

  describe('header3', () => {
    test('should format correctly', () => {
      textarea.value = 'Hello World';
      editor.range([0, textarea.value.length]);
      editor.format('header3');
      expect(textarea.value).toBe('### Hello World')
    })

    test('should unformat correctly', () => {
      textarea.value = '### Hello World';
      editor.range([0, textarea.value.length]);
      editor.unformat('header3');
      expect(textarea.value).toBe('Hello World')
    })

    test('should not unformat other headers', () => {
      textarea.value = '#### Hello World';
      editor.range([5, textarea.value.length]);
      editor.unformat('header3');
      expect(textarea.value).toBe('#### Hello World')
    })
  })

  describe('code', () => {
    test('should format correctly', () => {
      textarea.value = 'Hello World';
      editor.range([0, textarea.value.length]);
      editor.format('code');
      expect(textarea.value).toBe('```\nHello World\n```')
    })

    test('should unformat correctly', () => {
      textarea.value = '```\nHello World\n```';
      editor.range([0, textarea.value.length]);
      editor.unformat('code');
      expect(textarea.value).toBe('Hello World')
    })
  })

  describe('orderedList', () => {
    test('should format correctly', () => {
      textarea.value = 'Hello\nWorld';
      editor.range([0, textarea.value.length]);
      editor.format('orderedList');
      expect(textarea.value).toBe('1. Hello\n2. World')
    })

    test('should unformat correctly', () => {
      textarea.value = '1. Hello\n2. World';
      editor.range([0, textarea.value.length]);
      editor.unformat('orderedList');
      expect(textarea.value).toBe('Hello\nWorld')
    })
  })

  describe('unorderedList', () => {
    test('should format correctly', () => {
      textarea.value = 'Hello\nWorld';
      editor.range([0, textarea.value.length]);
      editor.format('unorderedList');
      expect(textarea.value).toBe('- Hello\n- World')
    })

    test('should unformat correctly', () => {
      textarea.value = '- Hello\n- World';
      editor.range([0, textarea.value.length]);
      editor.unformat('unorderedList');
      expect(textarea.value).toBe('Hello\nWorld')
    })
  })

  describe('blockquote', () => {
    test('should format correctly', () => {
      textarea.value = 'Hello\nWorld';
      editor.range([0, textarea.value.length]);
      editor.format('blockquote');
      expect(textarea.value).toBe('> Hello\n> World')
    })

    test('should unformat correctly', () => {
      textarea.value = '> Hello\n> World';
      editor.range([0, textarea.value.length]);
      editor.unformat('blockquote');
      expect(textarea.value).toBe('Hello\nWorld')
    })
  })
})
