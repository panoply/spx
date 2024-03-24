import spx from 'spx';
import { Basic } from './bundle/basic';
import { Update } from './bundle/update';
import { Lifecycle } from './bundle/lifecycle';
import { Async, Async2, AsyncFetch } from './bundle/async';

spx.register(Basic, Update, Lifecycle, Async, Async2, AsyncFetch);

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
