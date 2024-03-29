import type { Proximity } from 'types';
import { $ } from '../app/session';
import { getTargets } from '../shared/links';
import { isNumber } from '../shared/regexp';
import { log } from '../shared/logs';
import { getRoute } from '../app/location';
import { emit } from '../app/events';
import { VisitType, LogType } from '../shared/enums';
import { pointer } from '../shared/native';
import * as q from '../app/queries';
import * as request from '../app/fetch';

/**
 * Detects if the cursor (mouse) is in range of a target element.
 */
function inRange ({ clientX, clientY }: MouseEvent, bounds: {
  top: number;
  bottom: number;
  left: number;
  right: number;
}) {

  return clientX <= bounds.right &&
    clientX >= bounds.left &&
    clientY <= bounds.bottom &&
    clientY >= bounds.top;
}

function setBounds (target: HTMLLinkElement) {

  const rect = target.getBoundingClientRect();
  const attr = target.getAttribute($.qs.$proximity);
  const distance = isNumber.test(attr) ? Number(attr) : ($.config.proximity as Proximity).distance;

  return {
    target,
    top: rect.top - distance,
    bottom: rect.bottom + distance,
    left: rect.left - distance,
    right: rect.right + distance
  };

}

/**
 * Observes mouse movements and awaiting for the mouse to enter
 * bounds. Once within distance a fetch is triggered.
 */
function observer (targets?: {
  target: Element,
  top: number;
  bottom: number;
  left: number;
  right: number;
}[]) {

  let wait: boolean = false;

  // console.log(targets);

  return (event: MouseEvent) => {

    if (wait) return;

    wait = true;

    const node = targets.findIndex(node => inRange(event, node));

    if (node === -1) {

      setTimeout(() => { wait = false; }, ($.config.proximity as Proximity).throttle);

    } else {

      const { target } = targets[node];
      const page = q.create(getRoute(target, VisitType.PROXIMITY));
      const delay = page.threshold || ($.config.proximity as Proximity).threshold;

      request.throttle(page.key, async () => {

        if (!emit('prefetch', target, page)) return disconnect();

        const prefetch = await request.fetch(page);

        if (prefetch) {

          targets.splice(node, 1);

          wait = false;

          if (targets.length === 0) {
            disconnect();
            log(LogType.INFO, 'Proximity observer disconnected');
          }
        }

      }, delay);

    }
  };
}

let entries: ReturnType<typeof observer>;

/**
 * Starts proximity prefetch, will parse all link nodes and
 * begin watching mouse movements.
 */
export function connect (): void {

  if (!$.config.proximity || $.observe.proximity) return;

  const targets = getTargets($.qs.$proximity).map(setBounds);

  if (targets.length > 0) {

    entries = observer(targets);
    addEventListener(`${pointer}move`, entries, { passive: true });
    $.observe.proximity = true;

  }

}

/**
 * Stops prefetch, will remove pointer move event listener
 */
export function disconnect (): void {

  if (!$.observe.proximity) return;

  removeEventListener(`${pointer}move`, entries);

  $.observe.proximity = false;

};
