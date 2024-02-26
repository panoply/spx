# Algorithm

The SPX Component algorithm (or pattern) works in a progressive manner. This page intends to describe the internal logic applied to component handling and how things work under the hood.

# Operations

1. Register Components
2. Walk DOM and obtain component directives
3. Mark component directives
4. Mount components

# Context

SPX uses syntactical structures that cannot be obtained using `querySelector` and along with its alias tactic in order for context awareness the module will traverse the DOM and generate a workable model which describes components. This is a heavy operation and likely the most expensive in terms of performance bottlenecks (depending on the size of the DOM), however in most cases will conclude in less than 50ms. Context awareness is applied 2 different ways.

### Runtime

Runtime context happens upon SPX connection. This is a heavy operation and likely the most expensive in terms of performance bottlenecks (depending on the size of the DOM), however in most cases will conclude in less than 50ms. Runtime context works in a similar way as subsequent context, the difference being is that subsequent context is composed during morph operations, whereas runtime context is component using DOM traversal.

### Subsequent

### data-spx
