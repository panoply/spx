# Events

SPX dispatches lifecycle events to the document. You can access contextual information in the parameters and carry out additional operations at different points of the SPX render cycle. Events can be cancelled with `preventDefault()` or by returning boolean `false`.

### Lifecycle

The SPX lifecycle events will be triggered in the following order of execution:

1. **Prefetch**
2. **Visit**
3. **Fetch**
4. **Store**
5. **Cache**
6. **Render**
7. **Hydrate**
8. **Load**
