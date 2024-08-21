import spx from 'spx';
import relapse from 'relapse';
import { Marquee } from './components/marquee';
import { Drawer } from './components/drawer';
import { Dropdown } from './components/dropdown';
import { Search } from './components/search';
import { ScrollSpy } from './components/scrollspy';

spx({
  fragments: [
    'content',
    'menu'
  ],
  components: {
    Dropdown,
    Drawer,
    Search,
    ScrollSpy,
    Marquee
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
