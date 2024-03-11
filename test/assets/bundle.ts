import spx from 'spx';
import { Basic } from './components/basic';
import { Update } from './components/update';
import { Lifecycle } from './components/lifecycle';
import { Async, Async2 } from './components/async';

spx.register(Basic, Update, Lifecycle, Async, Async2);

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
