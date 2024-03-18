import spx from 'spx';
import relapse from 'relapse';
import { Drawer } from './components/drawer';
import { Dropdown } from './components/dropdown';
import { IFrame } from './components/iframe';
import { Search } from './components/search';
import { Modal } from './examples/modal';

import { Counter } from './tutorial/counter';
import { Tabs } from './tutorial/tabs';

spx.connect({
  fragments: [
    'content',
    'menu'
  ],
  components: {
    Dropdown,
    Modal,
    Drawer,
    IFrame,
    Tabs,
    Search,
    Counter
  },
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
