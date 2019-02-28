const EMPTY_OBJECT = {}

const removeObjectProperty = (propKey, targetObject) =>
  Object.keys(targetObject)
    .filter(key => key !== propKey)
    .reduce(
      (objectAccumulator, currentPropKey) => ({
        ...objectAccumulator,
        [currentPropKey]: targetObject[currentPropKey],
      }),
      {}
    )

export const createNode = (id, value) => {
  if (typeof id === 'undefined') {
    return EMPTY_OBJECT
  }

  return { id: id, value: value }
}

export const changeNodeId = (newId, node) => {
  if (typeof node === 'undefined') {
    return createNode()
  }

  if (typeof newId === 'undefined' || newId === node.id) {
    return node
  }

  return { ...node, id: newId }
}

export const addNodeProperty = (propKey, propValue, node) => {
  if (typeof node === 'undefined') {
    return createNode()
  }

  if (typeof propKey === 'undefined' || node.hasOwnProperty(propKey)) {
    return node
  }

  return {
    ...node,
    [propKey]: propValue,
  }
}

export const editNodeProperty = (propKey, propNewValue, node) => {
  if (typeof node === 'undefined') {
    return createNode()
  }

  if (
    typeof propKey === 'undefined' ||
    !node.hasOwnProperty(propKey) ||
    propNewValue === node[propKey]
  ) {
    return node
  }

  return {
    ...node,
    [propKey]: propNewValue,
  }
}

export const removeNodeProperty = (propKey, node) => {
  if (typeof node === 'undefined') {
    return createNode()
  }

  if (
    typeof propKey === 'undefined' ||
    !node.hasOwnProperty(propKey) ||
    propKey === 'id'
  ) {
    return node
  }

  return removeObjectProperty(propKey, node)
}

export const createGraph = node => {
  if (typeof node === 'undefined' || typeof node.id === 'undefined') {
    return EMPTY_OBJECT
  }

  const completeNode =
    !node.connections || node.connections.length > 0
      ? { ...node, connections: [] }
      : node

  return { [node.id]: completeNode }
}

export const addNode = (node, graph) => {
  if (typeof graph === 'undefined') {
    return createGraph()
  }

  if (
    typeof node === 'undefined' ||
    !node.id ||
    typeof graph[node.id] !== 'undefined'
  ) {
    return graph
  }

  const completeNode =
    !node.connections || node.connections.length > 0
      ? { ...node, connections: [] }
      : node

  return { ...graph, [node.id]: completeNode }
}

export const changeGraphNodeId = (nodeId, nodeNewId, graph) => {
  if (typeof graph === 'undefined') {
    return createGraph()
  }

  if (
    typeof nodeId === 'undefined' ||
    typeof nodeNewId === 'undefined' ||
    !graph[nodeId] ||
    nodeNewId === nodeId
  ) {
    return graph
  }

  const graphWithUpdatedConnections = graph[nodeId].connections.reduce(
    (graphAccumulator, currentId) => ({
      ...graphAccumulator,
      [currentId]: {
        ...graph[currentId],
        connections: graph[currentId].connections.map(id =>
          id === nodeId ? nodeNewId : id
        ),
      },
    }),
    graph
  )

  const graphWithoutNodeId = removeObjectProperty(
    nodeId,
    graphWithUpdatedConnections
  )

  return {
    ...graphWithoutNodeId,
    [nodeNewId]: { ...graph[nodeId], id: nodeNewId },
  }
}

export const addGraphNodeProperty = (nodeId, propKey, propValue, graph) => {
  if (typeof graph === 'undefined') {
    return createGraph()
  }

  if (
    typeof nodeId === 'undefined' ||
    typeof propKey === 'undefined' ||
    !graph[nodeId] ||
    graph[nodeId].hasOwnProperty(propKey)
  ) {
    return graph
  }

  return {
    ...graph,
    [nodeId]: {
      ...graph[nodeId],
      [propKey]: propValue,
    },
  }
}

export const editGraphNodeProperty = (nodeId, propKey, propNewValue, graph) => {
  if (typeof graph === 'undefined') {
    return createGraph()
  }

  if (
    typeof nodeId === 'undefined' ||
    typeof propKey === 'undefined' ||
    !graph[nodeId] ||
    propKey === 'id' ||
    propKey === 'connections' ||
    !graph[nodeId].hasOwnProperty(propKey) ||
    propNewValue === graph[nodeId][propKey]
  ) {
    return graph
  }

  return {
    ...graph,
    [nodeId]: {
      ...graph[nodeId],
      [propKey]: propNewValue,
    },
  }
}

export const removeGraphNodeProperty = (nodeId, propKey, graph) => {
  if (typeof graph === 'undefined') {
    return createGraph()
  }

  if (
    typeof nodeId === 'undefined' ||
    typeof propKey === 'undefined' ||
    !graph[nodeId] ||
    propKey === 'id' ||
    propKey === 'connections' ||
    !graph[nodeId].hasOwnProperty(propKey)
  ) {
    return graph
  }

  return { ...graph, [nodeId]: removeObjectProperty(propKey, graph[nodeId]) }
}

export const addConnection = (nodeAId, nodeBId, graph) => {
  if (typeof graph === 'undefined') {
    return createGraph()
  }

  if (
    typeof nodeAId === 'undefined' ||
    typeof nodeBId === 'undefined' ||
    !graph[nodeAId] ||
    !graph[nodeBId] ||
    (graph[nodeAId].connections.includes(nodeBId) &&
      graph[nodeBId].connections.includes(nodeAId))
  ) {
    return graph
  }

  return {
    ...graph,
    [nodeAId]: {
      ...graph[nodeAId],
      connections: [...graph[nodeAId].connections, nodeBId],
    },
    [nodeBId]: {
      ...graph[nodeBId],
      connections: [...graph[nodeBId].connections, nodeAId],
    },
  }
}

export const removeConnection = (nodeAId, nodeBId, graph) => {
  if (typeof graph === 'undefined') {
    return createGraph()
  }

  if (
    typeof nodeAId === 'undefined' ||
    typeof nodeBId === 'undefined' ||
    !graph[nodeAId] ||
    !graph[nodeBId] ||
    (!graph[nodeAId].connections.includes(nodeBId) &&
      !graph[nodeBId].connections.includes(nodeAId))
  ) {
    return graph
  }

  return {
    ...graph,
    [nodeAId]: {
      ...graph[nodeAId],
      connections: graph[nodeAId].connections.filter(id => id !== nodeBId),
    },
    [nodeBId]: {
      ...graph[nodeBId],
      connections: graph[nodeBId].connections.filter(id => id !== nodeAId),
    },
  }
}

export const removeAllConnections = (nodeId, graph) => {
  if (typeof graph === 'undefined') {
    return createGraph()
  }

  if (typeof nodeId === 'undefined' || !graph[nodeId]) {
    return graph
  }

  return graph[nodeId].connections.reduce(
    (graphAccumulator, currentNodeId) =>
      removeConnection(nodeId, currentNodeId, graphAccumulator),
    graph
  )
}

export const removeNode = (nodeId, graph) => {
  if (typeof graph === 'undefined') {
    return createGraph()
  }

  if (typeof nodeId === 'undefined') {
    return graph
  }

  const graphWithoutNodeIdConnections = removeAllConnections(nodeId, graph)

  return removeObjectProperty(nodeId, graphWithoutNodeIdConnections)
}
