import spx from 'spx';

export class Log extends spx.Component({
  nodes: <const>[
    'console'
  ]
}) {

  connect () {

  }

}

spx({
  logLevel: 1,
  components: { Log },
  fragments: [
    '.using-class', // Fails
    '#using-hash', // Fails
    'is-valid', // Passes
    '[data-attr]' // Fails
  ]
});
