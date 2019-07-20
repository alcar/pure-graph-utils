"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNode = exports.removeAllConnections = exports.removeConnection = exports.addConnection = exports.removeGraphNodeProperty = exports.editGraphNodeProperty = exports.addGraphNodeProperty = exports.changeGraphNodeId = exports.addNode = exports.createGraph = exports.removeNodeProperty = exports.editNodeProperty = exports.addNodeProperty = exports.changeNodeId = exports.createNode = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EMPTY_OBJECT = {};

var removeObjectProperty = function removeObjectProperty(propKey, targetObject) {
  return Object.keys(targetObject).filter(function (key) {
    return key !== propKey;
  }).reduce(function (objectAccumulator, currentPropKey) {
    return _objectSpread({}, objectAccumulator, _defineProperty({}, currentPropKey, targetObject[currentPropKey]));
  }, {});
};

var createNode = function createNode(id, value) {
  if (typeof id === 'undefined') {
    return EMPTY_OBJECT;
  }

  return {
    id: id,
    value: value
  };
};

exports.createNode = createNode;

var changeNodeId = function changeNodeId(newId, node) {
  if (typeof node === 'undefined') {
    return createNode();
  }

  if (typeof newId === 'undefined' || newId === node.id) {
    return node;
  }

  return _objectSpread({}, node, {
    id: newId
  });
};

exports.changeNodeId = changeNodeId;

var addNodeProperty = function addNodeProperty(propKey, propValue, node) {
  if (typeof node === 'undefined') {
    return createNode();
  }

  if (typeof propKey === 'undefined' || node.hasOwnProperty(propKey)) {
    return node;
  }

  return _objectSpread({}, node, _defineProperty({}, propKey, propValue));
};

exports.addNodeProperty = addNodeProperty;

var editNodeProperty = function editNodeProperty(propKey, propNewValue, node) {
  if (typeof node === 'undefined') {
    return createNode();
  }

  if (typeof propKey === 'undefined' || !node.hasOwnProperty(propKey) || propNewValue === node[propKey]) {
    return node;
  }

  return _objectSpread({}, node, _defineProperty({}, propKey, propNewValue));
};

exports.editNodeProperty = editNodeProperty;

var removeNodeProperty = function removeNodeProperty(propKey, node) {
  if (typeof node === 'undefined') {
    return createNode();
  }

  if (typeof propKey === 'undefined' || !node.hasOwnProperty(propKey) || propKey === 'id') {
    return node;
  }

  return removeObjectProperty(propKey, node);
};

exports.removeNodeProperty = removeNodeProperty;

var createGraph = function createGraph(node) {
  if (typeof node === 'undefined' || typeof node.id === 'undefined') {
    return EMPTY_OBJECT;
  }

  var completeNode = !node.connections || node.connections.length > 0 ? _objectSpread({}, node, {
    connections: []
  }) : node;
  return _defineProperty({}, node.id, completeNode);
};

exports.createGraph = createGraph;

var addNode = function addNode(node, graph) {
  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof node === 'undefined' || !node.id || typeof graph[node.id] !== 'undefined') {
    return graph;
  }

  var completeNode = !node.connections || node.connections.length > 0 ? _objectSpread({}, node, {
    connections: []
  }) : node;
  return _objectSpread({}, graph, _defineProperty({}, node.id, completeNode));
};

exports.addNode = addNode;

var changeGraphNodeId = function changeGraphNodeId(nodeId, nodeNewId, graph) {
  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof nodeId === 'undefined' || typeof nodeNewId === 'undefined' || !graph[nodeId] || nodeNewId === nodeId) {
    return graph;
  }

  var graphWithUpdatedConnections = graph[nodeId].connections.reduce(function (graphAccumulator, currentId) {
    return _objectSpread({}, graphAccumulator, _defineProperty({}, currentId, _objectSpread({}, graph[currentId], {
      connections: graph[currentId].connections.map(function (id) {
        return id === nodeId ? nodeNewId : id;
      })
    })));
  }, graph);
  var graphWithoutNodeId = removeObjectProperty(nodeId, graphWithUpdatedConnections);
  return _objectSpread({}, graphWithoutNodeId, _defineProperty({}, nodeNewId, _objectSpread({}, graph[nodeId], {
    id: nodeNewId
  })));
};

exports.changeGraphNodeId = changeGraphNodeId;

var addGraphNodeProperty = function addGraphNodeProperty(nodeId, propKey, propValue, graph) {
  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof nodeId === 'undefined' || typeof propKey === 'undefined' || !graph[nodeId] || graph[nodeId].hasOwnProperty(propKey)) {
    return graph;
  }

  return _objectSpread({}, graph, _defineProperty({}, nodeId, _objectSpread({}, graph[nodeId], _defineProperty({}, propKey, propValue))));
};

exports.addGraphNodeProperty = addGraphNodeProperty;

var editGraphNodeProperty = function editGraphNodeProperty(nodeId, propKey, propNewValue, graph) {
  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof nodeId === 'undefined' || typeof propKey === 'undefined' || !graph[nodeId] || propKey === 'id' || propKey === 'connections' || !graph[nodeId].hasOwnProperty(propKey) || propNewValue === graph[nodeId][propKey]) {
    return graph;
  }

  return _objectSpread({}, graph, _defineProperty({}, nodeId, _objectSpread({}, graph[nodeId], _defineProperty({}, propKey, propNewValue))));
};

exports.editGraphNodeProperty = editGraphNodeProperty;

var removeGraphNodeProperty = function removeGraphNodeProperty(nodeId, propKey, graph) {
  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof nodeId === 'undefined' || typeof propKey === 'undefined' || !graph[nodeId] || propKey === 'id' || propKey === 'connections' || !graph[nodeId].hasOwnProperty(propKey)) {
    return graph;
  }

  return _objectSpread({}, graph, _defineProperty({}, nodeId, removeObjectProperty(propKey, graph[nodeId])));
};

exports.removeGraphNodeProperty = removeGraphNodeProperty;

var addConnection = function addConnection(nodeAId, nodeBId, graph) {
  var _objectSpread13;

  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof nodeAId === 'undefined' || typeof nodeBId === 'undefined' || !graph[nodeAId] || !graph[nodeBId] || graph[nodeAId].connections.includes(nodeBId) && graph[nodeBId].connections.includes(nodeAId)) {
    return graph;
  }

  return _objectSpread({}, graph, (_objectSpread13 = {}, _defineProperty(_objectSpread13, nodeAId, _objectSpread({}, graph[nodeAId], {
    connections: [].concat(_toConsumableArray(graph[nodeAId].connections), [nodeBId])
  })), _defineProperty(_objectSpread13, nodeBId, _objectSpread({}, graph[nodeBId], {
    connections: [].concat(_toConsumableArray(graph[nodeBId].connections), [nodeAId])
  })), _objectSpread13));
};

exports.addConnection = addConnection;

var removeConnection = function removeConnection(nodeAId, nodeBId, graph) {
  var _objectSpread14;

  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof nodeAId === 'undefined' || typeof nodeBId === 'undefined' || !graph[nodeAId] || !graph[nodeBId] || !graph[nodeAId].connections.includes(nodeBId) && !graph[nodeBId].connections.includes(nodeAId)) {
    return graph;
  }

  return _objectSpread({}, graph, (_objectSpread14 = {}, _defineProperty(_objectSpread14, nodeAId, _objectSpread({}, graph[nodeAId], {
    connections: graph[nodeAId].connections.filter(function (id) {
      return id !== nodeBId;
    })
  })), _defineProperty(_objectSpread14, nodeBId, _objectSpread({}, graph[nodeBId], {
    connections: graph[nodeBId].connections.filter(function (id) {
      return id !== nodeAId;
    })
  })), _objectSpread14));
};

exports.removeConnection = removeConnection;

var removeAllConnections = function removeAllConnections(nodeId, graph) {
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

exports.removeAllConnections = removeAllConnections;

var removeNode = function removeNode(nodeId, graph) {
  if (typeof graph === 'undefined') {
    return createGraph();
  }

  if (typeof nodeId === 'undefined') {
    return graph;
  }

  var graphWithoutNodeIdConnections = removeAllConnections(nodeId, graph);
  return removeObjectProperty(nodeId, graphWithoutNodeIdConnections);
};

exports.removeNode = removeNode;