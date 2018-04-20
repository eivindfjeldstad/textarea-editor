/**
 * Default formats
 */

const formats = {
  // bold text
  bold: {
    prefix: '**',
    suffix: '**'
  },

  // italic text
  italic: {
    prefix: '_',
    suffix: '_'
  },

  // insert link
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

  // insert image
  image: {
    prefix: '![',
    suffix: {
      value: (text, i, url) => `](${url})`,
      pattern: '\\]\\(.*?\\)'
    }
  },

  // insert image
  code: {
    block: true,
    prefix: '```\n',
    suffix: '\n```'
  },

  // insert h1
  header1: {
    prefix: '# '
  },

  // insert h2
  header2: {
    prefix: '## '
  },

  // insert h3
  header3: {
    prefix: '### '
  },

  // insert ordered list
  orderedList: {
    block: true,
    multiline: true,
    prefix: {
      value: (line, index) => `${index + 1}. `,
      pattern: '[0-9]+\\. '
    }
  },

  // insert unordered list
  unorderedList: {
    block: true,
    multiline: true,
    prefix: '- '
  },

  // insert blockquote
  blockquote: {
    block: true,
    multiline: true,
    prefix: '> '
  }
};

export default formats;
