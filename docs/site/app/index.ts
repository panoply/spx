import { Application } from '@hotwired/stimulus';
import { Accordion } from './components/accordion';
import { Tabs } from './components/tabs';
import { Session } from './components/session';
import { Drawer } from './components/drawer';
import { Examples } from './components/examples';
import spx from 'spx';
// import papyrus from '@liquify/papyrus'
// import Prism from 'prismjs'

// papyrus.potion(Prism)()

spx.connect({
  targets: [
    '#main',
  ],
  hover: {
    threshold: 100,
    trigger: 'href'
  },
})(() => {


  const stimulus = Application.start();

  stimulus.register('drawer', Drawer);
  stimulus.register('accordion', Accordion);
  stimulus.register('tabs', Tabs);
  stimulus.register('session', Session);
  stimulus.register('examples', Examples);

  console.log(stimulus)

  spx.capture()

});
