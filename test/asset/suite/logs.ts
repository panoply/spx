import spx from 'spx';

const cs = (function () {

  const CATEGORY_INFO = 'info';
  const CATEGORY_WARN = 'warn';
  const CATEGORY_ERROR = 'error';
  const CATEGORY_DEBUG = 'debug';

  const _log = console.log;
  const _warn = console.warn;
  const _error = console.error;
  const _debug = console.debug;

  let _callbacks = []; // callbacks

  const ConsoleSubscriber = {
    unbind: function (cb) {
      if (!cb) {
        _callbacks = [];
      } else {
        _callbacks = _callbacks.filter(_cb => _cb !== cb);
      }
    },
    bind: function (cb) {
      if (typeof cb !== 'function') {
        console.error('You must pass a valid callback function.');
        return false;
      }

      _callbacks.push(cb);
    }
  };

  console.log = console.info = function () {
    _log.call(console, ...arguments);
    _callbacks.forEach(cb => cb(CATEGORY_INFO, arguments));
  };

  console.warn = function () {
    _warn.call(console, ...arguments);
    _callbacks.forEach(cb => cb(CATEGORY_WARN, arguments));
  };

  console.error = function () {
    _error.call(console, ...arguments);
    _callbacks.forEach(cb => cb(CATEGORY_ERROR, arguments));

  };

  console.debug = function () {
    _debug.call(console, ...arguments);
    _callbacks.forEach(cb => cb(CATEGORY_DEBUG, arguments));
  };

  // export
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ConsoleSubscriber;
  } else if (window && typeof window === 'object') {
    window.ConsoleSubscriber = ConsoleSubscriber;
  } else {
    console.error('Failed to export module.');
  }
})();

export class Log extends spx.Component({
  nodes: <const>[
    'console'
  ]
}) {

  connect () {

    const callback = (category, args) => {

      // In a browser env you could write to a DOM element
      const message = category + ': ' + JSON.stringify(args) + '\n';
      this.consoleNode.innerHTML += message;

    };

    // Bind callback fn. Multiple functions can be bound.
    cs.bind(callback);

    // Unbind a previously bound callback
    cs.unbind(callback);

    // Restore defaults
    cs.unbind();
  }

  onmount () {

    console;
  }

}
