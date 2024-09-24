import m from 'mithril';
import { state, DataScope, Data } from './state';

const { keys, values } = Object;

const color = (value: any) => {
  if (typeof value === 'string') {
    return '.string';
  } else if (typeof value === 'number') {
    return '.number';
  } else if (typeof value === 'boolean') {
    return '.boolean';
  } else if (value === null) {
    return '.boolean';
  }
};

const status = (input: number) => [
  'CONNNECT',
  'MOUNT',
  'MOUNTED',
  'UNMOUNT',
  'UNMOUNTED'
][input - 1];

/**
 * Reference Component Model
 */
const Reference: m.Component<{ scope: DataScope }> = {
  view: ({
    attrs: {
      scope: {
        reference
      }
    }
  }) => keys(reference).map(key => m(
    '.row.ai-center.px-2'
    , m(
      '.col-4.fs-sm.ff-code'
      , `${key}:`
    )
    , key === 'status' ? m(
      '.col.fs-xs.ff-code.d-flex.ai-center'
      , m(
        `span.${color(reference[key])}`
        , `${reference[key]}`
      )
      , m(
        'span.ff-code.fc-gray.fs-xs.pl-2'
        , ` - ${status(reference[key])}`
      )
    ) : m(
      `.col.fs-xs.ff-code${color(reference[key])}`
      , `${reference[key]}`
    )
  ))
};

/**
 * State Component Model
 */
const State: m.Component<{ scope: DataScope }> = {
  view: ({
    attrs: {
      scope: {
        state
      }
    }
  }) => keys(state).map(key => m(
    '.row.ai-center.px-2'
    , m(
      '.col-auto.fs-sm.ff-code'
      , `${key}:`
    )
    , m(
      `.col.fs-sm.ff-code${color(state[key])}`
      , `${state[key]}`
    )

  ))
};

/**
 * Nodes Component Model
 */
const Nodes: m.Component<{ scope: DataScope }> = {
  view: ({
    attrs: {
      scope: {
        nodes,
        reference
      }
    }
  }) => keys(nodes).length === 0 ? null : m(
    '.d-block.node-accordion'
    , keys(nodes).map(key => m(
      'details'
      , m(
        'summary.ai-center'
        , m(
          'span'
          , { style: { width: '70px' } }
          , key
        )
        , m(
          'span.fc-gray.fs-xs.mr-auto.ff-code'
          , ` - ${nodes[key].schema}`
        )
      )
      , m(
        '.d-block.py-3'
        ,
        keys(nodes[key]).map(node => m(
          '.row.ai-center.px-2'
          , m(
            '.col-3.fs-sm.ff-code'
            , `${node}:`
          )
          , m(
              `.col.fs-xs.ff-code${color(nodes[key][node])}`
              , `${nodes[key][node]}`
          )
        ))
      )
    ))
  )
};

/**
 * Bind Component Model
 */
const Binds: m.Component<{ scope: DataScope }> = {
  view: ({
    attrs: {
      scope: {
        binds
      }
    }
  }) => keys(binds).length === 0 ? null : m(
    '.node-accordion.bc-code'
    , keys(binds).map(key => m(
      'details.bc-code'
      , m(
        'summary.ai-center.pl-0'
        , m(
          'span.fc-orange.fs-sm.mr-auto.ff-code'
          , key
        )
      )
      , m(
        '.d-block.py-3'
        , m(
          '.pl-2.bc-code'
          , keys(binds[key]).map(bind => m(
            'details'
            , m(
              'summary.ai-center'
              , m(
                'span.pl-2'
                , bind
              )
            )
            , m(
              '.d-block.pt-3.px-3.bl.ml-1.bc-code.mb-3'
              , keys(binds[key][bind]).map(prop => m(
                '.row'
                , m(
                  '.col-3.fs-sm.ff-code'
                  , `${prop}:`
                )
                , m(
                  `.col.fs-xs.ff-code${color(binds[key][bind][prop])}`
                  , `${binds[key][bind][prop]}`
                )
              ))
            )
          ))
        )
      )
    ))
  )
};

/**
 * Events Component Model
 */
const Events: m.Component<{ scope: DataScope }> = {
  view: ({
    attrs: {
      scope: {
        reference,
        events
      }
    }
  }) => keys(events).length === 0 ? null : m(
    '.d-block.node-accordion'
    , keys(events).map(key => m(
      'details'
      , m(
        'summary.ai-center'
        , m(
          'span'
          , { style: { width: '70px' } }
          , `${key}`
        )
        , m(
          'span.fc-green.fs-xs.mr-auto.ff-code'
          , ` - ${events[key].method}()`
        )
      )
      , m(
        '.d-block.py-3'
        , keys(events[key]).filter(prop => (
          prop !== 'options' &&
          prop !== 'listener' &&
          prop !== 'params'
        )).map(prop => m(
          '.row.ai-center.px-2'
          , m(
            '.col-3.fs-sm.ff-code'
            , `${prop}:`
          )
          , m(
            `.col.fs-xs.ff-code${color(events[key][prop])}`
            , `${events[key][prop]}`
          )
        ))
      )
    ))
  )
};

export const Components = () => {

  setInterval(() => {
    state.get();
    m.redraw.sync();
  }, 500);

  const isActive = (scope: Data[string]) => values(scope).some((
    {
      reference
    }
  ) => (reference.status === 3));

  return {
    view: () => m(
      'section.explorer-accordion'
      , keys(state.data).flatMap((name) => m(
        'details'
        , m(
          'summary.ff-code.fs-sm.upper.fw-bold.p-3'
          , m(
            '.fs-lg.pr-3'
            , {
              class: isActive(state.data[name]) ? 'fc-green' : 'fc-orange',
              style: { lineHeight: '1' }
            }
            , '•'
          )
          , m(
            'span.mr-auto.fs-sm'
            , `(${values(state.data[name]).length}) ${name}`
          )
        )
        , m(
          '.container-fluid.p-3.bg-darker'
          , m(
            `#component-${name}.explorer-accordion.by.bx.bc-code.rd.hidden`
            , values(state.data[name]).map(scope => m(
              'details'
              , m(
                'summary.ff-code.bg-code.py-2.px-3'
                , m(
                  '.fs-lg.pr-3'
                  , {
                    style: { lineHeight: '1' },
                    class: (scope.reference.status === 3) ? 'fc-green' : 'fc-orange'
                  }
                  , '•'
                )
                , m(
                  'span.mr-auto'
                  , scope.reference.ref
                )
              )
              , m(
                '.d-block.bg-darker.p-3'
                , m(
                  '.row.gx-1.jc-between.bc-code.mx-2.px-1'
                  , [
                    'reference',
                    'state',
                    'binds',
                    'events',
                    'nodes'
                  ].map(key => m(
                    'button.btn-tab.col-auto.ff-code.upper'
                    , {
                      class: state.tabs[scope.reference.ref][key] ? 'active' : '',
                      onclick: () => {
                        state.tabs[scope.reference.ref][key] = true;
                        for (const prop in state.tabs[scope.reference.ref]) {
                          if (prop !== key) {
                            state.tabs[scope.reference.ref][prop] = false;
                          }
                        }
                      }
                    }
                    , (
                      key === 'events' ||
                      key === 'nodes' ||
                     key === 'binds'
                    ) ? `${keys(scope[key]).length} ${key}` : key
                  ))
                )
                , m(
                  '.d-block.bt.bc-code.mx-2.py-3'
                  , state.tabs[scope.reference.ref].reference ? m(Reference, { scope }) : null
                  , state.tabs[scope.reference.ref].state ? m(State, { scope }) : null
                  , state.tabs[scope.reference.ref].nodes ? m(Nodes, { scope }) : null
                  , state.tabs[scope.reference.ref].events ? m(Events, { scope }) : null
                  , state.tabs[scope.reference.ref].binds ? m(Binds, { scope }) : null
                )
              )
            ))
          )
        )
      ))
    )
  };
};
