/* eslint-disable no-use-before-define */

import spx from 'spx';

export class Types extends spx.Component({
  nodes: [],
  state: {
    defaultString: String,
    defaultStringValue: String,
    defaultBoolean: Boolean,
    defaultBooleanValue: String,
    defaultNumber: Number,
    defaultNumberValue: String,
    defaultObject: Object,
    defaultObjectValue: String,
    defaultArray: Array,
    defaultArrayValue: String,

    domDefinedString: String,
    domDefinedOriginalString: String,
    domDefinedOriginalStringValue: String,
    domDefinedStringValue: String,
    domDefinedBoolean: Boolean,
    domDefinedOriginalBoolean: Boolean,
    domDefinedOriginalBooleanValue: String,
    domDefinedBooleanValue: String,
    domDefinedNumber: Number,
    domDefinedOriginalNumber: Number,
    domDefinedOriginalNumberValue: String,
    domDefinedNumberValue: String,
    domDefinedObject: Object,
    domDefinedOriginalObject: Object,
    domDefinedOriginalObjectValue: String,
    domDefinedObjectValue: String,
    domDefinedArray: Array,
    domDefinedOriginalArray: Array,
    domDefinedOriginalArrayValue: String,
    domDefinedArrayValue: String,

    definedString: 'qux',
    definedStringValue: String,
    definedOriginalStringValue: String,
    definedBoolean: true,
    definedBooleanValue: String,
    definedOriginalBooleanValue: String,
    definedNumber: 720,
    definedNumberValue: String,
    definedOriginalNumberValue: String,
    definedObject: { foo: 'example', bar: 1000, baz: false },
    definedOriginalObjectValue: String,
    definedObjectValue: String,
    definedArray: [ { foo: 'xxx' }, 'test', true, 5000, [ 'foo' ] ],
    definedOriginalArrayValue: String,
    definedArrayValue: String,

    overwriteString: 'within',
    overwriteStringValue: String,
    overwriteOriginalString: 'within',
    overwriteOriginalStringValue: String,
    overwriteBoolean: true,
    overwriteBooleanValue: String,
    overwriteOriginalBoolean: true,
    overwriteOriginalBooleanValue: String,
    overwriteNumber: 1000,
    overwriteNumberValue: String,
    overwriteOriginalNumber: 1000,
    overwriteOriginalNumberValue: String,
    overwriteObject: { qux: 'defined', xxx: 'in', at: 'component' },
    overwriteObjectValue: String,
    overwriteOriginalObject: { qux: 'defined', xxx: 'in', at: 'component' },
    overwriteOriginalObjectValue: String,
    overwriteArray: [ { a: 1, b: 'c', d: [] } ],
    overwriteArrayValue: String,
    overwriteOriginalArray: [ { a: 1, b: 'c', d: [] } ],
    overwriteOriginalArrayValue: String
  }
}) {

  onmount () {

    /* UNDEFINED ---------------------------------- */

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

    /* DOM DEFINED -------------------------------- */

    if (typeof this.state.domDefinedString === 'string') {
      this.state.domDefinedStringValue = JSON.stringify(this.state.domDefinedString);
      this.state.domDefinedOriginalStringValue = JSON.stringify(this.state.domDefinedOriginalString);
    }
    if (typeof this.state.domDefinedNumber === 'number') {
      this.state.domDefinedNumberValue = JSON.stringify(this.state.domDefinedNumber);
      this.state.domDefinedOriginalNumberValue = JSON.stringify(this.state.domDefinedOriginalNumber);
    }
    if (typeof this.state.domDefinedBoolean === 'boolean') {
      this.state.domDefinedBooleanValue = JSON.stringify(this.state.domDefinedBoolean);
      this.state.domDefinedOriginalBooleanValue = JSON.stringify(this.state.domDefinedOriginalBoolean);
    }
    if (typeof this.state.domDefinedObject === 'object') {
      this.state.domDefinedObjectValue = JSON.stringify(this.state.domDefinedObject);
      this.state.domDefinedOriginalObjectValue = JSON.stringify(this.state.domDefinedOriginalObject);
    }
    if (Array.isArray(this.state.domDefinedArray)) {
      this.state.domDefinedArrayValue = JSON.stringify(this.state.domDefinedArray);
      this.state.domDefinedOriginalArrayValue = JSON.stringify(this.state.domDefinedOriginalArray);
    }

    /* DEFINED ------------------------------------ */

    if (typeof this.state.definedString === 'string') {
      this.state.definedStringValue = JSON.stringify(this.state.definedString);
      this.state.definedOriginalStringValue = JSON.stringify(this.state.definedString);
    }
    if (typeof this.state.definedNumber === 'number') {
      this.state.definedNumberValue = JSON.stringify(this.state.definedNumber);
      this.state.definedOriginalNumberValue = JSON.stringify(this.state.definedNumber);
    }
    if (typeof this.state.definedBoolean === 'boolean') {
      this.state.definedBooleanValue = JSON.stringify(this.state.definedBoolean);
      this.state.definedOriginalBooleanValue = JSON.stringify(this.state.definedBoolean);
    }
    if (typeof this.state.definedObject === 'object') {
      this.state.definedObjectValue = JSON.stringify(this.state.definedObject);
      this.state.definedOriginalObjectValue = JSON.stringify(this.state.definedObject);
    }
    if (Array.isArray(this.state.definedArray)) {
      this.state.definedArrayValue = JSON.stringify(this.state.definedArray);
      this.state.definedOriginalArrayValue = JSON.stringify(this.state.definedArray);
    }

    /* DEFAULTS ----------------------------------- */

    if (typeof this.state.overwriteString === 'string') {
      this.state.overwriteStringValue = JSON.stringify(this.state.overwriteString);
      this.state.overwriteOriginalStringValue = JSON.stringify(this.state.overwriteOriginalString);
    }

    if (typeof this.state.overwriteNumber === 'number') {
      this.state.overwriteNumberValue = JSON.stringify(this.state.overwriteNumber);
      this.state.overwriteOriginalNumberValue = JSON.stringify(this.state.overwriteOriginalNumber);
    }
    if (typeof this.state.overwriteBoolean === 'boolean') {
      this.state.overwriteBooleanValue = JSON.stringify(this.state.overwriteBoolean);
      this.state.overwriteOriginalBooleanValue = JSON.stringify(this.state.overwriteOriginalBoolean);
    }
    if (typeof this.state.overwriteObject === 'object') {
      this.state.overwriteObjectValue = JSON.stringify(this.state.overwriteObject);
      this.state.overwriteOriginalObjectValue = JSON.stringify(this.state.overwriteOriginalObject);
    }
    if (Array.isArray(this.state.overwriteArray)) {
      this.state.overwriteArrayValue = JSON.stringify(this.state.overwriteArray);
      this.state.overwriteOriginalArrayValue = JSON.stringify(this.state.overwriteOriginalArray);
    }

  }

}
