import { Tabs } from './components/tabs';
import { Session } from './components/session';
import { Drawer } from './components/drawer';
import { Dropdown } from './components/dropdown';
import { IFrame } from './components/iframe';
import { Sidebar } from './components/sidebar';
import spx from 'spx';
import relapse from 'relapse';
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
  Foo,
  Sidebar,
  Bar,
  Test,
  Session,
  Drawer,
  IFrame,
  Tabs
);

spx.connect(
  {
    fragments: [
      '#content'
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
)(function () {

});
