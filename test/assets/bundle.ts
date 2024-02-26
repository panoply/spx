import spx from 'spx';
import { Basic } from './components/basic';
import { Update } from './components/update';
import { Lifecycle } from './components/lifecycle';

spx.register(Basic, Update, Lifecycle);

spx.connect(
  {
    fragments: [
      'aside',
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
