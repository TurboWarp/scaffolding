import DropArea from './drop-area.js';

const BUTTON_ICON = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.773595 5.7280519a1.3077774 1.3077774 0 0 0-1.857043 0L9.1736105 15.484071l-4.0933432-4.10642a1.3364468 1.3364468 0 1 0-1.8570439 1.922432l5.0218651 5.021866a1.3077774 1.3077774 0 0 0 1.8570445 0L20.773595 7.6504847a1.3077774 1.3077774 0 0 0 0-1.9224328z" fill="#fff"/></svg>';

class Question {
  constructor (parent, text) {
    this.parent = parent;
    this.text = text;

    this.root = document.createElement('div');
    this.root.className = 'sc-question-root';

    this.inner = document.createElement('div');
    this.inner.className = 'sc-question-inner';

    if (text) {
      this.textElement = document.createElement('div');
      this.textElement.textContent = text;
      this.textElement.className = 'sc-question-text';
    }

    this.inputContainer = document.createElement('div');
    this.inputContainer.className = 'sc-question-input-outer';

    this.input = document.createElement('input');
    this.input.className = 'sc-question-input';
    this.input.addEventListener('keypress', this.onkeypress.bind(this));

    this.dropper = new DropArea(this.input, this.dropperCallback.bind(this));

    this.submitButton = document.createElement('button');
    this.submitButton.className = 'sc-question-submit-button';
    this.submitButton.style.backgroundImage = `url("data:image/svg+xml;base64,${btoa(BUTTON_ICON)}")`;
    this.submitButton.addEventListener('click', this.onsubmitpressclick.bind(this));

    this.inputContainer.appendChild(this.input);
    this.inputContainer.appendChild(this.submitButton);
    if (this.textElement) {
      this.inner.appendChild(this.textElement);
    }
    this.inner.appendChild(this.inputContainer);
    this.root.appendChild(this.inner);
    this.parent._addLayer(this.root);
    this.input.focus();

    this.answerCallback = new Promise((resolve) => {
      this.callback = resolve;
    });
  }

  answer () {
    return this.answerCallback;
  }

  submit () {
    this.callback(this.input.value);
    this.destroy();
  }

  onkeypress (e) {
    if (e.key === 'Enter') {
      this.submit();
    }
  }

  dropperCallback (texts) {
    const text = texts.join('').replace(/\r?\n/g, ' ');
    this.input.value = text;
  }

  onsubmitpressclick () {
    this.submit();
  }

  destroy () {
    this.root.remove();
    this.parent.question = null;
  }
}

export default Question;
