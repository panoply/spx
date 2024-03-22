import spx from 'spx';
import { Hooks } from './demonstate/hooks';
import { Counter } from './demonstate/counter';

spx.connect({
  fragments: [
    'main',
    'menu'
  ],
  components: {
    Hooks,
    Counter
  }
});
