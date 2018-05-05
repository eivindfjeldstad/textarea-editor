import escape from 'escape-string-regexp';
import Formats from './formats';

/**
 * TextareaEditor class.
 *
 * @param {HTMLElement} el - the textarea element to wrap around
 */

export default class TextareaEditor {
  constructor(el) {
    this.el = el;
  }

  /**
   * Set or get selection range.
   *
   * @param {Array} [range]
   * @return {Array|TextareaEditor}
   */

  range(range) {
    const el = this.el;

    if (range == null) {
      return [el.selectionStart || 0, el.selectionEnd || 0];
    }

    this.focus();
    [el.selectionStart, el.selectionEnd] = range;
    return this;
  }

  /**
   * Insert given text at the current cursor position.
   *
   * @param {String} text - text to insert
   * @return {TextareaEditor}
   */

  insert(text) {
    let inserted = true;
    this.el.contentEditable = true;
    this.focus();

    try {
      document.execCommand('insertText', false, text);
    } catch (e) {
      inserted = false;
    }

    this.el.contentEditable = false;

    if (inserted) return this;

    try {
      document.execCommand('ms-beginUndoUnit');
    } catch (e) {}

    const { before, after } = this.selection();
    this.el.value = before + text + after;

    try {
      document.execCommand('ms-endUndoUnit');
    } catch (e) {}

    const event = document.createEvent('Event');
    event.initEvent('input', true, true);
    this.el.dispatchEvent(event);
    return this;
  }

  /**
   * Set foucs on the TextareaEditor's element.
   *
   * @return {TextareaEditor}
   */

  focus() {
    if (document.activeElement !== this.el) this.el.focus();
    return this;
  }

  /**
   * Get selected text.
   *
   * @return {Object}
   * @private
   */

  selection() {
    const [start, end] = this.range();
    const value = normalizeNewlines(this.el.value);
    return {
      before: value.slice(0, start),
      content: value.slice(start, end),
      after: value.slice(end)
    };
  }

  /**
   * Get format by name.
   *
   * @param {String|Object} format
   * @return {Object}
   * @private
   */

  getFormat(format) {
    if (typeof format == 'object') {
      return normalizeFormat(format);
    }

    if (!Formats.hasOwnProperty(format)) {
      throw new Error(`Invalid format ${format}`);
    }

    return normalizeFormat(Formats[format]);
  }

  /**
   * Toggle given `format` on current selection.
   * Any additional arguments are passed on to `.format()`.
   *
   * @param {String|Object} format - name of format or an object
   * @return {TextareaEditor}
   */

  toggle(format, ...args) {
    if (this.hasFormat(format)) return this.unformat(format);
    return this.format(format, ...args);
  }

  /**
   * Format current selcetion with given `format`.
   *
   * @param {String|Object} name - name of format or an object
   * @return {TextareaEditor}
   */

  format(name, ...args) {
    const format = this.getFormat(name);
    const { prefix, suffix, multiline } = format;
    let { before, content, after } = this.selection();
    let lines = multiline ? content.split('\n') : [content];
    let [start, end] = this.range();

    // format lines
    lines = lines.map((line, i) => {
      const pval = maybeCall(prefix.value, line, i + 1, ...args);
      const sval = maybeCall(suffix.value, line, i + 1, ...args);

      if (!multiline || !content.length) {
        start += pval.length;
        end += pval.length;
      } else {
        end += pval.length + sval.length;
      }

      return pval + line + sval;
    });

    let insert = lines.join('\n');

    // newlines before and after block
    if (format.block) {
      let nlb = matchLength(before, /\n+$/);
      let nla = matchLength(after, /^\n+/);

      if (before) {
        while (nlb < 2) {
          insert = `\n${insert}`;
          start++;
          end++;
          nlb++;
        }
      }

      if (after) {
        while (nla < 2) {
          insert = `${insert}\n`;
          nla++;
        }
      }
    }

    this.insert(insert);
    this.range([start, end]);
    return this;
  }

  /**
   * Remove given `format` from current selection.
   *
   * @param {String|Object} name - name of format or an object
   * @return {TextareaEditor}
   */

  unformat(name) {
    if (!this.hasFormat(name)) return this;

    const format = this.getFormat(name);

    const { prefix, suffix, multiline } = format;
    const { before, content, after } = this.selection();

    let lines = multiline
      ? content.split('\n')
      : [content];

    let [start, end] = this.range();

    // If this is not a multiline format, include prefixes and suffixes just
    // outside the selection.
    if (
      (!multiline || lines.length == 1)  &&
      hasSuffix(before, prefix) &&
      hasPrefix(after, suffix)
    ) {
      start -= suffixLength(before, prefix);
      end += prefixLength(after, suffix);
      this.range([start, end]);
      lines = [this.selection().content];
    }

    // remove formatting from lines
    lines = lines.map(line => {
      const plen = prefixLength(line, prefix);
      const slen = suffixLength(line, suffix);
      return line.slice(plen, line.length - slen);
    });

    // insert and set selection
    let insert = lines.join('\n');
    this.insert(insert);
    this.range([start, start + insert.length]);

    return this;
  }

  /**
   * Check if current seletion has given format.
   *
   * @param {String|Object} name - name of format or an object
   * @return {Boolean}
   */

  hasFormat(name) {
    const format = this.getFormat(name);
    const { prefix, suffix, multiline } = format;
    const { before, content, after } = this.selection();
    const lines = content.split('\n');

    // prefix and suffix outside selection
    if (!multiline || lines.length == 1) {
      return (
        (hasSuffix(before, prefix) && hasPrefix(after, suffix)) ||
        (hasPrefix(content, prefix) && hasSuffix(content, suffix))
      );
    }

    // check which line(s) are formatted
    const formatted = lines.filter(line => {
      return hasPrefix(line, prefix) && hasSuffix(line, suffix);
    });

    return formatted.length === lines.length;
  }
}

// Expose formats
export { Formats };

/**
 * Check if given prefix is present.
 * @private
 */

function hasPrefix(text, prefix) {
  let exp = new RegExp(`^${prefix.pattern}`);
  let result = exp.test(text);

  if (prefix.antipattern) {
    let exp = new RegExp(`^${prefix.antipattern}`);
    result = result && !exp.test(text);
  }

  return result;
}

/**
 * Check if given suffix is present.
 * @private
 */

function hasSuffix(text, suffix) {
  let exp = new RegExp(`${suffix.pattern}$`);
  let result = exp.test(text);

  if (suffix.antipattern) {
    let exp = new RegExp(`${suffix.antipattern}$`);
    result = result && !exp.test(text);
  }

  return result;
}

/**
 * Get length of match.
 * @private
 */

function matchLength(text, exp) {
  const match = text.match(exp);
  return match ? match[0].length : 0;
}

/**
 * Get prefix length.
 * @private
 */

function prefixLength(text, prefix) {
  const exp = new RegExp(`^${prefix.pattern}`);
  return matchLength(text, exp);
}

/**
 * Get suffix length.
 * @private
 */

function suffixLength(text, suffix) {
  let exp = new RegExp(`${suffix.pattern}$`);
  return matchLength(text, exp);
}

/**
 * Normalize newlines.
 * @private
 */

function normalizeNewlines(str) {
  return str.replace('\r\n', '\n');
}

/**
 * Normalize format.
 * @private
 */

function normalizeFormat(format) {
  const clone = Object.assign({}, format);
  clone.prefix = normalizePrefixSuffix(format.prefix);
  clone.suffix = normalizePrefixSuffix(format.suffix);
  return clone;
}

/**
 * Normalize prefixes and suffixes.
 * @private
 */

function normalizePrefixSuffix(value = '') {
  if (typeof value == 'object') return value;
  return {
    value: value,
    pattern: escape(value)
  };
}

/**
 * Call if function.
 * @private
 */

function maybeCall(value, ...args) {
  return typeof value == 'function' ? value(...args) : value;
}
