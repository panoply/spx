import spx from 'spx';
import papyrus from 'papyrus';

export class Logger extends spx.Component({
  nodes: <const>[
    'event',
    'page',
    'input',
    'components'
  ],
  state: {
    count: Number
  }
}) {

  getScopes () {

    const model = {
      instances: {},
      scopes: {}
    };

    for (const [ id, { scope } ] of spx.$.instances) {
      if (!(id in model)) model.scopes[id] = [];
      model.scopes[id].push(scope);
      if (!(scope.instanceOf in model.instances)) {
        model.instances[scope.instanceOf] = [];
      }

      model.instances[scope.instanceOf].push(id);
    }

    papyrus.mount(this.componentsNode, {
      input: JSON.stringify(model.instances, null, 2),
      language: 'javascript',
      readOnly: true
    });

  }

  connect () {

    this.eventNode.style.height = `${this.eventNode.parentElement.clientHeight}px`;
    this.components = JSONTree.create({}, this.componentsNode);
    this.pages = JSONTree.create({}, this.pageNode);
    this.pages.loadData(spx.$.page);
    this.log(this.eventNode, 'connected', spx.$.page.key, 'fc-cyan');
    this.getScopes();

    spx.on('load', (page) => {
      this.log(this.eventNode, 'load', page.key, 'fc-cyan');
      this.pages.loadData(page);
      this.getScopes();

    });

    spx.on('prefetch', (_, page) => this.log(this.eventNode, 'prefetch', page.key, 'fc-green'));
    spx.on('visit', () => this.log(this.eventNode, 'visit', 'event', 'fc-purple'));
    spx.on('fetch', (page) => {
      if (page.type === spx.$.types.REVERSE) {
        this.log(this.eventNode, 'reverse fetch', page.key, 'fc-blue');
      }
    });
  }

  /**
   * Rolling logs which will print the hook messages
   */
  log (log: HTMLElement, hook: string, message: string, color: string) {

    const element = document.createElement('div');
    element.className = `d-block pb-1 message ${color}`;
    element.ariaLabel = `${++this.state.count}`;
    element.innerHTML = `<span class="ff-code ${color}">${hook}</span> ${message}`;

    log.appendChild(element);
    log.scrollTop = log.parentElement.scrollHeight;

  }

  public eventNode: HTMLElement;

}
