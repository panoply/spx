
/**
 * Sort Order
 *
 * Uses the frontmatter data `order` to sort
 * a list of collection page urls. The `order`
 * property requires a numeric value be provided.
 *
 *  @type {Eleventy.PluginOrder} values
 */
exports.sorting = function (values) {

  return [ ...values ].sort(function (a, b) {

    const value = a.data.order - b.data.order;

    return isNaN(value) ? -1 : value;

  });

};

/**
 * Prism Theme
 *
 * Custom token highlights for different languages.
 * This is passed to the @11ty/eleventy-plugin-syntaxhighlight
 * plugin and brings some sanity to grammers.
 *
 * @type {Eleventy.PluginPrism}
 */
exports.prism = function ({ Prism }) {

  Prism.languages['html'] = {
    tag: {
      lookbehind: true,
      pattern: /({%-?\s*)([a-z_$][\w$]+)(?=\s)/
    },
    output: {
      lookbehind: true,
      pattern: /({{-?\s*)([a-z_$][\w$]+)(?=\s)/
    },
    delimiters: {
      global: true,
      pattern: /{%|{{|}}|%}/
    },
    comment: {
      lookbehind: true,
      global: true,
      pattern: /(?:\{%-?\s*comment\s*-?%\}[\s\S]+\{%-?\s*endcomment\s*-?%\}|\{%-?\s*#[\s\S]+?-?%\})/
    },
    object: {
      lookbehind: true,
      pattern: /\b[a-z_$]+(?=\.\s*)/i
    },
    property: {
      lookbehind: true,
      pattern: /(\.\s*)[a-z_$][\w$]+(?=[.\s])/i
    },
    filter: {
      lookbehind: true,
      pattern: /(\|)\s*(\w+)(?=[:]?)/
    },
    string: {
      lookbehind: true,
      pattern: /['"].*?['"]/
    },
    punctuation: {
      global: true,
      lookbehind: true,
      pattern: /[.,|:?]/
    },
    operator: {
      pattern: /[!=]=|<|>|[<>]=?|[|?:=-]|\b(?:in|and|contains(?=\s)|or)\b/
    },
    array: {
      lookbehind: true,
      pattern: /(\s+in\s+)(\b[a-z_$][\w$]+)(?=\.\s*)/
    },
    boolean: {
      pattern: /\b(?:true|false|nil)\b/
    },
    number: {
      pattern: /\b(?:\d+)\b/
    },
    parameter: {
      lookbehind: true,
      global: true,
      greedy: true,
      pattern: /([,:])\s*(\w+)(?=:)/i
    }
  }

  Prism.languages.insertBefore('js', 'keyword', {
    variable: {
      pattern: /\b(?:const|var|let)\b/
    },
    module: {
      pattern: /\b(?:import|as|export|from|default)\b/
    },
    op: {
      pattern: /\b(?:typeof|new|of|delete|void|readonly)\b/
    },
    'punctuation-chars': {
      pattern: /[.,]/,
      global: true
    },
    semi: {
      pattern: /[;]/,
      global: true
    },
    nil: {
      pattern: /\b(?:null|undefined)\b/
    },
    'browser-objects': {
      pattern: /\b(?:window|document|console)\b/
    },
    types: {
      pattern: /\b(?:any|string|object|boolean|number|Promise)\b/,
      global: true
    },
    'type-array': {
      pattern: /\[\]/,
      global: true
    },
    'type-object': {
      pattern: /\{\}/,
      global: true
    },
    'return-type': {
      pattern: /(\)):(?=\s)/,
      global: true,
      lookbehind: true
    },
    'parameter-optional': {
      pattern: /[a-z_$][\w$]+(?=\?:\s*)/i,
      lookbehind: true
    },
    'parameter-type': {
      pattern: /(\?:\s*)[a-z_$][\w$]+/i,
      lookbehind: true
    },
    flow: {
      pattern: /\b(?:return|await)\b/
    },
    method: {
      pattern: /(\.\s*)[a-z_$][\w$]*(?=(\())/i,
      lookbehind: true
    }
  });

};
