import { Application } from '@hotwired/stimulus';
import { Tabs } from './components/tabs';
import { Session } from './components/session';
import { Drawer } from './components/drawer';
import { Examples } from './components/examples';
import { Dropdown } from './components/dropdown';
import { IFrame } from './components/iframe';
import spx from 'spx';
import relapse from 'relapse'
// import papyrus from '@liquify/papyrus'
// import Prism from 'prismjs'

// papyrus.potion(Prism)()


import { Demo } from './showcase/components/demo';
import { Foo } from './showcase/components/foo';
import { Bar } from './showcase/components/bar';
import { Test } from './showcase/components/test';


spx.connect(
  {
    fragments: [
      '#content',
    ],
    method: 'morph',
    hover: {
      threshold: 100,
      trigger: 'href'
    },
    progress: {
      bgColor: 'red'
    },
    components: {
      Demo,
      Dropdown,
      Foo,
      Bar,
      Test,
      Session,
      Drawer,
      IFrame,
      Tabs
    }
  }
)(function() {

  relapse()

  const stimulus = Application.start();
  //stimulus.register('session', Session);
  stimulus.register('examples', Examples);

});



