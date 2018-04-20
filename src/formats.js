/**
 * Default formats.
 */

const Formats = {
  /**
   * Bold text.
   *
   * @example
   * editor.format('bold');
   * assert(textarea.value == '**Hello World**')
   */

  bold: {
    prefix: '**',
    suffix: '**'
  },

  /**
   * Italic text.
   *
   * @example
   * editor.format('italic');
   * assert(textarea.value == '_Hello World_')
   */

  italic: {
    prefix: '_',
    suffix: '_'
  },

  /**
   * Insert link.
   *
   * @example
   * editor.format('link', '/example');
   * assert(textarea.value == '[Hello World](/example)')
   */

  link: {
    prefix: {
      value: '[',
      pattern: '\\[',
      antipattern: '\\!\\['
    },
    suffix: {
      value: (text, i, url) => `](${url})`,
      pattern: '\\]\\(.*?\\)'
    }
  },

  /**
   * Insert image.
   *
   * @example
   * editor.format('image', '/example.png');
   * assert(textarea.value == '![Hello World](/example.png)')
   */

  image: {
    prefix: '![',
    suffix: {
      value: (text, i, url) => `](${url})`,
      pattern: '\\]\\(.*?\\)'
    }
  },

  /**
   * Header 1.
   *
   * @example
   * editor.format('header1');
   * assert(textarea.value == '# Hello World')
   */

  header1: {
    prefix: '# '
  },

  /**
   * Header 2.
   *
   * @example
   * editor.format('header2');
   * assert(textarea.value == '## Hello World')
   */

  header2: {
    prefix: '## '
  },

  /**
   * Header 3.
   *
   * @example
   * editor.format('header3');
   * assert(textarea.value == '### Hello World')
   */

  header3: {
    prefix: '### '
  },

  /**
   * Insert code block.
   *
   * @example
   * editor.format('code');
   * assert(textarea.value == '```\nHello World\n```\n\n')
   */

  code: {
    block: true,
    prefix: '```\n',
    suffix: '\n```'
  },

  /**
   * Ordered list.
   *
   * @example
   * editor.format('orderedList');
   * assert(textarea.value == '1. Hello World\n\n')
   */

  orderedList: {
    block: true,
    multiline: true,
    prefix: {
      value: (line, index) => `${index + 1}. `,
      pattern: '[0-9]+\\. '
    }
  },

  /**
   * Unordered list.
   *
   * @example
   * editor.format('unorderedList');
   * assert(textarea.value == '- Hello World\n\n')
   */

  unorderedList: {
    block: true,
    multiline: true,
    prefix: '- '
  },

  /**
   * Blockquote.
   *
   * @example
   * editor.format('blockquote');
   * assert(textarea.value == '> Hello World\n\n')
   */

  blockquote: {
    block: true,
    multiline: true,
    prefix: '> '
  }
};

export default Formats;