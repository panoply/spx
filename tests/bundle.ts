import spx from 'spx';
import { Basic } from './bundle/basic';
import { Incremental } from './bundle/incremental';
import { Lifecycle } from './bundle/lifecycle';
import { Merge } from './bundle/merge';
import { Types } from './bundle/types';
import { Async, Async2, AsyncFetch } from './bundle/async';

spx.register(
  Basic,
  Incremental,
  Lifecycle,
  Merge,
  Async,
  Async2,
  Types,
  AsyncFetch
);

spx.connect(
  {
    fragments: [
      'sidebar',
      'main'
    ],
    logLevel: 1,
    hover: {
      threshold: 100,
      trigger: 'href'
    },
    progress: {
      bgColor: 'red'
    }
  }
);
