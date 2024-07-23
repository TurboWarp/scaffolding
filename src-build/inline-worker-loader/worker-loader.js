// This is an ugly hack to override the options of the worker-loader used by scratch-vm
// for loading the extension worker to always be inline.

const realWorkerLoader = require('worker-loader');

module.exports.pitch = function inlineWorkerLoaderPitch (...args) {
  const newThis = new Proxy(this, {
    get(target, property) {
      if (property === 'query') {
        return {
          inline: true,
          fallback: false
        };
      }
      return target[property];
    }
  });
  return realWorkerLoader.pitch.call(newThis, ...args);
};
