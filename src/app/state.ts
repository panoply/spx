import { IConfig, IPage, ISelectors } from 'types';
import { create } from '../constants/native';

/**
 * Connects
 *
 * Determines the connection of various observers
 * and logic required for the Pjax instance.
 *
 * 1. Controller
 * 2. History
 * 3. Href
 * 4. Hover
 * 5. Intersect
 * 6. Scroll
 * 7. Proximity
 */
export const connect: Set<1 | 2 | 3 | 4 | 5 | 6 | 7> = new Set();

/**
 * Selectors
 *
 * String `key > value` references to DOM attributes
 * selectors used in the Pjax instance.
 */
export const selectors: ISelectors = create(null);

/**
 * Pages
 *
 * Per-page state models. Each page uses a reference
 * configuration model. The objects in this store are
 * also available to the history API.
 */
export const pages: { [url: string]: IPage } = create(null);

/**
 * Snapshots
 *
 * This object holds documents responses of every page.
 * Each document is stored in string type. The key values
 * are unique ids generated using nanoid.
 */
export const snaps: { [snapshot: string]: string } = create(null);

/**
 * Configuration
 *
 * Initialization settings applied upon Pjax connection.
 * These are instance options, informing upon how the
 * pjax instance should run. The options defined here are
 * the defaults applied at runtime.
 */
export const config: IConfig = {
  targets: [ 'body' ],
  timeout: 30000,
  poll: 15,
  schema: 'pjax',
  async: true,
  cache: true,
  reverse: true,
  limit: 25,
  preload: null,
  mouseover: {
    trigger: 'attribute',
    threshold: 250
  },
  intersect: {
    rootMargin: '0px 0px 0px 0px',
    threshold: 0
  },
  proximity: {
    distance: 75,
    threshold: 250,
    throttle: 500
  },
  progress: {
    threshold: 850,
    minimum: 0.1,
    speed: 225,
    trickle: true,
    colour: '#111',
    height: '2px',
    easing: 'ease'
  }
};
