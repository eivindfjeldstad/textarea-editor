import TextareaEditor from '../src/editor';

const textarea = document.querySelector('textarea');
const toolbar = document.querySelector('.toolbar');
const editor = new TextareaEditor(textarea);

toolbar.addEventListener('mousedown', e => e.preventDefault());

toolbar.addEventListener('click', e => {
  const command = e.target.getAttribute('data-command');
  if (!command) return;

  let url;

  if (/image|link/.test(command)) {
    url = prompt('URL:');
  }

  editor.toggle(command, url);
})

textarea.addEventListener('keydown', (e) => {
  const key = e.which;
  const cmd = e.metaKey || e.ctrlKey;

  if (!cmd) return;

  switch (key) {
    case 66:
      editor.toggle('bold');
      break;
    case 73:
      editor.toggle('italic');
      break;
    default: return;
  }

  e.preventDefault();
});
