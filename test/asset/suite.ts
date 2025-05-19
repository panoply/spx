import spx from 'spx';

import { Alias } from '../cases/component-aliases/index.test';
import { Async } from '../cases/component-hooks/index.test';
import { Types } from '../cases/component-types/index.test';
import { Incremental } from '../cases/component-incremental/index.test';
import { Literal } from '../cases/component-literal/index.test';
import { Merge } from '../cases/component-merge/index.test';
import { Lifecycle } from '../cases/component-lifecycle/index.test';
import { Nesting } from '../cases/component-nesting/index.test';
import { Refs1, Refs2 } from '../cases/component-refs/index.test';
import { MorphNodes } from '../cases/morph-nodes/index.test';
import { Mounted } from '../cases/component-observer/index.test';

import { Events } from '../cases/lifecycle-events/index.test';
/* INTERNAL ----------------------------------- */

import { code } from './suite/resize';
import { Cases } from './suite/cases';

// import { Logger } from './suite/logger';
import { Explorer } from './suite/explorer';
// import { Refs } from './suite/refs';

spx.http('https://jsonplaceholder.typicode.com/todos/1').then(data => {

  console.log(data);
});

spx({
  fragments: [
    'main'
  ],
  logLevel: 3,
  hover: {
    threshold: 100,
    trigger: 'href'
  },
  progress: {
    bgColor: 'red'
  },
  components: {
    // Logger,

    Events,
    Mounted,
    Explorer,
    Cases,
    Literal,
    Alias,
    Async,
    Types,
    Incremental,
    Merge,
    Lifecycle,
    Nesting,
    Refs1,
    Refs2,
    MorphNodes

  }
})(function () {

  code();

});
