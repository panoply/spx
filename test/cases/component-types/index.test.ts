/* eslint-disable no-use-before-define */

import spx from 'spx';

export class Types extends spx.Component({
  nodes: [],
  state: {
    undefinedString: String,
    undefinedStringValue: String,
    undefinedBoolean: Boolean,
    undefinedBooleanValue: String,
    undefinedNumber: Number,
    undefinedNumberValue: String,
    undefinedObject: Object,
    undefinedObjectValue: String,
    undefinedArray: Array,
    undefinedArrayValue: String,

    definedString: String,
    definedStringValue: String,
    definedBoolean: Boolean,
    definedBooleanValue: String,
    definedNumber: Number,
    definedNumberValue: String,
    definedObject: Object,
    definedObjectValue: String,
    definedArray: Array,
    definedArrayValue: String,

    defaultString: { typeof: String, default: 'qux' },
    defaultStringValue: String,
    defaultBoolean: { typeof: Boolean, default: true },
    defaultBooleanValue: String,
    defaultNumber: { typeof: Number, default: 720 },
    defaultNumberValue: String,
    defaultObject: { typeof: Object, default: { foo: 'example', bar: 1000, baz: false } },
    defaultObjectValue: String,
    defaultArray: { typeof: Array, default: [ { foo: 'xxx' }, 'test', true, 5000, [ 'foo' ] ] },
    defaultArrayValue: String
  }
}) {

  onmount () {

    /* UNDEFINED ---------------------------------- */

    if (typeof this.state.undefinedString === 'string') {
      this.state.undefinedStringValue = JSON.stringify(this.state.undefinedString);
    }
    if (typeof this.state.undefinedNumber === 'number') {
      this.state.undefinedNumberValue = JSON.stringify(this.state.undefinedNumber);
    }
    if (typeof this.state.undefinedBoolean === 'boolean') {
      this.state.undefinedBooleanValue = JSON.stringify(this.state.undefinedBoolean);
    }
    if (typeof this.state.undefinedObject === 'object') {
      this.state.undefinedObjectValue = JSON.stringify(this.state.undefinedObject);
    }
    if (Array.isArray(this.state.undefinedArray)) {
      this.state.undefinedArrayValue = JSON.stringify(this.state.undefinedArray);
    }

    /* DEFINED ------------------------------------ */

    if (typeof this.state.definedString === 'string') {
      this.state.definedStringValue = JSON.stringify(this.state.definedString);
    }
    if (typeof this.state.definedNumber === 'number') {
      this.state.definedNumberValue = JSON.stringify(this.state.definedNumber);
    }
    if (typeof this.state.definedBoolean === 'boolean') {
      this.state.definedBooleanValue = JSON.stringify(this.state.definedBoolean);
    }
    if (typeof this.state.definedObject === 'object') {
      this.state.definedObjectValue = JSON.stringify(this.state.definedObject);
    }
    if (Array.isArray(this.state.definedArray)) {
      this.state.definedArrayValue = JSON.stringify(this.state.definedArray);
    }

    /* DEFAULTS ----------------------------------- */

    if (typeof this.state.defaultString === 'string') {
      this.state.defaultStringValue = JSON.stringify(this.state.defaultString);
    }
    if (typeof this.state.defaultNumber === 'number') {
      this.state.defaultNumberValue = JSON.stringify(this.state.defaultNumber);
    }
    if (typeof this.state.defaultBoolean === 'boolean') {
      this.state.defaultBooleanValue = JSON.stringify(this.state.defaultBoolean);
    }
    if (typeof this.state.defaultObject === 'object') {
      this.state.defaultObjectValue = JSON.stringify(this.state.defaultObject);
    }
    if (Array.isArray(this.state.defaultArray)) {
      this.state.defaultArrayValue = JSON.stringify(this.state.defaultArray);
    }

  }

}
