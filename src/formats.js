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
      value: (text, n, url) => `](${url})`,
      pattern: '\\]\\([^()]*?\\)'
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
      value: (text, n, url) => `](${url})`,
      pattern: '\\]\\([^()]*?\\)'
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
    prefix: {
      value: '# ',
      pattern: '# ',
      antipattern: '[#]{2,} '
    }
  },

  /**
   * Header 2.
   *
   * @example
   * editor.format('header2');
   * assert(textarea.value == '## Hello World')
   */

  header2: {
    prefix: {
      value: '## ',
      pattern: '## ',
      antipattern: '[#]{3,} '
    }
  },

  /**
   * Header 3.
   *
   * @example
   * editor.format('header3');
   * assert(textarea.value == '### Hello World')
   */

  header3: {
    prefix: {
      value: '### ',
      pattern: '### ',
      antipattern: '[#]{4,} '
    }
  },

  /**
   * Insert code block.
   *
   * @example
   * editor.format('code');
   * assert(textarea.value == '```\nHello World\n```')
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
   * assert(textarea.value == '1. Hello World')
   */

  orderedList: {
    block: true,
    multiline: true,
    prefix: {
      value: (line, n) => `${n}. `,
      pattern: '[0-9]+\\. '
    }
  },

  /**
   * Unordered list.
   *
   * @example
   * editor.format('unorderedList');
   * assert(textarea.value == '- Hello World')
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
   * assert(textarea.value == '> Hello World')
   */

  blockquote: {
    block: true,
    multiline: true,
    prefix: '> '
  }
};

export default Formats;
