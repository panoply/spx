
const localRoutes = [];

/**
 * Convert path to route object
 *
 * A string or RegExp should be passed,
 * will return { re, src, keys} obj
 *
 * @param  {String / RegExp} path
 * @return {Object}
 */

function route (path) {
  // using 'new' is optional

  let src;
  let re;
  const keys = [];

  if (path instanceof RegExp) {
    re = path;
    src = path.toString();
  } else {
    re = pathToRegExp(path, keys);
    src = path;
  }

  return {
    re: re,
    src: path.toString(),
    keys: keys
  };
};

/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String} path
 * @param  {Array} keys
 * @return {RegExp}
 */
function pathToRegExp (path, keys) {
  path = path
    .concat('/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?|\*/g, function (_, slash, format, key, capture, optional) {
      if (_ === '*') {
        keys.push(undefined);
        return _;
      }

      keys.push(key);
      slash = slash || '';
      return '' +
      (optional ? '' : slash) +
      '(?:' +
      (optional ? slash : '') +
      (format || '') + (capture || '([^/]+?)') + ')' +
      (optional || '');
    })
    .replace(/([/.])/g, '\\$1')
    .replace(/\*/g, '(.*)');
  return new RegExp('^' + path + '$', 'i');
};

/**
 * Attempt to match the given request to
 * one of the routes. When successful
 * a  {fn, params, splats} obj is returned
 *
 * @param  {Array} routes
 * @param  {String} uri
 * @return {Object}
 */
function match (routes, uri, startAt) {

  let captures; let i = startAt || 0;

  for (var len = routes.length; i < len; ++i) {

    const route = routes[i];
    const re = route.re;
    const keys = route.keys;
    const splats = [];
    const params = {};

    if (captures = uri.match(re)) {
      for (var j = 1, len = captures.length; j < len; ++j) {
        const key = keys[j - 1];
        const val = typeof captures[j] === 'string'
          ? unescape(captures[j])
          : captures[j];
        if (key) {
          params[key] = val;
        } else {
          splats.push(val);
        }
      }
      return {
        params: params,
        splats: splats,
        route: route.src,
        next: i + 1
      };
    }
  }
};

/**
 * Default "normal" router constructor.
 * accepts path, fn tuples via addRoute
 * returns {fn, params, splats, route}
 *  via match
 *
 * @return {Object}
 */

const Router = function () {
  // using 'new' is optional
  return {
    routes: [],
    routeMap: {},
    addRoute: function (path, fn) {
      if (!path) throw new Error(' route requires a path');
      if (!fn) throw new Error(' route ' + path.toString() + ' requires a callback');

      if (this.routeMap[path]) {
        throw new Error('path is already defined: ' + path);
      }

      const route = Route(path);
      route.fn = fn;

      this.routes.push(route);
      this.routeMap[path] = fn;
    },

    removeRoute: function (path) {
      if (!path) throw new Error(' route requires a path');
      if (!this.routeMap[path]) {
        throw new Error('path does not exist: ' + path);
      }

      let match;
      const newRoutes = [];

      // copy the routes excluding the route being removed
      for (let i = 0; i < this.routes.length; i++) {
        const route = this.routes[i];
        if (route.src !== path) {
          newRoutes.push(route);
        }
      }
      this.routes = newRoutes;
      delete this.routeMap[path];
    },

    match: function (pathname, startAt) {
      const route = match(this.routes, pathname, startAt);
      if (route) {
        route.fn = this.routeMap[route.route];
        route.next = this.match.bind(this, pathname, route.next);
      }
      return route;
    }
  };
};

Router.Route = Route;
Router.pathToRegExp = pathToRegExp;
Router.match = match;
// back compat
Router.Router = Router;

module.exports = Router;
