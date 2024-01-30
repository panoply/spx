import { Application } from '@hotwired/stimulus';
import { Tabs } from './components/tabs';
import { Session } from './components/session';
import { Drawer } from './components/drawer';
import { Examples } from './components/examples';
import { Dropdown } from './components/dropdown';
import { IFrame } from './components/iframe';
import { Sidebar } from './components/sidebar';
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
    logLevel: 1,
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
      Sidebar,
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


});



