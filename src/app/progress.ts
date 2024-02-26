import { d } from '../shared/native';
import { glue } from '../shared/utils';
import { IProgress } from '../types/options';
import { $ } from './session';

function Progress () {

  /**
   * Pending Queue
   */
  const pending: Array<(update?: () => void) => void> = [];

  /**
   * Progress Element
   */
  const node = document.createElement('div');

  /**
   * Progress Status
   */
  let status = null;

  /**
   * Progress Status
   */
  let timeout: number;

  /**
   * Progress Element
   */
  let element: HTMLDivElement = null;

  /**
   * Progress Style
   *
   * Customize the inline CSS styling of the progress bar node.
   */
  const style = ({ bgColor, barHeight, speed, easing }: IProgress) => {

    node.style.cssText = glue(
      'pointer-events:none;',
      `background-color:${bgColor};`,
      `height:${barHeight};`,
      'position:fixed;',
      'display:block;',
      'z-index:2147483647;',
      'top:0;',
      'left:0;',
      'width:100%;',
      'will-change:opacity,transform;',
      `transition:transform ${speed}ms ${easing};`
    );

  };

  /**
   * Progress Percent
   *
   * Converts a percentage (`0..1`) to a bar translateX percent (`-100%..0%`).
   */
  const percent = (n: number) => (-1 + n) * 100;

  /**
   * Current
   *
   * Utility clamp for min/max values
   */
  const current = (n: number, min: number, max: number) => n < min ? min : n > max ? max : n;

  /**
   * Render Progress
   *
   * Renders the progress bar element node to the DOM.
   */
  const render = (): HTMLDivElement => {

    if (element) return element;

    node.style.setProperty('transform', `translateX(${percent(status || 0)}%)`);
    element = d().appendChild(node);

    return node;

  };

  /**
   * Removes the element. Opposite of render().
   */
  const remove = () => {

    const dom = d();

    if (dom.contains(element)) {

      const animate = element.animate(
        { opacity: [ '1', '0' ] },
        { easing: 'ease-out', duration: 100 }
      );

      animate.onfinish = () => {
        dom.removeChild(element);
        element = null;
      };

    } else {

      element = null;

    }

  };

  /**
   * Dequeue
   *
   * Dequeue pending update callbacks
   */
  const dequeue = () => {

    const update = pending.shift();

    if (update) update(dequeue);

  };

  /**
   * Enqueue
   *
   * Queue execution for the progress bar
   */
  const enqueue = (call: any) => {

    pending.push(call);

    if (pending.length === 1) dequeue();

  };

  /**
   * Sets the progress bar status, where `amount` is a number from `0.0` to `1.0`.
   */
  const set = (amount: number) => {

    amount = current(amount, $.config.progress.minimum, 1);
    status = amount === 1 ? null : amount;

    const progress = render();

    enqueue((update: () => void) => {

      progress.style.setProperty('transform', `translateX(${percent(amount)}%)`);

      if (amount === 1) {
        setTimeout(() => {
          remove();
          update();
        }, $.config.progress.speed * 2);
      } else {
        setTimeout(update, $.config.progress.speed);
      }

    });

  };

  /**
   * Progress Increment
   *
   * Increments by a random amount.
   */
  const inc = (amount?: number) => {

    let n = status;

    if (!n) return start();

    if (n < 1) {

      if (typeof amount !== 'number') {

        // Incremental offsets in randomised float
        // Credit: https://github.com/rstacruz/nprogress
        //
        if (n >= 0 && n < 0.2) amount = 0.1;
        else if (n >= 0.2 && n < 0.5) amount = 0.04;
        else if (n >= 0.5 && n < 0.8) amount = 0.02;
        else if (n >= 0.8 && n < 0.99) amount = 0.005;
        else amount = 0;
      }

      n = current(n + amount, 0, 0.994);

      return set(n);

    }
  };

  /**
   * Progress Trickle
   *
   * Increments by a random amount.
   */
  const doTrickle = () => {

    setTimeout(() => {

      if (!status) return;

      inc();
      doTrickle();

    }, $.config.progress.trickleSpeed);

  };

  /**
   * Begin Progress
   *
   * Shows the progress bar. This is the same as setting the status to 0%,
   * except that it doesn't go backwards.
   */
  function start (threshold?: number) {

    if (!$.config.progress) return;

    timeout = setTimeout(() => {

      if (!status) set(0);
      if ($.config.progress.trickle) doTrickle();

    }, threshold || 0);

  };

  /**
   * Progress Done
   *
   * Hides the progress bar. This is the *sort of* the same as
   * setting the status to 100%, with the difference being `done()`
   * makes some placebo effect of some realistic motion.
   *
   * > If `true` is passed, it will show the progress bar even if its hidden.
   */
  function done (force?: boolean) {

    clearTimeout(timeout);

    if (!force && !status) return;

    inc(0.3 + 0.5 * Math.random());
    set(1);

  };

  return { start, done, style };
}

export const progress = Progress();
