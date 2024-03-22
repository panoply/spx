import spx from 'spx';

export class ScrollSpy extends spx.Component<typeof ScrollSpy.define> {

  static define = {
    state: {
      threshold: Number,
      rootMargin: {
        typeof: String,
        default: '0px'
      }
    },
    nodes: <const>[
      'anchor'
    ]
  };

  /**
   * Stimulus: Initialize
   */
  connect () {
    this.anchors = [];
    this.options = {
      rootMargin: this.rootMarginValue,
      threshold: this.thresholdValue
    };
  }

  /**
   * Stimulus: Connect
   */
  onmount () {

    for (const a of this.anchorTargets) {
      const anchor = a.href.slice(a.href.lastIndexOf('#'));
      const element = this.dom.querySelector(anchor) as HTMLHeadingElement;
      if (this.dom.contains(element)) {
        this.anchors.push(element);
        a.onclick = () => {
          setTimeout(() => {
            this.anchorTargets.forEach(j => j.classList.remove(this.activeClass));
            a.classList.add(this.activeClass);
          }, 300);
        };
      }
    }

    if (window.scrollY < 10) {
      this.anchorTargets[0]?.classList.add(this.activeClass);
    } else {
      this.onScroll();
    }

    window.onscroll = this.onScroll;
  }

  /**
   * Stimulus: Disconnect
   */
  unmount (): void {

    this.anchors = [];

  }

  onScroll = () => {

    this.anchors.forEach((v, i) => {

      const next = v.getBoundingClientRect().y - 50;

      if (next < window.screenY) {
        this.anchorTargets.forEach(j => j.classList.remove(this.activeClass));
        this.anchorTargets[i].classList.add(this.activeClass);
      }
    });
  };

  /* -------------------------------------------- */
  /* TYPE VALUES                                  */
  /* -------------------------------------------- */

  active: HTMLHeadingElement;
  anchors: HTMLHeadingElement[];
  /**
   * Intersection Observer
   */
  observer: IntersectionObserver;
  /**
   * Itersection Observer Options
   */
  options: IntersectionObserverInit;
  /**
   * Stimulus: The Intersection Observer root margin value
   */
  rootMarginValue: string;
  /**
   * Stimulus: The intersection Observer threshold value
   */
  thresholdValue: number;

  /* -------------------------------------------- */
  /* TARGETS                                      */
  /* -------------------------------------------- */

  /**
   * Stimulus: The first matching viewport target
   */
  headings: HTMLHeadingElement[];
  /**
   * Stimulus: All viewport targets
   */
  anchorTargets: HTMLLinkElement[];

  /* -------------------------------------------- */
  /* TYPE CLASSES                                 */
  /* -------------------------------------------- */

  /**
   * Stimulus: The url anchor class to apply when intersecting
   */
  activeClass: string;

}
