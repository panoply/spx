import spx from 'spx';

export class ScrollSpy extends spx.Component<typeof ScrollSpy.define> {

  static define = {
    id: 'scrollspy',
    state: {
      threshold: Number,
      rootMargin: {
        typeof: String,
        default: '0px'
      }
    },
    nodes: <const>[
      'href',
      'anchor'
    ]
  };

  /**
   * Stimulus: Initialize
   */
  connect () {

    this.anchors = [];
    this.options = {
      rootMargin: this.state.rootMargin,
      threshold: this.state.threshold
    };

  }

  /**
   * Stimulus: Connect
   */
  onmount () {

    this.dom.hrefNode.classList.add('fc-blue');

    for (const a of this.dom.hrefNodes) {
      this.anchors.push(a.href.slice(a.href.lastIndexOf('#') + 1));
      a.onclick = () => {
        setTimeout(() => {
          this.dom.hrefNodes.forEach(j => j.classList.remove('fc-blue'));
          a.classList.add('fc-blue');
        }, 300);
      };

    }

    this.onScroll();

    window.onscroll = this.onScroll;
  }

  /**
   * Stimulus: Disconnect
   */
  unmount (): void {

    this.anchors = [];

  }

  onScroll = () => {

    this.dom.anchorNodes.filter(a => {
      return this.anchors.includes(a.id);
    }).forEach((v, i) => {

      v.style.paddingTop = '50px';

      const next = v.getBoundingClientRect().top;

      if (next < window.screenY && this.dom.hrefNodes[i]) {

        this.dom.hrefNodes.forEach(j => j.classList.remove('fc-blue'));
        this.dom.hrefNodes[i].classList.add('fc-blue');

      }
    });
  };

  /* -------------------------------------------- */
  /* TYPE VALUES                                  */
  /* -------------------------------------------- */

  anchors: string[];
  observer: IntersectionObserver;
  options: IntersectionObserverInit;

}
