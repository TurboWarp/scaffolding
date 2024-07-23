const readAsText = (blob) => new Promise((resolve, reject) => {
  const fr = new FileReader();
  fr.onload = () => resolve(fr.result);
  fr.onerror = () => reject(new Error(`Failed to read file as text: ${fr.error}`));
  fr.readAsText(blob);
});

class DropArea {
  constructor (el, callback) {
    this.el = el;
    this.callback = callback;
    this.el.addEventListener('dragover', this.ondragover.bind(this));
    this.el.addEventListener('dragleave', this.ondragleave.bind(this));
    this.el.addEventListener('drop', this.ondrop.bind(this));
  }

  ondragover (e) {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      this.el.classList.add('sc-dropping');
    }
  }

  ondragleave (e) {
    e.preventDefault();
    this.el.classList.remove('sc-dropping');
  }

  ondrop (e) {
    e.preventDefault();
    this.el.classList.remove('sc-dropping');
    if (e.dataTransfer.types.includes('Files') && e.dataTransfer.files.length > 0) {
      Promise.all(Array.from(e.dataTransfer.files).map(readAsText))
        .then((texts) => {
          this.callback(texts);
        });
    }
  }
}

export default DropArea;
