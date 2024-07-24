import Scaffolding from './scaffolding.js';
import * as CloudVariables from './cloud-variables.js';
import Packages from './packages.js';
import cssText from '!raw-loader!./style.css';

if (process.env.NODE_ENV !== 'production') {
  console.warn('This is development build not for use in production. Use `npm run prepublishOnly` for improved file size and performance (This message will go away).');
}

const styleElement = document.createElement('style');
styleElement.id = 'sc-styles';
styleElement.textContent = cssText;
const styleContainer = document.head || document.body || document.documentElement;
styleContainer.appendChild(styleElement);

export {
  Scaffolding,
  CloudVariables,
  Packages,
};
