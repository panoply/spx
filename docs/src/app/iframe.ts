import spx from 'spx';
import { Hooks } from './examples/hooks';
import { Counter } from './examples/counter';
import { Alias } from './examples/alias';
import { IFrame } from './examples/iframe';

spx.connect({
  fragments: [
    'main',
    'menu'
  ],
  components: {
    IFrame,
    Hooks,
    Counter,
    Alias
  }
});
