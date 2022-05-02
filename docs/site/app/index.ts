import { Application } from '@hotwired/stimulus';
import { Accordion } from './components/accordion';
import { Session } from './components/session';
import spx from 'spx';

spx.connect({
  targets: [
    '#content'
  ],
  hover: {
    trigger: 'href'
  }
});

spx.on('connected', function () {

  const stimulus = Application.start();

  stimulus.register('accordion', Accordion);
  stimulus.register('session', Session);

});
