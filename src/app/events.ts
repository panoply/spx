/* eslint-disable no-unused-vars */

import type { LiteralUnion } from 'type-fest';
import type { EventNames, EmitterArguments } from 'types';
import { $ } from './session';
import { forEach } from '../shared/utils';
import { log } from '../shared/logs';
import { parse } from '../shared/dom';
import { Log } from '../shared/enums';

/**
 * Emit Event
 *
 * Private function use for emitting events
 * which users are subscribed.
 */
export function emit<T extends EventNames> (name: LiteralUnion<T, string>, ...args: EmitterArguments<T>) {

  const isCache = name === 'before:cache';

  if (isCache) args[1] = parse(args[1] as any);

  let returns: boolean | string = true;

  forEach(argument => {

    const returned = argument.apply(null, args);

    if (isCache) {
      if (returned instanceof Document) {
        returns = returned.documentElement.outerHTML;
      } else {
        if (typeof returns !== 'string') returns = returned !== false;
      }
    } else {
      returns = returned !== false;
    }
  }, $.events[name] || []);

  return returns;

}

/**
 * On Event
 *
 * Exposed as public method on `spx`
 */
export function on (name: LiteralUnion<EventNames, string>, callback?: () => void, scope?: any) {

  if (!(name in $.events)) $.events[name] = [];

  return $.events[name].push(scope ? callback.bind(scope) : callback) - 1;

}

/**
 * Off Event
 *
 * Exposed as public method on `spx`
 */
export function off (name: LiteralUnion<EventNames, string>, callback: (() => void) | number) {

  if (name in $.events) {

    const events = $.events[name];

    if (events && typeof callback === 'number') {

      events.splice(callback, 1);
      log(Log.INFO, `Removed ${name} event listener (id: ${callback})`);
      if (events.length === 0) delete $.events[name];

    } else {

      const live = [];

      if (events && callback) {
        for (let i = 0, s = events.length; i < s; i++) {
          if (events[i] !== callback) {
            live.push(events[i]);
          } else if (name !== 'x') { // Do not log "x" events, they are internal
            log(Log.INFO, `Removed ${name} event listener (id: ${i})`);
          }
        }
      }

      if (live.length) {
        $.events[name] = live;
      } else {
        delete $.events[name];
      }
    }

  } else {
    log(Log.WARN, `There are no ${name} event listeners`);
  }

  return this;
}
