import stylesheetText from '!!../src-build/esm-text-loader!./style.css';

const stylesheet = document.createElement('style');
stylesheet.textContent = stylesheetText;
document.head.appendChild(stylesheet);
