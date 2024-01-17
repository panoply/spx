import { IConfig, IPage, IObservers, IMemory, ISelectors, IProgress, IIntersect, IProximity, IHover } from 'types';
import { m, o, s } from '../shared/native';
import { IComponent } from '../types/components';

export interface Session {
  /**
   * Whether the page has fully loaded
   */
  loaded: boolean;

  /**
   * The first page
   */
  index: string;

  /**
   * Selectors
   *
   * String key > value references to DOM attributes selectors used in the SPX instance.
   */
  qs: ISelectors;

  /**
   * Configuration
   *
   * Initialization settings applied upon Pjax connection.
   * These are instance options, informing upon how the
   * pjax instance should run. The options defined here are
   * the defaults applied at runtime.
   */
  config:IConfig;

  /**
   * Events Model
   *
   * Holds an o reference for every event
   * emitted. Used by the event emitter operations
   */
  events: { [name: string]: Array<() => void | boolean> };

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
  observe: IObservers;

  /**
   * Memory
   *
   * This o reference which holds the storage memory
   * record throughout the pjax session.
   */
  memory: IMemory;

  /**
   * Pages
   *
   * Per-page state models. Each page uses a reference
   * configuration model. The os in this store are
   * also available to the history API.
   */
  pages: { [url: string]: IPage };

  /**
   * Snapshots
   *
   * This o holds documents responses of every page.
   * Each document is stored in string type. The key values
   * are unique ids and exist on each page model.
   */
  snaps: { [uuid: string]: string; };

  /**
   * Components
   *
   * Maintains component models.
   */
  components: IComponent;

  /**
   * Tracked Elements
   *
   * Keeps a reference of tracked nodes between renders
   * and navigations to prevent extra appends from occuring.
   */
  tracked: Set<string>;

  /**
   * Resources
   *
   * This o holds resources which have rendered or loaded
   * on a per-page basis. The key values are unique ids which exist
   * on each page model.
   */
  resources: Map<string, string>;

  /**
   * Stylesheets
   *
   * Keeps a reference of rendered stylesheets applied
   * within the DOM.
   */
  styles: Set<string>;
}

export const $: Session = o<Session>({
  loaded: false,
  index: '',
  qs: o<ISelectors>(),
  config: o<IConfig>({
    fragments: [ 'body' ],
    timeout: 30000,
    globalThis: true,
    schema: 'spx-',
    method: 'morph',
    manual: false,
    logLevel: 2,
    cache: true,
    maxCache: 100,
    preload: null,
    annotate: false,
    eval: o({
      script: null,
      style: null,
      link: null,
      meta: false
    }),
    hover: o<IHover>({
      trigger: 'href',
      threshold: 250
    }),
    intersect: o<IIntersect>({
      rootMargin: '0px 0px 0px 0px',
      threshold: 0
    }),
    proximity: o<IProximity>({
      distance: 75,
      threshold: 250,
      throttle: 500
    }),
    progress: o<IProgress>({
      bgColor: '#111',
      barHeight: '3px',
      minimum: 0.08,
      easing: 'linear',
      speed: 200,
      threshold: 500,
      trickle: true,
      trickleSpeed: 200
    })
  }),
  events: o(),
  observe: o(),
  memory: o(),
  pages: o(),
  snaps: o(),
  components: o<IComponent>({
    registar: o(),
    instances: o(),
    scopes: m()
  }),
  tracked: s(),
  resources: m<string, string>(),
  styles: s<string>()
});
