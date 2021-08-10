import * as Regex from '../constants/regexp';

/**
 * Parses named parameter value from a route
 */
function namedParameter (names: string[]): (
  match: string,
  optional: boolean
) => string {

  return (match, optional) => {
    names.push(match.slice(1));
    return optional ? match : '([^/?]+)';
  };

}

/**
 * Handles splats, eg: /path/:splat
 */
function splatParameter (names: string[]) {

  names.push('path');

  return () => '([^?]*?)';

};

// Parses a URL pattern such as `/users/:id`
// and builds and returns a regex that can be used to
// match said pattern. Credit for these
// regexes belongs to Jeremy Ashkenas and the
// other maintainers of Backbone.js
//
// It has been modified for extraction of
// named parameters from the URL
const parsePattern = function (pattern) {
  const names = [];

  pattern = pattern
    .replace(Regex.EscapeExp, '\\$&')
    .replace(Regex.OptionalParam, '(?:$1)?')
    .replace(Regex.NamedParam, namedParameter)
    .replace(Regex.SplatParam, splatParameter);

  return {
    regExp: new RegExp('^' + pattern + '(?:\\?([\\s\\S]*))?$'),
    namedParams: names
  };

};

export default function (routes) {

  const keys = Object.keys(routes);
  const routeCache = {};

  // loop through each route we're
  // and build the shell of our
  // route cache.
  for (const item in routes) routeCache[item] = { value: routes[item] };

  // main result is a function that can be called
  // with the url
  return function (url) {

    let params;
    let route;

    // start looking for matches
    const matchFound = keys.some(function (key) {
      let parsed;

      // fetch the route pattern from the cache
      // there will always be one
      route = routeCache[key];

      // if the route doesn't already have
      // a regex we never generated one
      // so we do that here lazily.
      // Parse the pattern to generate the
      // regex once, and store the result
      // for next time.
      if (!route.regExp) {
        parsed = parsePattern(key);
        route.regExp = parsed.regExp;
        route.namedParams = parsed.namedParams;
        route.pattern = key;
      }

      // run our cached regex
      let result = route.regExp.exec(url);

      // if null there was no match
      // returning falsy here continues
      // the `Array.prototype.some` loop
      if (!result) return null;

      // remove other cruft from result
      result = result.slice(1, -1);

      // reduce our match to an object of named parameters
      // we've extracted from the url
      params = result.reduce(function (obj, val, index) {
        if (val) {
          obj[route.namedParams[index]] = val;
        }
        return obj;
      }, {});

      // stops the loop
      return true;
    });

    // no routes matched
    if (!matchFound) {
      return null;
    }

    return {
      value: route.value,
      params: params,
      url: url,
      pattern: route.pattern
    };
  };
}
