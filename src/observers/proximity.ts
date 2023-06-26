import { config, observers } from '../app/session';
import { getTargets } from '../shared/links';
import { isNumber } from '../shared/regexp';
import { log } from '../shared/utils';
import { getRoute } from '../app/location';
import { emit } from '../app/events';
import * as store from '../app/store';
import * as request from '../app/fetch';
import { EventType, Errors } from '../shared/enums';
import { IProximity } from 'types';
import { pointer } from '../shared/native';

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
  const attr = target.getAttribute(config.selectors.proximity);
  const distance = isNumber.test(attr) ? Number(attr) : (config.proximity as IProximity).distance;

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

  let wait = false;

  // console.log(targets);

  return function (event: MouseEvent) {

    if (wait) return;

    wait = true;

    const node = targets.findIndex(node => inRange(event, node));

    if (node === -1) {

      setTimeout(() => { wait = false; }, (config.proximity as IProximity).throttle);

    } else {

      const { target } = targets[node];
      const page = store.create(getRoute(target, EventType.PROXIMITY));
      const delay = page.threshold || (config.proximity as IProximity).threshold;

      request.throttle(page.key, async () => {

        if (!emit('prefetch', target, page)) return disconnect();

        const prefetch = await request.fetch(page);

        if (prefetch) {

          targets.splice(node, 1);

          wait = false;

          if (targets.length === 0) {
            disconnect();
            log(Errors.INFO, 'Proximity observer disconnected');
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

  if (!config.proximity || observers.proximity) return;

  const targets = getTargets(config.selectors.proximity).map(setBounds);

  if (targets.length > 0) {

    entries = observer(targets);
    addEventListener(`${pointer}move`, entries, { passive: true });
    observers.proximity = true;

  }

}

/**
 * Stops prefetch, will remove pointer move event listener
 */
export function disconnect (): void {

  if (!observers.proximity) return;

  removeEventListener(`${pointer}move`, entries);

  observers.proximity = false;

};
