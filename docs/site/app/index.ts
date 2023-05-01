import { Application } from '@hotwired/stimulus';
import { Accordion } from './components/accordion';
import { Tabs } from './components/tabs';
import { Session } from './components/session';
import { Drawer } from './components/drawer';
import { Editor } from './components/flems';
import spx from 'spx';

spx.connect({
  targets: [
    'main'
  ],
  hover: {
    trigger: 'href'
  },
  progress: false
})(() => {

  const stimulus = Application.start();

  stimulus.register('drawer', Drawer);
  stimulus.register('accordion', Accordion);
  stimulus.register('tabs', Tabs);
  stimulus.register('session', Session);
  stimulus.register('flems', Editor);
  // @ts-ignore
  window.spx = spx;

});
