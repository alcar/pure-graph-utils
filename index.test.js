/* eslint-disable fp/no-nil, fp/no-unused-expression */

import deepFreeze from 'deep-freeze'
import R from 'ramda'

import {
  createNode,
  changeNodeId,
  addNodeProperty,
  editNodeProperty,
  removeNodeProperty,
  createGraph,
  addNode,
  changeGraphNodeId,
  addGraphNodeProperty,
  editGraphNodeProperty,
  removeGraphNodeProperty,
  addConnection,
  removeConnection,
  removeAllConnections,
  removeNode,
} from './index'

const EMPTY_NODE = deepFreeze({})
const EMPTY_GRAPH = deepFreeze({})

describe('createNode(id, value)', () => {
  it("returns an object with an 'id' and a 'value' properties", () => {
    const node = createNode('nodeId', 'nodeValue')

    const expectedNode = { id: 'nodeId', value: 'nodeValue' }

    expect(node).toEqual(expectedNode)
  })

  it('returns an empty object when id is not defined', () => {
    const node = createNode(undefined, 'nodeValue')

    expect(node).toEqual({})
  })

  it("accepts nodes without a 'value' property", () => {
    const node = createNode('nodeId', undefined)

    const expectedNode = { id: 'nodeId' }

    expect(node).toEqual(expectedNode)
  })
})

describe('changeNodeId(newId, node)', () => {
  it('returns a new node with newNode.id === newId', () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))

    const newNode = changeNodeId('newId', node)

    const expectedNode = {
      id: 'newId',
      value: 'nodeValue',
    }

    expect(newNode).toEqual(expectedNode)
  })

  it('returns an empty node when node is not defined', () => {
    const node = changeNodeId('newId', undefined)

    expect(node).toEqual(EMPTY_NODE)
  })

  it('returns node when newId is not defined', () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))

    const newNode = changeNodeId(undefined, node)

    expect(newNode).toBe(node)
  })

  it('returns node when newId === node.id', () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))

    const newNode = changeNodeId('nodeId', node)

    expect(newNode).toBe(node)
  })

  it("preserves node's other properties", () => {
    const node = deepFreeze({
      id: 'nodeId',
      value: 'nodeValue',
      extraProperty1: 'extraProperty1Value',
      extraProperty2: 2,
      extraProperty3: ['extraProperty3', 3],
    })

    const newNode = changeNodeId('newId', node)

    const expectedGraph = {
      ...node,
      id: 'newId',
    }

    expect(newNode).toEqual(expectedGraph)
  })
})

describe('addNodeProperty(propKey, propValue, node)', () => {
  it('returns a new node with newNode[propKey] === propValue', () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))

    const newNode = addNodeProperty('extraProperty', 'extraPropertyValue', node)

    const expectedNode = {
      ...node,
      extraProperty: 'extraPropertyValue',
    }

    expect(newNode).toEqual(expectedNode)
  })

  it('returns an empty node when node is not defined', () => {
    const node = addNodeProperty(
      'extraProperty',
      'extraPropertyValue',
      undefined,
    )

    expect(node).toEqual(EMPTY_NODE)
  })

  it('returns node when propKey is not defined', () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))

    const newNode = addNodeProperty(undefined, 'extraPropertyValue', node)

    expect(newNode).toBe(node)
  })

  it('returns node when the property already exists', () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))

    const newNode = addNodeProperty('value', 'newValue', node)

    expect(newNode).toBe(node)
  })

  it('accepts properties with propValue not defined', () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))

    const newNode = addNodeProperty('extraProperty', undefined, node)

    const expectedNode = {
      ...node,
      extraProperty: undefined,
    }

    expect(newNode).toEqual(expectedNode)
  })

  it("preserves node's other properties", () => {
    const node = deepFreeze({
      id: 'nodeId',
      value: 'nodeValue',
      extraProperty1: 'extraProperty1Value',
      extraProperty2: 2,
      extraProperty3: ['extraProperty3', 3],
    })

    const newNode = addNodeProperty(
      'newExtraProperty',
      'newExtraPropertyValue',
      node,
    )

    const expectedGraph = {
      ...node,
      newExtraProperty: 'newExtraPropertyValue',
    }

    expect(newNode).toEqual(expectedGraph)
  })
})

describe('editNodeProperty(propKey, propNewValue, node)', () => {
  it('returns a new node with newNode[propKey] === propNewValue', () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))

    const newNode = editNodeProperty('value', 'newValue', node)

    const expectedNode = {
      ...node,
      value: 'newValue',
    }

    expect(newNode).toEqual(expectedNode)
  })

  it('returns an empty node when node is not defined', () => {
    const node = editNodeProperty(
      'nodeProperty',
      'nodePropertyNewValue',
      undefined,
    )

    expect(node).toEqual(EMPTY_NODE)
  })

  it('returns node when propKey is not defined', () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))

    const newNode = editNodeProperty(undefined, 'nodePropertyNewValue', node)

    expect(newNode).toBe(node)
  })

  it('returns node when the property does not exist', () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))

    const newNode = editNodeProperty('property99', 'property99NewValue', node)

    expect(newNode).toBe(node)
  })

  it('returns node when propNewValue === node[propKey]', () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))

    const newNode = editNodeProperty('value', node.value, node)

    expect(newNode).toBe(node)
  })

  it('sets newNode[propKey] to undefined when propNewValue is not defined', () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))

    const newNode = editNodeProperty('value', undefined, node)

    const expectedNode = {
      ...node,
      value: undefined,
    }

    expect(newNode).toEqual(expectedNode)
  })

  it("preserves node's other properties", () => {
    const node = R.compose(
      deepFreeze,
      R.partial(addNodeProperty, ['extraProperty3', ['extraProperty3', 3]]),
      R.partial(addNodeProperty, ['extraProperty2', 2]),
      R.partial(addNodeProperty, ['extraProperty1', 'extraProperty1Value']),
    )(createNode('nodeId', 'nodeValue'))

    const newNode = editNodeProperty('extraProperty2', [1, 2, 3], node)

    const expectedGraph = {
      ...node,
      extraProperty2: [1, 2, 3],
    }

    expect(newNode).toEqual(expectedGraph)
  })
})

describe('removeNodeProperty(propKey, node)', () => {
  it('returns a new node without propKey', () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))

    const newNode = removeNodeProperty('value', node)

    const expectedNode = {
      id: 'nodeId',
    }

    expect(newNode).toEqual(expectedNode)
  })

  it('returns an empty node when node is not defined', () => {
    const node = removeNodeProperty('nodeProperty', undefined)

    expect(node).toEqual(EMPTY_NODE)
  })

  it('returns node when propKey is not defined', () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))

    const newNode = removeNodeProperty(undefined, node)

    expect(newNode).toBe(node)
  })

  it('returns node when the property does not exist', () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))

    const newNode = removeNodeProperty('property99', node)

    expect(newNode).toBe(node)
  })

  it("does not allow 'id' to be deleted", () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))

    const newNode = removeNodeProperty('id', node)

    expect(newNode).toBe(node)
  })

  it("preserves node's other properties", () => {
    const node = R.compose(
      deepFreeze,
      R.partial(addNodeProperty, ['extraProperty3', ['extraProperty3', 3]]),
      R.partial(addNodeProperty, ['extraProperty2', 2]),
      R.partial(addNodeProperty, ['extraProperty1', 'extraProperty1Value']),
    )(createNode('nodeId', 'nodeValue'))

    const newNode = removeNodeProperty('extraProperty2', node)

    const expectedGraph = {
      id: 'nodeId',
      value: 'nodeValue',
      extraProperty1: 'extraProperty1Value',
      extraProperty3: ['extraProperty3', 3],
    }

    expect(newNode).toEqual(expectedGraph)
  })
})

describe('createGraph(node)', () => {
  it('returns an object with node', () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))
    const graph = createGraph(node)

    const expectedGraph = { [node.id]: { ...node, connections: [] } }

    expect(graph).toEqual(expectedGraph)
  })

  it('returns an empty object when node is not defined', () => {
    const graph = createGraph(undefined)

    expect(graph).toEqual(EMPTY_GRAPH)
  })

  it("returns an empty object when node has no 'id' property", () => {
    const node = deepFreeze({ value: 'nodeValue' })
    const graph = createGraph(node)

    expect(graph).toEqual(EMPTY_GRAPH)
  })

  it("makes sure node has a 'connections' property", () => {
    const node = deepFreeze(createNode('nodeId', 'nodeValue'))
    const graph = createGraph(node)

    const graphNode = graph[node.id]

    expect(graphNode).toHaveProperty('connections', [])
  })

  it('ignores preset connections', () => {
    const node = deepFreeze({
      id: 'id1',
      value: 'value1',
      connections: [{ id: 'id2', value: 'value2' }],
    })
    const graph = createGraph(node)

    const graphNodeConnections = graph[node.id].connections

    expect(graphNodeConnections).toEqual([])
  })

  it('accepts nodes with extra properties', () => {
    const node = R.compose(
      deepFreeze,
      R.partial(addNodeProperty, ['extraProperty3', ['extraProperty3', 3]]),
      R.partial(addNodeProperty, ['extraProperty2', 2]),
      R.partial(addNodeProperty, ['extraProperty1', 'extraProperty1Value']),
    )(createNode('nodeId', 'nodeValue'))

    const graph = createGraph(node)

    const expectedGraph = {
      [node.id]: { ...node, connections: [] },
    }

    expect(graph).toEqual(expectedGraph)
  })
})

describe('addNode(node, graph)', () => {
  it('returns a new graph with node', () => {
    const node = createNode('id1', 'value1')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newNode = createNode('id2', 'value2')
    const newGraph = addNode(newNode, graph)

    const expectedGraph = {
      ...graph,
      [newNode.id]: { ...newNode, connections: [] },
    }

    expect(newGraph).toEqual(expectedGraph)
  })

  it('returns an empty graph when graph is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = addNode(node, undefined)

    expect(graph).toEqual(EMPTY_GRAPH)
  })

  it('returns graph when node is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = addNode(undefined, graph)

    expect(newGraph).toBe(graph)
  })

  it("returns graph when node has no 'id' property", () => {
    const node = createNode('id1', 'value1')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newNode = { value: 'value2' }
    const newGraph = addNode(newNode, graph)

    expect(newGraph).toBe(graph)
  })

  it("returns graph when node's id is already taken", () => {
    const node = createNode('nodeId', 'value1')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newNode = createNode('nodeId', 'value2')
    const newGraph = addNode(newNode, graph)

    expect(newGraph).toBe(graph)
  })

  it("makes sure node has a 'connections' property", () => {
    const node = createNode('id1', 'value1')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newNode = createNode('id2', 'value2')
    const newGraph = addNode(newNode, graph)
    const newGraphNode = newGraph[newNode.id]

    expect(newGraphNode).toHaveProperty('connections', [])
  })

  it('ignores preset connections', () => {
    const node = {
      id: 'id1',
      value: 'value1',
      connections: [{ id: 'id2', value: 'value2' }],
    }
    const graph = R.compose(deepFreeze, R.partial(addNode, [node]))(EMPTY_GRAPH)

    const graphConnections = graph[node.id].connections

    expect(graphConnections).toEqual([])
  })

  it('accepts nodes with extra properties', () => {
    const node = R.compose(
      R.partial(addNodeProperty, ['extraProperty3', ['extraProperty3', 3]]),
      R.partial(addNodeProperty, ['extraProperty2', 2]),
      R.partial(addNodeProperty, ['extraProperty1', 'extraProperty1Value']),
    )(createNode('nodeId', 'nodeValue'))
    const graph = R.compose(deepFreeze, createGraph)(node)

    const expectedGraph = { [node.id]: { ...node, connections: [] } }

    expect(graph).toEqual(expectedGraph)
  })
})

describe('changeGraphNodeId(nodeId, nodeNewId, graph)', () => {
  it('returns a new graph with graph[nodeId] adapted to newGraph[nodeNewId]', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = changeGraphNodeId(node.id, 'nodeNewId', graph)

    const expectedGraph = {
      nodeNewId: {
        ...node,
        id: 'nodeNewId',
        connections: [],
      },
    }

    expect(newGraph).toEqual(expectedGraph)
  })

  it('returns an empty graph when graph is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = changeGraphNodeId(node.id, 'nodeNewId', undefined)

    expect(graph).toEqual(EMPTY_NODE)
  })

  it('returns graph when nodeId is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = changeGraphNodeId(undefined, 'nodeNewId', graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when nodeNewId is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = changeGraphNodeId(node.id, undefined, graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when graph[nodeId] is not defined', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = R.compose(
      deepFreeze,
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = changeGraphNodeId('id99', 'nodeNewId', graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when nodeNewId === nodeId', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = changeGraphNodeId(node.id, node.id, graph)

    expect(newGraph).toBe(graph)
  })

  it("updates other nodes' connections to graph[nodeId]", () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const nodeC = createNode('id3', 'value3')
    const graph = R.compose(
      deepFreeze,
      R.partial(addConnection, [nodeB.id, nodeC.id]),
      R.partial(addConnection, [nodeA.id, nodeC.id]),
      R.partial(addConnection, [nodeA.id, nodeB.id]),
      R.partial(addNode, [nodeC]),
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = changeGraphNodeId(nodeB.id, 'nodeBNewId', graph)

    const expectedGraph = {
      [nodeA.id]: {
        ...graph[nodeA.id],
        connections: ['nodeBNewId', nodeC.id],
      },
      nodeBNewId: {
        ...graph[nodeB.id],
        id: 'nodeBNewId',
        connections: [nodeA.id, nodeC.id],
      },
      [nodeC.id]: {
        ...graph[nodeC.id],
        connections: [nodeA.id, 'nodeBNewId'],
      },
    }

    expect(newGraph).toEqual(expectedGraph)
  })

  it("preserves node's other properties", () => {
    const node = R.compose(
      R.partial(addNodeProperty, ['extraProperty3', ['extraProperty3', 3]]),
      R.partial(addNodeProperty, ['extraProperty2', 2]),
      R.partial(addNodeProperty, ['extraProperty1', 'extraProperty1Value']),
    )(createNode('nodeId', 'nodeValue'))
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = changeGraphNodeId(node.id, 'nodeNewId', graph)

    const expectedGraph = {
      nodeNewId: {
        ...node,
        id: 'nodeNewId',
        connections: [],
      },
    }

    expect(newGraph).toEqual(expectedGraph)
  })
})

describe('addGraphNodeProperty(nodeId, propKey, propValue, graph)', () => {
  it('returns a new graph with newGraph[nodeId][propKey] === propValue', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = addGraphNodeProperty(
      node.id,
      'extraProperty',
      'extraPropertyValue',
      graph,
    )

    const expectedGraph = {
      ...graph,
      [node.id]: {
        ...node,
        connections: [],
        extraProperty: 'extraPropertyValue',
      },
    }

    expect(newGraph).toEqual(expectedGraph)
  })

  it('returns an empty graph when graph is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = addGraphNodeProperty(
      node.id,
      'extraProperty',
      'extraPropertyValue',
      undefined,
    )

    expect(graph).toEqual(EMPTY_GRAPH)
  })

  it('returns graph when nodeId is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = addGraphNodeProperty(
      undefined,
      'extraProperty',
      'extraPropertyValue',
      graph,
    )

    expect(newGraph).toBe(graph)
  })

  it('returns graph when propKey is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = addGraphNodeProperty(
      node.id,
      undefined,
      'extraPropertyValue',
      graph,
    )

    expect(newGraph).toBe(graph)
  })

  it('returns graph when graph[nodeId] is not defined', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = R.compose(
      deepFreeze,
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = addGraphNodeProperty(
      'id99',
      'extraProperty',
      'extraPropertyValue',
      graph,
    )

    expect(newGraph).toBe(graph)
  })

  it('returns graph when the property already exists', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = addGraphNodeProperty(node.id, 'value', 'newValue', graph)

    expect(newGraph).toBe(graph)
  })

  it('accepts properties with propValue not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = addGraphNodeProperty(
      node.id,
      'extraProperty',
      undefined,
      graph,
    )

    const expectedGraph = {
      ...graph,
      [node.id]: { ...node, connections: [], extraProperty: undefined },
    }

    expect(newGraph).toEqual(expectedGraph)
  })

  it("preserves node's other properties", () => {
    const node = R.compose(
      R.partial(addNodeProperty, ['extraProperty3', ['extraProperty3', 3]]),
      R.partial(addNodeProperty, ['extraProperty2', 2]),
      R.partial(addNodeProperty, ['extraProperty1', 'extraProperty1Value']),
    )(createNode('nodeId', 'nodeValue'))
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = addGraphNodeProperty(
      node.id,
      'newExtraProperty',
      'newExtraPropertyValue',
      graph,
    )

    const expectedGraph = {
      [node.id]: {
        ...node,
        connections: [],
        newExtraProperty: 'newExtraPropertyValue',
      },
    }

    expect(newGraph).toEqual(expectedGraph)
  })
})

describe('editGraphNodeProperty(nodeId, propKey, propNewValue, graph)', () => {
  it('returns a new graph with newGraph[nodeId][propKey] === propNewValue', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = editGraphNodeProperty(node.id, 'value', 'newValue', graph)

    const expectedGraph = {
      ...graph,
      [node.id]: {
        ...node,
        connections: [],
        value: 'newValue',
      },
    }

    expect(newGraph).toEqual(expectedGraph)
  })

  it('returns an empty graph when graph is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = editGraphNodeProperty(node.id, 'value', 'newValue', undefined)

    expect(graph).toEqual(EMPTY_GRAPH)
  })

  it('returns graph when nodeId is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = editGraphNodeProperty(
      undefined,
      'value',
      'newValue',
      graph,
    )

    expect(newGraph).toBe(graph)
  })

  it('returns graph when propKey is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = editGraphNodeProperty(
      node.id,
      undefined,
      'nodePropertyNewValue',
      graph,
    )

    expect(newGraph).toBe(graph)
  })

  it('returns graph when graph[nodeId] is not defined', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = R.compose(
      deepFreeze,
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = editGraphNodeProperty('id99', 'value', 'newValue', graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when the property does not exist', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = editGraphNodeProperty(
      node.id,
      'property99',
      'property99NewValue',
      graph,
    )

    expect(newGraph).toBe(graph)
  })

  it('returns graph when propNewValue === graph[nodeId][propKey]', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = editGraphNodeProperty(node.id, 'value', node.value, graph)

    expect(newGraph).toBe(graph)
  })

  it("does not allow 'id' to be edited", () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = editGraphNodeProperty(node.id, 'id', 'newId', graph)

    expect(newGraph).toBe(graph)
  })

  it("does not allow 'connections' to be edited", () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = editGraphNodeProperty(
      node.id,
      'connections',
      ['id1', 'id2'],
      graph,
    )

    expect(newGraph).toBe(graph)
  })

  it('sets newGraph[propKey] to undefined when propNewValue is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = editGraphNodeProperty(node.id, 'value', undefined, graph)

    const expectedGraph = {
      ...graph,
      [node.id]: { ...node, connections: [], value: undefined },
    }

    expect(newGraph).toEqual(expectedGraph)
  })

  it("preserves node's other properties", () => {
    const node = R.compose(
      R.partial(addNodeProperty, ['extraProperty3', ['extraProperty3', 3]]),
      R.partial(addNodeProperty, ['extraProperty2', 2]),
      R.partial(addNodeProperty, ['extraProperty1', 'extraProperty1Value']),
    )(createNode('nodeId', 'nodeValue'))
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = editGraphNodeProperty(
      node.id,
      'extraProperty2',
      [1, 2, 3],
      graph,
    )

    const expectedGraph = {
      [node.id]: {
        ...node,
        connections: [],
        extraProperty2: [1, 2, 3],
      },
    }

    expect(newGraph).toEqual(expectedGraph)
  })
})

describe('removeGraphNodeProperty(nodeId, propKey, graph)', () => {
  it("returns a new graph without graph[nodeId]'s propKey", () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = removeGraphNodeProperty(node.id, 'value', graph)

    const expectedGraph = {
      ...graph,
      [node.id]: {
        id: 'nodeId',
        connections: [],
      },
    }

    expect(newGraph).toEqual(expectedGraph)
  })

  it('returns an empty graph when graph is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = removeGraphNodeProperty(node.id, 'value', undefined)

    expect(graph).toEqual(EMPTY_GRAPH)
  })

  it('returns graph when nodeId is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = removeGraphNodeProperty(undefined, 'value', graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when propKey is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = removeGraphNodeProperty(node.id, undefined, graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when graph[nodeId] is not defined', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = R.compose(
      deepFreeze,
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = removeGraphNodeProperty('id99', 'value', graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when the property does not exist', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = removeGraphNodeProperty(node.id, 'property99', graph)

    expect(newGraph).toBe(graph)
  })

  it("does not allow 'id' to be removed", () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = removeGraphNodeProperty(node.id, 'id', graph)

    expect(newGraph).toBe(graph)
  })

  it("does not allow 'connections' to be removed", () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = removeGraphNodeProperty(node.id, 'connections', graph)

    expect(newGraph).toBe(graph)
  })

  it("preserves node's other properties", () => {
    const node = R.compose(
      R.partial(addNodeProperty, ['extraProperty3', ['extraProperty3', 3]]),
      R.partial(addNodeProperty, ['extraProperty2', 2]),
      R.partial(addNodeProperty, ['extraProperty1', 'extraProperty1Value']),
    )(createNode('nodeId', 'nodeValue'))
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = removeGraphNodeProperty(node.id, 'extraProperty2', graph)

    const expectedGraph = {
      [node.id]: {
        id: 'nodeId',
        value: 'nodeValue',
        extraProperty1: 'extraProperty1Value',
        extraProperty3: ['extraProperty3', 3],
        connections: [],
      },
    }

    expect(newGraph).toEqual(expectedGraph)
  })
})

describe('addConnection(nodeAId, nodeBId, graph)', () => {
  it('returns a new graph with nodeA and nodeB connected', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = R.compose(
      deepFreeze,
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = addConnection(nodeA.id, nodeB.id, graph)

    const expectedGraph = {
      [nodeA.id]: { ...graph[nodeA.id], connections: [nodeB.id] },
      [nodeB.id]: { ...graph[nodeB.id], connections: [nodeA.id] },
    }

    expect(newGraph).toEqual(expectedGraph)
  })

  it('returns an empty graph when graph is not defined', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = addConnection(nodeA.id, nodeB.id, undefined)

    expect(graph).toEqual(EMPTY_GRAPH)
  })

  it('returns graph when nodeAId is not defined', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = R.compose(
      deepFreeze,
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = addConnection(undefined, nodeB.id, graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when nodeBId is not defined', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = R.compose(
      deepFreeze,
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = addConnection(nodeA.id, undefined, graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when graph[nodeAId] is not defined', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = R.compose(
      deepFreeze,
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = addConnection('id99', nodeB, graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when graph[nodeBId] is not defined', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = R.compose(
      deepFreeze,
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = addConnection(nodeA, 'id99', graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when the connection already exists', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const nodeC = createNode('id3', 'value3')
    const graph = R.compose(
      deepFreeze,
      R.partial(addConnection, [nodeB.id, nodeC.id]),
      R.partial(addConnection, [nodeA.id, nodeB.id]),
      R.partial(addNode, [nodeC]),
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = addConnection(nodeB.id, nodeC.id, graph)

    expect(newGraph).toBe(graph)
  })

  it("preserves nodeA's and nodeB's previous connections", () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const nodeC = createNode('id3', 'value3')
    const graph = R.compose(
      deepFreeze,
      R.partial(addConnection, [nodeB.id, nodeC.id]),
      R.partial(addConnection, [nodeA.id, nodeB.id]),
      R.partial(addNode, [nodeC]),
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = addConnection(nodeA.id, nodeC.id, graph)

    const expectedGraph = {
      [nodeA.id]: {
        ...graph[nodeA.id],
        connections: [nodeB.id, nodeC.id],
      },
      [nodeB.id]: {
        ...graph[nodeB.id],
        connections: [nodeA.id, nodeC.id],
      },
      [nodeC.id]: {
        ...graph[nodeC.id],
        connections: [nodeB.id, nodeA.id],
      },
    }

    expect(newGraph).toEqual(expectedGraph)
  })
})

describe('removeConnection(nodeAId, nodeBId, graph)', () => {
  it('returns a new graph with nodeA and nodeB disconnected', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = R.compose(
      deepFreeze,
      R.partial(addConnection, [nodeA.id, nodeB.id]),
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = removeConnection(nodeA.id, nodeB.id, graph)

    const expectedGraph = {
      [nodeA.id]: { ...graph[nodeA.id], connections: [] },
      [nodeB.id]: { ...graph[nodeB.id], connections: [] },
    }

    expect(newGraph).toEqual(expectedGraph)
  })

  it('returns an empty graph when graph is not defined', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = removeConnection(nodeA.id, nodeB.id, undefined)

    expect(graph).toEqual(EMPTY_GRAPH)
  })

  it('returns graph when nodeAId is not defined', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = R.compose(
      deepFreeze,
      R.partial(addConnection, [nodeA.id, nodeB.id]),
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = removeConnection(undefined, nodeB.id, graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when nodeBId is not defined', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = R.compose(
      deepFreeze,
      R.partial(addConnection, [nodeA.id, nodeB.id]),
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = removeConnection(nodeA.id, undefined, graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when graph[nodeAId] is not defined', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = R.compose(
      deepFreeze,
      R.partial(addConnection, [nodeA.id, nodeB.id]),
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = removeConnection('id99', nodeB.id, graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when graph[nodeBId] is not defined', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = R.compose(
      deepFreeze,
      R.partial(addConnection, [nodeA.id, nodeB.id]),
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = removeConnection(nodeA.id, 'id99', graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when the connection does not exist', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const nodeC = createNode('id3', 'value3')
    const graph = R.compose(
      deepFreeze,
      R.partial(addConnection, [nodeB.id, nodeC.id]),
      R.partial(addConnection, [nodeA.id, nodeB.id]),
      R.partial(addNode, [nodeC]),
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = removeConnection(nodeA.id, nodeC.id, graph)

    expect(newGraph).toBe(graph)
  })

  it("preserves nodeA's and nodeB's previous connections", () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const nodeC = createNode('id3', 'value3')
    const graph = R.compose(
      deepFreeze,
      R.partial(addConnection, [nodeB.id, nodeC.id]),
      R.partial(addConnection, [nodeA.id, nodeC.id]),
      R.partial(addConnection, [nodeA.id, nodeB.id]),
      R.partial(addNode, [nodeC]),
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = removeConnection(nodeA.id, nodeC.id, graph)

    const expectedGraph = {
      [nodeA.id]: {
        ...graph[nodeA.id],
        connections: [nodeB.id],
      },
      [nodeB.id]: {
        ...graph[nodeB.id],
        connections: [nodeA.id, nodeC.id],
      },
      [nodeC.id]: {
        ...graph[nodeC.id],
        connections: [nodeB.id],
      },
    }

    expect(newGraph).toEqual(expectedGraph)
  })
})

describe('removeAllConnections(nodeId, graph)', () => {
  it('returns a new graph with graph[nodeId] disconnected from other nodes', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const nodeC = createNode('id3', 'value3')
    const graph = R.compose(
      deepFreeze,
      R.partial(addConnection, [nodeB.id, nodeC.id]),
      R.partial(addConnection, [nodeA.id, nodeB.id]),
      R.partial(addNode, [nodeC]),
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = removeAllConnections(nodeB.id, graph)

    const expectedGraph = {
      [nodeA.id]: {
        ...graph[nodeA.id],
        connections: [],
      },
      [nodeB.id]: {
        ...graph[nodeB.id],
        connections: [],
      },
      [nodeC.id]: {
        ...graph[nodeC.id],
        connections: [],
      },
    }

    expect(newGraph).toEqual(expectedGraph)
  })

  it('returns an empty graph when graph is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = removeAllConnections(node.id, undefined)

    expect(graph).toEqual(EMPTY_GRAPH)
  })

  it('returns graph when nodeId is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = removeAllConnections(undefined, graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when graph[nodeId] is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = R.compose(deepFreeze, createGraph)(node)

    const newGraph = removeAllConnections('id99', graph)

    expect(newGraph).toBe(graph)
  })

  it('returns graph when graph[nodeId] has no connections', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const nodeC = createNode('id3', 'value3')
    const graph = R.compose(
      deepFreeze,
      R.partial(addConnection, [nodeA.id, nodeC.id]),
      R.partial(addNode, [nodeC]),
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = removeAllConnections(nodeB.id, graph)

    expect(newGraph).toBe(graph)
  })

  it("preserves other nodes' remaining connections", () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const nodeC = createNode('id3', 'value3')
    const graph = R.compose(
      deepFreeze,
      R.partial(addConnection, [nodeB.id, nodeC.id]),
      R.partial(addConnection, [nodeA.id, nodeC.id]),
      R.partial(addConnection, [nodeA.id, nodeB.id]),
      R.partial(addNode, [nodeC]),
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = removeAllConnections(nodeB.id, graph)

    const expectedGraph = {
      [nodeA.id]: {
        ...graph[nodeA.id],
        connections: [nodeC.id],
      },
      [nodeB.id]: {
        ...graph[nodeB.id],
        connections: [],
      },
      [nodeC.id]: {
        ...graph[nodeC.id],
        connections: [nodeA.id],
      },
    }

    expect(newGraph).toEqual(expectedGraph)
  })
})

describe('removeNode(nodeId, graph)', () => {
  it('returns a new graph without graph[nodeId]', () => {
    const nodeA = { id: 'id1', value: 'value1' }
    const nodeB = { id: 'id2', value: 'value2' }
    const nodeC = { id: 'id3', value: 'value3' }
    const graph = R.compose(
      deepFreeze,
      R.partial(addNode, [nodeC]),
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = removeNode(nodeB.id, graph)

    const expectedGraph = {
      [nodeA.id]: { ...nodeA, connections: [] },
      [nodeC.id]: { ...nodeC, connections: [] },
    }

    expect(newGraph).toEqual(expectedGraph)
  })

  it('returns an empty graph when graph is not defined', () => {
    const node = createNode('nodeId', 'nodeValue')
    const graph = removeNode(node, undefined)

    expect(graph).toEqual(EMPTY_GRAPH)
  })

  it('returns graph when nodeId is not defined', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = R.compose(
      deepFreeze,
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = removeNode(undefined, graph)

    expect(newGraph).toEqual(graph)
  })

  it('returns graph when graph[nodeId] does not exist', () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const graph = R.compose(
      deepFreeze,
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = removeNode('id99', graph)

    expect(newGraph).toEqual(graph)
  })

  it("removes other nodes' connections to graph[nodeId]", () => {
    const nodeA = createNode('id1', 'value1')
    const nodeB = createNode('id2', 'value2')
    const nodeC = createNode('id3', 'value3')
    const graph = R.compose(
      deepFreeze,
      R.partial(addConnection, [nodeB.id, nodeC.id]),
      R.partial(addConnection, [nodeA.id, nodeC.id]),
      R.partial(addConnection, [nodeA.id, nodeB.id]),
      R.partial(addNode, [nodeC]),
      R.partial(addNode, [nodeB]),
      createGraph,
    )(nodeA)

    const newGraph = removeNode(nodeB.id, graph)

    const expectedGraph = {
      [nodeA.id]: {
        ...graph[nodeA.id],
        connections: [nodeC.id],
      },
      [nodeC.id]: {
        ...graph[nodeC.id],
        connections: [nodeA.id],
      },
    }

    expect(newGraph).toEqual(expectedGraph)
  })
})
