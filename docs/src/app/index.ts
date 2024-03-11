import spx from 'spx';
import relapse from 'relapse';
import { Tabs } from './components/tabs';
import { Modal } from './examples/modal';
import { Session } from './components/session';
import { Drawer } from './components/drawer';
import { Dropdown } from './components/dropdown';
import { IFrame } from './components/iframe';
import { Search } from './components/search';
// import papyrus from '@liquify/papyrus'
// import Prism from 'prismjs'

// papyrus.potion(Prism)()

import { Example } from './showcase/components/example';
import { Demo } from './showcase/components/demo';
import { Foo } from './showcase/components/foo';
import { Bar } from './showcase/components/bar';
import { Test } from './showcase/components/test';

spx.register(
  Demo,
  Dropdown,
  Example,
  Modal,
  Foo,
  Bar,
  Test,
  Session,
  Drawer,
  IFrame,
  Tabs,
  Search
);

spx.connect({
  fragments: [
    'content',
    'menu'
  ],
  logLevel: 1,
  hover: {
    threshold: 100,
    trigger: 'href'
  },
  progress: {
    bgColor: 'red'
  }

})(() => relapse());

spx.on('load', (page) => {

  if (page.key === '/') {
    relapse.has() && relapse.destroy();
  } else if (!relapse.has()) {
    relapse();
  } else {
    relapse.reinit();
  }

});
