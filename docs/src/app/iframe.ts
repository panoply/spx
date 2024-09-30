import spx from 'spx';
import { Counter } from './examples/counter';
import { Alias } from './examples/alias';
import { IFrame } from './examples/iframe';
import { UsageHooks } from '../views/docs/usage/examples/hooks/component';

spx({
  fragments: [
    'main',
    'menu'
  ],
  components: {
    IFrame,
    UsageHooks,
    Counter,
    Alias
  }
});
