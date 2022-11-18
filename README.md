# pure-graph-utils

[![npm](https://img.shields.io/npm/v/pure-graph-utils.svg)](https://www.npmjs.com/package/pure-graph-utils) [![Build Status](https://travis-ci.org/alcar/pure-graph-utils.svg?branch=master)](https://travis-ci.org/alcar/pure-graph-utils) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/pure-graph-utils)

**Graph generation and handling utils, built with pure functions.**

## Disclaimer

This project is no longer being maintained.

## Table of contents

- [Installation](#installation)
- [API](#api)
- [Development](#development)

## Installation

```
npm install pure-graph-utils
```

## API

_To get a better grasp of each function's behavior, please check the [tests file](/index.test.js)._

### createNode(id, value)

Returns an object with an 'id' and a 'value' properties.

```js
createNode('nodeId', 'nodeValue')

// Output
{
  id: 'nodeId',
  value: 'nodeValue'
}
```

### changeNodeId(newId, node)

Returns a new node with `newNode.id === newId`.

```js
changeNodeId(
  'newId',
  createNode('nodeId', 'nodeValue')
)

// Output
{
  id: 'newId',
  value: 'nodeValue'
}
```

### addNodeProperty(propKey, propValue, node)

Returns a new node with `newNode[propKey] === propValue`.

```js
addNodeProperty(
  'extraProperty',
  'extraPropertyValue',
  createNode('nodeId', 'nodeValue')
)

// Output
{
  extraProperty: 'extraPropertyValue',
  id: 'nodeId',
  value: 'nodeValue'
}
```

### editNodeProperty(propKey, propNewValue, node)

Returns a new node with `newNode[propKey] === propNewValue`.

```js
editNodeProperty(
  'value',
  'newValue',
  createNode('nodeId', 'nodeValue')
)

// Output
{
  id: 'nodeId',
  value: 'newValue'
}
```

### removeNodeProperty(propKey, node)

Returns a new node without propKey.

```js
removeNodeProperty(
  'value',
  createNode('nodeId', 'nodeValue')
)

// Output
{
  id: 'nodeId',
}
```

### createGraph(node)

Returns an object with node.

```js
createGraph(createNode('nodeId', 'nodeValue'))

// Output
{
  nodeId: {
    connections: [],
    id: 'nodeId',
    value: 'nodeValue'
  }
}
```

### changeGraphNodeId(nodeId, nodeNewId, graph)

Returns a new graph with `graph[nodeId]` adapted to `newGraph[nodeNewId]`.

```js
changeGraphNodeId(
  'nodeId',
  'nodeNewId',
  createGraph(createNode('nodeId', 'nodeValue'))
)

// Output
{
  nodeNewId: {
    connections: [],
    id: 'nodeNewId',
    value: 'nodeValue'
  }
}
```

### addNode(node, graph)

Returns a new graph with node.

```js
addNode(
  createNode('id2', 'value2'),
  createGraph(createNode('id1', 'value1'))
)

// Output
{
  id1: {
    connections: [],
    id: 'id1',
    value: 'value1'
  },
  id2: {
    connections: [],
    id: 'id2',
    value: 'value2'
  }
}
```

### addGraphNodeProperty(nodeId, propKey, propValue, graph)

Returns a new graph with `newGraph[nodeId][propKey] === propValue`.

```js
addGraphNodeProperty(
  'nodeId',
  'extraProperty',
  'extraPropertyValue',
  createGraph(createNode('nodeId', 'nodeValue'))
)

// Output
{
  nodeId: {
    connections: [],
    extraProperty: 'extraPropertyValue',
    id: 'nodeId',
    value: 'nodeValue'
  }
}
```

### editGraphNodeProperty(nodeId, propKey, propNewValue, graph)

Returns a new graph with `newGraph[nodeId][propKey] === propNewValue`.

```js
editGraphNodeProperty(
  'nodeId',
  'value',
  'newValue',
  createGraph(createNode('nodeId', 'nodeValue'))
)

// Output
{
  nodeId: {
    connections: [],
    id: 'nodeId',
    value: 'newValue'
  }
}
```

### removeGraphNodeProperty(nodeId, propKey, graph)

Returns a new graph without `graph[nodeId]`'s propKey.

```js
removeGraphNodeProperty(
  'nodeId',
  'value',
  createGraph(createNode('nodeId', 'nodeValue'))
)

// Output
{
  nodeId: {
    connections: [],
    id: 'nodeId'
  }
}
```

### addConnection(nodeAId, nodeBId, graph)

Returns a new graph with nodeA and nodeB connected.

```js
addConnection(
  'id1',
  'id2',
  addNode(
    createNode('id2', 'value2'),
    createGraph(createNode('id1', 'value1'))
  )
)


// Output
{
  id1: {
    connections: ['id2'],
    id: 'id1',
    value: 'value1'
  },
  id2: {
    connections: ['id1'],
    id: 'id2',
    value: 'value2'
  }
}
```

### removeConnection(nodeAId, nodeBId, graph)

Returns a new graph with nodeA and nodeB disconnected.

```js
removeConnection(
  'id1',
  'id2',
  addConnection(
    'id1',
    'id2',
    addNode(
      createNode('id2', 'value2'),
      createGraph(createNode('id1', 'value1'))
    )
  )
)


// Output
{
  id1: {
    connections: [],
    id: 'id1',
    value: 'value1'
  },
  id2: {
    connections: [],
    id: 'id2',
    value: 'value2'
  }
}
```

### removeAllConnections(nodeId, graph)

Returns a new graph with `graph[nodeId]` disconnected from other nodes.

```js
removeAllConnections(
  'id1',
  addConnection(
    'id2',
    'id3',
    addConnection(
      'id1',
      'id3',
      addConnection(
        'id1',
        'id2',
        addNode(
          createNode('id3', 'value3'),
          addNode(
            createNode('id2', 'value2'),
            createGraph(createNode('id1', 'value1'))
          )
        )
      )
    )
  )
)


// Output
{
  id1: {
    connections: [],
    id: 'id1',
    value: 'value1'
  },
  id2: {
    connections: ['id3'],
    id: 'id2',
    value: 'value2'
  },
  id3: {
    connections: ['id2'],
    id: 'id3',
    value: 'value3'
  }
}
```

### removeNode(nodeId, graph)

Returns a new graph without `graph[nodeId]`.

```js
removeNode(
  'id1',
  addNode(
    createNode('id2', 'value2'),
    createGraph(createNode('id1', 'value1'))
  )
)

// Output
{
  id2: {
    connections: [],
    id: 'id2',
    value: 'value2'
  }
}
```

## Development

### Testing

#### Single run

```
npm run test
```

#### Watch mode

```
npm run test:watch
```

### Building

```
npm run build
```
