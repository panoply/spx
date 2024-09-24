---
title: 'Morph - Nodes'
layout: cases/morph-nodes/index.liquid
permalink: '/morph/nodes/index.html'
---

# Morph Nodes

This tests the `data-spx` nodes reference value attribute applied to elements. The nodes reference uses a `n.<uuid>` value. When morphing, the current node will be morphed with a new node, but the current node will have the `data-spx` value added dynamically.

The snapshot will be marked in post cycles, which means that a component node marked with `data-spx` will attempt to morph with identical nodes in the snapshot. Before performing an attribute morph operation, the `data-spx` is removed and the current node is matched with the new node to determine whether or not attributes match and the node contents are equal.

In this test we setup a component and mark elements as nodes. When moving between pages elements which are not equal will have their node reference changed, whereas equal elements will persist their node reference.
