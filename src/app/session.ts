import type { Session } from 'types';
import { m, o, p, s } from '../shared/native';

export const $: Session = {
  index: '',
  eval: true,
  patched: false,
  loaded: false,
  logLevel: 2,
  qs: o(),
  config: {
    fragments: [ 'body' ],
    timeout: 30000,
    globalThis: true,
    schema: 'spx-',
    logLevel: 3,
    cache: true,
    components: null,
    maxCache: 100,
    reverse: true,
    preload: null,
    annotate: false,
    eval: {
      script: null,
      style: null,
      link: null,
      meta: false
    },
    hover: {
      trigger: 'href',
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
      bgColor: '#111',
      barHeight: '3px',
      minimum: 0.08,
      easing: 'linear',
      speed: 200,
      threshold: 500,
      trickle: true,
      trickleSpeed: 200
    }
  },
  fragments: m(),
  components: {
    $mounted: s(),
    $registry: m(),
    $instances: m(),
    $reference: p({
      get: (
        map: Record<string, string>,
        key: string
      ) => $.components.$instances.get(map[key])
    })
  },
  events: o(),
  observe: o(),
  memory: o(),
  pages: o(),
  snaps: o(),
  resources: s()
};
