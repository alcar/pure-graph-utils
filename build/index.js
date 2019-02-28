'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EMPTY_OBJECT = {};

var removeObjectProperty = function removeObjectProperty(propKey, targetObject) {
  return Object.keys(targetObject).filter(function (key) {
    return key !== propKey;
  }).reduce(function (objectAccumulator, currentPropKey) {
    return _extends({}, objectAccumulator, _defineProperty({}, currentPropKey, targetObject[currentPropKey]));
  }, {});
};

var createNode = exports.createNode = function createNode(id, value) {
  if (typeof id === 'undefined') {
    return EMPTY_OBJECT;
  }

  return { id: id, value: value };
};

var changeNodeId = exports.changeNodeId = function changeNodeId(newId, node) {
  if (typeof node === 'undefined') {
    return createNode();
  }

  if (typeof newId === 'undefined' || newId === node.id) {
    return node;
  }

  return _extends({}, node, { id: newId });
};

var addNodeProperty = exports.addNodeProperty = function addNodeProperty(propKey, propValue, node) {
  if (typeof node === 'undefined') {
    return createNode();
  }

  if (typeof propKey === 'undefined' || node.hasOwnProperty(propKey)) {
    return node;
  }

  return _extends({}, node, _defineProperty({}, propKey, propValue));
};

var editNodeProperty = exports.editNodeProperty = function editNodeProperty(propKey, propNewValue, node) {
  if (typeof node === 'undefined') {
    return createNode();
  }

  if (typeof propKey === 'undefined' || !node.hasOwnProperty(propKey) || propNewValue === node[propKey]) {
    return node;
  }

  return _extends({}, node, _defineProperty({}, propKey, propNewValue));
};

var removeNodeProperty = exports.removeNodeProperty = function removeNodeProperty(propKey, node) {
  if (typeof node === 'undefined') {
    return createNode();
  }

  if (typeof propKey === 'undefined' || !node.hasOwnProperty(propKey) || propKey === 'id') {
    return node;
  }

  return removeObjectProperty(propKey, node);
};

var createGraph = exports.createGraph = function createGraph(node) {
  if (typeof node === 'undefined' || typeof node.id === 'undefined') {
    return EMPTY_OBJECT;
  }

  var completeNode = !node.connections || node.connections.length > 0 ? _extends({}, node, { connections: [] }) : node;

  return _defineProperty({}, node.id, completeNode);
};

var addNode = exports.addNode = function addNode(node, graph) {
  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof node === 'undefined' || !node.id || typeof graph[node.id] !== 'undefined') {
    return graph;
  }

  var completeNode = !node.connections || node.connections.length > 0 ? _extends({}, node, { connections: [] }) : node;

  return _extends({}, graph, _defineProperty({}, node.id, completeNode));
};

var changeGraphNodeId = exports.changeGraphNodeId = function changeGraphNodeId(nodeId, nodeNewId, graph) {
  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof nodeId === 'undefined' || typeof nodeNewId === 'undefined' || !graph[nodeId] || nodeNewId === nodeId) {
    return graph;
  }

  var graphWithUpdatedConnections = graph[nodeId].connections.reduce(function (graphAccumulator, currentId) {
    return _extends({}, graphAccumulator, _defineProperty({}, currentId, _extends({}, graph[currentId], {
      connections: graph[currentId].connections.map(function (id) {
        return id === nodeId ? nodeNewId : id;
      })
    })));
  }, graph);

  var graphWithoutNodeId = removeObjectProperty(nodeId, graphWithUpdatedConnections);

  return _extends({}, graphWithoutNodeId, _defineProperty({}, nodeNewId, _extends({}, graph[nodeId], { id: nodeNewId })));
};

var addGraphNodeProperty = exports.addGraphNodeProperty = function addGraphNodeProperty(nodeId, propKey, propValue, graph) {
  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof nodeId === 'undefined' || typeof propKey === 'undefined' || !graph[nodeId] || graph[nodeId].hasOwnProperty(propKey)) {
    return graph;
  }

  return _extends({}, graph, _defineProperty({}, nodeId, _extends({}, graph[nodeId], _defineProperty({}, propKey, propValue))));
};

var editGraphNodeProperty = exports.editGraphNodeProperty = function editGraphNodeProperty(nodeId, propKey, propNewValue, graph) {
  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof nodeId === 'undefined' || typeof propKey === 'undefined' || !graph[nodeId] || propKey === 'id' || propKey === 'connections' || !graph[nodeId].hasOwnProperty(propKey) || propNewValue === graph[nodeId][propKey]) {
    return graph;
  }

  return _extends({}, graph, _defineProperty({}, nodeId, _extends({}, graph[nodeId], _defineProperty({}, propKey, propNewValue))));
};

var removeGraphNodeProperty = exports.removeGraphNodeProperty = function removeGraphNodeProperty(nodeId, propKey, graph) {
  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof nodeId === 'undefined' || typeof propKey === 'undefined' || !graph[nodeId] || propKey === 'id' || propKey === 'connections' || !graph[nodeId].hasOwnProperty(propKey)) {
    return graph;
  }

  return _extends({}, graph, _defineProperty({}, nodeId, removeObjectProperty(propKey, graph[nodeId])));
};

var addConnection = exports.addConnection = function addConnection(nodeAId, nodeBId, graph) {
  var _extends13;

  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof nodeAId === 'undefined' || typeof nodeBId === 'undefined' || !graph[nodeAId] || !graph[nodeBId] || graph[nodeAId].connections.includes(nodeBId) && graph[nodeBId].connections.includes(nodeAId)) {
    return graph;
  }

  return _extends({}, graph, (_extends13 = {}, _defineProperty(_extends13, nodeAId, _extends({}, graph[nodeAId], {
    connections: [].concat(_toConsumableArray(graph[nodeAId].connections), [nodeBId])
  })), _defineProperty(_extends13, nodeBId, _extends({}, graph[nodeBId], {
    connections: [].concat(_toConsumableArray(graph[nodeBId].connections), [nodeAId])
  })), _extends13));
};

var removeConnection = exports.removeConnection = function removeConnection(nodeAId, nodeBId, graph) {
  var _extends14;

  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof nodeAId === 'undefined' || typeof nodeBId === 'undefined' || !graph[nodeAId] || !graph[nodeBId] || !graph[nodeAId].connections.includes(nodeBId) && !graph[nodeBId].connections.includes(nodeAId)) {
    return graph;
  }

  return _extends({}, graph, (_extends14 = {}, _defineProperty(_extends14, nodeAId, _extends({}, graph[nodeAId], {
    connections: graph[nodeAId].connections.filter(function (id) {
      return id !== nodeBId;
    })
  })), _defineProperty(_extends14, nodeBId, _extends({}, graph[nodeBId], {
    connections: graph[nodeBId].connections.filter(function (id) {
      return id !== nodeAId;
    })
  })), _extends14));
};

var removeAllConnections = exports.removeAllConnections = function removeAllConnections(nodeId, graph) {
  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof nodeId === 'undefined' || !graph[nodeId]) {
    return graph;
  }

  return graph[nodeId].connections.reduce(function (graphAccumulator, currentNodeId) {
    return removeConnection(nodeId, currentNodeId, graphAccumulator);
  }, graph);
};

var removeNode = exports.removeNode = function removeNode(nodeId, graph) {
  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof nodeId === 'undefined') {
    return graph;
  }

  var graphWithoutNodeIdConnections = removeAllConnections(nodeId, graph);

  return removeObjectProperty(nodeId, graphWithoutNodeIdConnections);
};