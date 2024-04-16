import spx from 'spx';
import { Basic } from './bundle/basic';
import { Incremental } from './bundle/incremental';
import { Lifecycle } from './bundle/lifecycle';
import { Async, Async2, AsyncFetch } from './bundle/async';

spx.register(
  Basic,
  Incremental,
  Lifecycle,
  Async,
  Async2,
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
