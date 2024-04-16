import type { Session, Selectors, Config, Hover, Progress, Intersect, Proximity, ComponentSession } from 'types';
import { m, o, p, s } from '../shared/native';

export const $: Session = o<Session>({
  index: '',
  eval: true,
  patched: false,
  loaded: false,
  logLevel: 2,
  qs: o<Selectors>(),
  config: o<Config>({
    fragments: [ 'body' ],
    timeout: 30000,
    globalThis: true,
    schema: 'spx-',
    manual: false,
    logLevel: 2,
    cache: true,
    components: null,
    maxCache: 100,
    reverse: true,
    preload: null,
    annotate: false,
    eval: o({
      script: null,
      style: null,
      link: null,
      meta: false
    }),
    hover: o<Hover>({
      trigger: 'href',
      threshold: 250
    }),
    intersect: o<Intersect>({
      rootMargin: '0px 0px 0px 0px',
      threshold: 0
    }),
    proximity: o<Proximity>({
      distance: 75,
      threshold: 250,
      throttle: 500
    }),
    progress: o<Progress>({
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
  fragments: m(),
  components: o<ComponentSession>({
    $registry: m(),
    $instances: m(),
    $connected: s(),
    $elements: m(),
    $cached: m(),
    $reference: p({ get: (target, key: string) => $.components.$instances.get(target[key]) })
  }),
  events: o(),
  observe: o(),
  memory: o(),
  pages: o(),
  snaps: o(),
  resources: s()
});
