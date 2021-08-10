import { supportsPointerEvents } from 'detect-it';
import { dispatchEvent } from '../app/events';
import { getLink, attrparse } from '../app/utils';
import { Common } from '../constants/common';
import { store } from '../app/store';
import * as path from '../app/path';
import { y0x0 } from './scroll';
import * as request from '../app/request';
import * as render from '../app/render';
import { updateState } from './history';
import { IPage } from '../types';

/**
 * Handles a clicked link, prevents special click types.
 */
function linkEvent (event: MouseEvent): boolean {

  // @ts-ignore
  return !((event.target && event.target.isContentEditable) ||
    event.defaultPrevented ||
    event.which > 1 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey);

};

/**
 * Triggers click events
 *
 * @param {Element} target
 * @returns {(state: clickState) => (event: MouseEvent) => void}
 */
function handleClick (target: Element): (
  state: any
) => (
  event: MouseEvent
) => void | Promise<void> {

  return (state: any) => function click (event: MouseEvent): void | Promise<void> {

    event.preventDefault();
    target.removeEventListener('click', click, false);
    render.capture(updateState()); // PRESERVE CURRENT PAGE

    return typeof state === 'object'
      ? render.update(state)
      : typeof state === 'string'
        ? navigate(state)
        : location.assign(path.url);
  };

};

/**
 * Triggers a page fetch
 *
 * @param {MouseEvent} event
 * @returns {void}
 */
function handleTrigger (event: MouseEvent): void {

  if (!linkEvent(event)) return undefined;

  const target = getLink(event.target, Common.Link);

  if (!target) return undefined;
  if (!dispatchEvent('pjax:trigger', { target }, true)) return undefined;

  const { url, location } = path.get(target, true);
  const click = handleClick(target);

  if (request.transit.has(url)) {

    target.addEventListener('click', click(url), false);

  } else {

    const state = attrparse(target, { url, location, position: y0x0() });

    if (store.has(url, { snapshot: true })) {
      target.addEventListener('click', click(store.update(state)), false);
    } else {
      request.get(state); // TRIGGERS FETCH
      target.addEventListener('click', click(url), false);
    }
  }

};

let connected: boolean = false;

/**
 * Executes a pjax navigation.
 */
export async function navigate (
  url: string,
  state: IPage | false = false
): Promise<void> {

  if (state) {

    if (typeof state.cache === 'string') {
      state.cache === 'clear'
        ? store.clear()
        : store.clear(url);
    }

    const page = await request.get(state);
    if (page) return render.update(page);

  } else {

    if ((await request.inFlight(url))) {
      return render.update(store.get(url).page);
    } else {
      request.cancel(url);
    }
  }

  return location.assign(url);

};

/**
 * Attached `click` event listener.
 *
 * @returns {void}
 */
export function start ():void {

  if (!connected) {

    if (supportsPointerEvents) {
      addEventListener('pointerdown', handleTrigger, false);
    } else {
      addEventListener('mousedown', handleTrigger, false);
      addEventListener('touchstart', handleTrigger, false);
    }

    connected = true;

  }
}

/**
 * Removed `click` event listener.
 */
export function stop (): void {

  if (connected) {

    if (supportsPointerEvents) {
      removeEventListener('pointerdown', handleTrigger, false);
    } else {
      removeEventListener('mousedown', handleTrigger, false);
      removeEventListener('touchstart', handleTrigger, false);
    }

    connected = false;

  }
}
