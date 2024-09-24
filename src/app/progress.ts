import type { Progress } from 'types';
import { $ } from './session';
import { b } from '../shared/native';

export const progress = (() => {

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
  let timeout: NodeJS.Timeout;

  /**
    * Progress Element
    */
  let element: HTMLDivElement = null;

  /**
   * Customize the inline CSS styling of the progress bar node.
   */
  const style = ({ bgColor, barHeight, speed, easing }: Progress) => {

    node.style.cssText = 'pointer-events:none;' +
    `background:${bgColor};` +
    `height:${barHeight};` +
    'position:fixed;' +
    'display:block;' +
    'z-index:2147483647;' +
    'top:0;' +
    'left:0;' +
    'width:100%;' +
    'will-change:opacity,transform;' +
    `transition:${speed}ms ${easing};`;

  };

  /**
   * Converts a percentage (`0..1`) to a bar translateX percent (`-100%..0%`).
   */
  const percent = (n: number) => (-1 + n) * 100;

  /**
   * Utility clamp for min/max values
   */
  const current = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  /**
   * Renders the progress bar element node to the DOM.
   */
  const render = (): HTMLDivElement => {
    if (element) return element;
    node.style.transform = `translateX(${percent(status || 0)}%)`;
    element = b().appendChild(node);
    return node;
  };

  /**
   * Removes the element. Opposite of render().
   */
  const remove = () => {

    const dom = b();

    if (dom.contains(element)) {

      element.animate(
        { opacity: [ '1', '0' ] },
        { easing: 'ease-out', duration: 100 }
      ).onfinish = () => {

        dom.removeChild(element);
        element = null;

      };

    } else {

      element = null;

    }

  };

  /**
   * Dequeue pending update callbacks
   */
  const dequeue = () => {
    const update = pending.shift();
    if (update) update(dequeue);
  };

  /**
   * Queue execution for the progress bar
   */
  const enqueue = (call: any) => {
    pending.push(call);
    pending.length === 1 && dequeue();
  };

  /**
   * Sets the progress bar status, where `amount` is a number from `0.0` to `1.0`.
   */
  const set = (amount: number) => {

    amount = current(amount, $.config.progress.minimum, 1);
    status = amount === 1 ? null : amount;
    const progress = render();

    enqueue((update: () => void) => {
      progress.style.transform = `translateX(${percent(amount)}%)`;
      setTimeout(() => amount === 1 ? (
        remove(),
        update()
      ) : update(), $.config.progress.speed * (amount === 1 ? 2 : 1));
    });

  };

  /**
   * Increments by a random amount.
   */
  const inc = (amount?: number) => {

    if (!status) return start();
    if (status < 1) {
      if (!amount) amount = status < 0.2 ? 0.1 : status < 0.5 ? 0.04 : status < 0.8 ? 0.02 : 0.005;
      set(current(status + amount, 0, 0.994));
    }
  };

  /**
   * Increments by a random amount.
   */
  const doTrickle = () => setTimeout(() => status && (inc(), doTrickle()), $.config.progress.trickleSpeed);

  /**
   * Shows the progress bar. This is the same as setting the status to 0%,
   * except that it doesn't go backwards.
   */
  const start = (threshold?: number) => {

    if (!$.config.progress) return;

    timeout = setTimeout(() => {
      if (!status) set(0);
      $.config.progress.trickle && doTrickle();
    }, threshold || 0);

  };

  /**
   * Hides the progress bar. This is the *sort of* the same as
   * setting the status to 100%, with the difference being `done()`
   * makes some placebo effect of some realistic motion.
   *
   * > If `true` is passed, it will show the progress bar even if its hidden.
   */
  const done = (force?: boolean) => {

    clearTimeout(timeout);

    if (!force && !status) return;

    inc(0.3 + 0.5 * Math.random());
    set(1);

  };

  return { start, done, style };

})();
