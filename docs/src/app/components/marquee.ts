/* eslint-disable no-use-before-define */
import spx from 'spx';
import embla, { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import autoscroll from 'embla-carousel-auto-scroll';

export class Marquee extends spx.Component<typeof Marquee.define> {

  public slidesNode: HTMLElement;
  public carousel: EmblaCarouselType;

  static define = {
    state: {
      speed: {
        typeof: Number,
        default: 0.5
      },
      stopOnMouseEnter: Boolean,
      stopOnInteraction: Boolean
    }
  };

  get options () {
    return <EmblaOptionsType>{
      dragFree: true,
      loop: true,
      skipSnaps: true,
      containScroll: 'keepSnaps',
      startIndex: 0
    };
  }

  onmount (): void {

    this.carousel = embla(this.slidesNode, this.options, [
      autoscroll({
        playOnInit: true,
        speed: 0.5,
        stopOnMouseEnter: this.state.stopOnMouseEnter,
        stopOnInteraction: this.state.stopOnInteraction
      })
    ]);

  }

  unmount () {
    this.carousel.destroy();
  }

}
