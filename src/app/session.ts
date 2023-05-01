import { IConfig, IPage, IObservers, IMemory } from 'types';
import { object } from '../shared/native';
import { defaults } from './defaults';

/**
 * Configuration
 *
 * Initialization settings applied upon Pjax connection.
 * These are instance options, informing upon how the
 * pjax instance should run. The options defined here are
 * the defaults applied at runtime.
 */
export const config: IConfig = defaults();

/**
 * Observers
 *
 * Determines the connection of various observers
 * and logic required for the SPX instance.
 *
 * - History
 * - Href
 * - Hover
 * - Intersect
 * - Scroll
 * - Proximity
 */
export const observers: IObservers = object(null);

/**
 * Memory
 *
 * This object reference which holds the storage memory
 * record throughout the pjax session.
 */
export const memory: IMemory = object(null);

/**
 * Pages
 *
 * Per-page state models. Each page uses a reference
 * configuration model. The objects in this store are
 * also available to the history API.
 */
export const pages: { [url: string]: IPage } = object(null);

/**
 * Snapshots
 *
 * This object holds documents responses of every page.
 * Each document is stored in string type. The key values
 * are unique ids generated using nanoid.
 */
export const snapshots: Map<string, string> = new Map();

/**
 * Tracked Elements
 *
 * Keeps a reference of tracked nodes between renders
 * and navigations to prevent extra appends from occuring.
 */
export const tracked: Set<string> = new Set();

/**
 * Stylesheets
 *
 * Keeps a reference of rendered stylesheets applied
 * within the DOM.
 */
export const stylesheets: Set<string> = new Set();
