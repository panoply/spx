/* eslint-disable no-use-before-define */

import spx from 'spx';

export class Types extends spx.Component<typeof Types.define> {

  static define = {
    nodes: [
      'string',
      'boolean',
      'number',
      'object',
      'array',
      'ustring',
      'uboolean',
      'unumber',
      'uobject',
      'uarray',
      'ustring',
      'dboolean',
      'dnumber',
      'dobject',
      'darray'
    ],
    state: {
      undefinedString: String,
      undefinedBoolean: Boolean,
      undefinedNumber: Number,
      undefinedObject: Object,
      undefinedArray: Array,
      string: String,
      boolean: Boolean,
      number: Number,
      object: Object,
      array: Array,
      defaultString: {
        typeof: String,
        default: 'foo'
      },
      defaultBoolean: {
        typeof: Boolean,
        default: true
      },
      defaultNumber: {
        typeof: Number,
        default: 1000
      },
      defaultObject: {
        typeof: Object,
        default: {
          foo: 'example',
          bar: 1000,
          baz: false
        }
      },
      defaultArray: {
        typeof: Array,
        default: [
          {
            foo: 'example',
            bar: 1000,
            baz: false
          }
        ]
      }
    }
  };

  onmount () {

    if (typeof this.state.undefinedString === 'string') {
      this.ustringNode.innerHTML = `<code class="fs-md">${JSON.stringify(this.state.undefinedString)}</code>`;
    }

    if (typeof this.state.undefinedNumber === 'number') {
      this.unumberNode.innerHTML = `<code class="fs-md">${this.state.undefinedNumber}</code>`;
    }

    if (typeof this.state.undefinedBoolean === 'boolean') {
      this.ubooleanNode.innerHTML = `<code class="fs-md">${this.state.undefinedBoolean}</code>`;
    }

    if (typeof this.state.undefinedObject === 'object') {
      this.uobjectNode.innerHTML = `<code class="fs-md">${JSON.stringify(this.state.undefinedObject)}</code>`;
    }

    if (Array.isArray(this.state.undefinedArray)) {
      this.uarrayNode.innerHTML = `<code class="fs-md">${JSON.stringify(this.state.undefinedArray)}</code>`;
    }

    if (typeof this.state.string === 'string') {
      this.stringNode.innerHTML = `<code class="fs-md">${JSON.stringify(this.state.string)}</code>`;
    }

    if (typeof this.state.number === 'number') {
      this.numberNode.innerHTML = `<code class="fs-md">${this.state.number}</code>`;
    }

    if (typeof this.state.boolean === 'boolean') {
      this.booleanNode.innerHTML = `<code class="fs-md">${this.state.boolean}</code>`;
    }

    if (typeof this.state.object === 'object') {
      this.objectNode.innerHTML = `<code class="fs-md">${JSON.stringify(this.state.object)}</code>`;
    }

    if (Array.isArray(this.state.array)) {
      this.arrayNode.innerHTML = `<code class="fs-md">${JSON.stringify(this.state.array)}</code>`;
    }

    if (typeof this.state.defaultString === 'string') {
      this.dstringNode.innerHTML = `<code class="fs-md">${JSON.stringify(this.state.defaultString)}</code>`;
    }

    if (typeof this.state.defaultNumber === 'number') {
      this.dnumberNode.innerHTML = `<code class="fs-md">${this.state.defaultNumber}</code>`;
    }

    if (typeof this.state.defaultBoolean === 'boolean') {
      this.dbooleanNode.innerHTML = `<code class="fs-md">${this.state.defaultBoolean}</code>`;
    }

    if (typeof this.state.defaultObject === 'object') {
      this.dobjectNode.innerHTML = `<code class="fs-md">${JSON.stringify(this.state.defaultObject)}</code>`;
    }

    if (Array.isArray(this.state.defaultArray)) {
      this.darrayNode.innerHTML = `<code class="fs-md">${JSON.stringify(this.state.defaultArray)}</code>`;
    }

  }

}
