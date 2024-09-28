/* eslint-disable no-unused-vars */

import type { LiteralUnion } from 'type-fest';
import type { EventNames, EmitterArguments, Page } from 'types';
import { $ } from './session';
import { forEach, parse } from '../shared/utils';
import * as log from '../shared/logs';

/**
 * Emit Event
 *
 * Private function use for emitting events
 * which users are subscribed.
 */
export function emit<T extends EventNames> (name: T, ...args: EmitterArguments<T>) {

  const isCache = name === 'cache';
  const binding = name === 'disconnect' ? null : args.length === 1 ? args[0] : args.shift();

  // @ts-expect-error
  if (isCache) args[0] = parse(args[0] as any);

  let returns: boolean | string = true;

  forEach(argument => {

    const returned = argument.apply(binding, args);

    if (isCache) {
      if (returned instanceof Document) {
        returns = returned.documentElement.outerHTML;
      } else if (typeof returns !== 'string') {
        returns = returned !== false;
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
export const on = (name: LiteralUnion<EventNames, string>, callback?: () => void, scope?: any) => {

  if (!(name in $.events)) $.events[name] = [];

  return $.events[name].push(scope ? callback.bind(scope) : callback) - 1;

};

/**
 * Off Event
 *
 * Exposed as public method on `spx`
 */
export const off = (name: LiteralUnion<EventNames, string>, callback: (() => void) | number) => {

  if (name in $.events) {

    const events = $.events[name];

    if (events && typeof callback === 'number') {

      events.splice(callback, 1);
      log.debug(`Removed ${name} event listener (id: ${callback})`);

      if (events.length === 0) delete $.events[name];

    } else {

      const live = [];

      if (events && callback) {
        for (let i = 0, s = events.length; i < s; i++) {
          if (events[i] !== callback) {
            live.push(events[i]);
          } else if (name !== 'x') { // Do not log "x" events, they are internal
            log.debug(`Removed ${name} event listener (id: ${i})`);
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
    log.warn(`Unknown or invalid event listener: ${name}`);
  }

  return this;
};
