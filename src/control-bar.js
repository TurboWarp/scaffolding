class ControlBar {
  constructor () {
    this.hasItem = false;
    this.root = document.createElement('div');
    this.root.className = 'sc-controls-bar';
    this.start = document.createElement('div');
    this.end = document.createElement('div');
    this.root.appendChild(this.start);
    this.root.appendChild(this.end);
  }

  addToStart (el) {
    this.hasItem = true;
    this.start.appendChild(el);
  }

  addToEnd (el) {
    this.hasItem = true;
    this.end.appendChild(el);
  }

  computeHeight () {
    if (!this.hasItem) {
      return 0;
    }
    return this.root.getBoundingClientRect().height;
  }
}

export default ControlBar;
