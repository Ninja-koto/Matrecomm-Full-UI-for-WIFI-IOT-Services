var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { observable, computed, action, autorun } from 'mobx';
import { TreeNode } from './tree-node.model';
import { TreeOptions } from './tree-options.model';
import { TREE_EVENTS, newName } from '../constants/events';
import * as _ from 'lodash';
var first = _.first, last = _.last, compact = _.compact, find = _.find, includes = _.includes, remove = _.remove, indexOf = _.indexOf, pullAt = _.pullAt, isString = _.isString, isFunction = _.isFunction;
var TreeModel = (function () {
    function TreeModel() {
        this.options = new TreeOptions();
        this.eventNames = Object.keys(TREE_EVENTS);
        this.expandedNodeIds = {};
        this.activeNodeIds = {};
        this.hiddenNodeIds = {};
        this.focusedNodeId = null;
        this.firstUpdate = true;
    }
    // events
    TreeModel.prototype.fireEvent = function (event) {
        event.treeModel = this;
        var newEventName = newName(event.eventName);
        var deprecatedEvent = Object.assign({}, event, {
            deprecated: "This event is deprecated, please use " + newEventName + " instead"
        });
        event.eventName = newEventName;
        this.events[deprecatedEvent.eventName].emit(deprecatedEvent);
        this.events[event.eventName].emit(event);
        this.events.onEvent.emit(deprecatedEvent);
        this.events.event.emit(event);
    };
    TreeModel.prototype.subscribe = function (eventName, fn) {
        this.events[eventName].subscribe(fn);
    };
    // getters
    TreeModel.prototype.getFocusedNode = function () {
        return this.focusedNode;
    };
    TreeModel.prototype.getActiveNode = function () {
        return this.activeNodes[0];
    };
    TreeModel.prototype.getActiveNodes = function () {
        return this.activeNodes;
    };
    TreeModel.prototype.getVisibleRoots = function () {
        return this.virtualRoot.visibleChildren;
    };
    TreeModel.prototype.getFirstRoot = function (skipHidden) {
        if (skipHidden === void 0) { skipHidden = false; }
        return first(skipHidden ? this.getVisibleRoots() : this.roots);
    };
    TreeModel.prototype.getLastRoot = function (skipHidden) {
        if (skipHidden === void 0) { skipHidden = false; }
        return last(skipHidden ? this.getVisibleRoots() : this.roots);
    };
    Object.defineProperty(TreeModel.prototype, "isFocused", {
        get: function () {
            return TreeModel.focusedTree === this;
        },
        enumerable: true,
        configurable: true
    });
    TreeModel.prototype.isNodeFocused = function (node) {
        return this.focusedNode === node;
    };
    TreeModel.prototype.isEmptyTree = function () {
        return this.roots && this.roots.length === 0;
    };
    Object.defineProperty(TreeModel.prototype, "focusedNode", {
        get: function () {
            return this.focusedNodeId ? this.getNodeById(this.focusedNodeId) : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeModel.prototype, "expandedNodes", {
        get: function () {
            var _this = this;
            var nodes = Object.keys(this.expandedNodeIds)
                .filter(function (id) { return _this.expandedNodeIds[id]; })
                .map(function (id) { return _this.getNodeById(id); });
            return compact(nodes);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeModel.prototype, "activeNodes", {
        get: function () {
            var _this = this;
            var nodes = Object.keys(this.activeNodeIds)
                .filter(function (id) { return _this.activeNodeIds[id]; })
                .map(function (id) { return _this.getNodeById(id); });
            return compact(nodes);
        },
        enumerable: true,
        configurable: true
    });
    // locating nodes
    TreeModel.prototype.getNodeByPath = function (path, startNode) {
        if (startNode === void 0) { startNode = null; }
        if (!path)
            return null;
        startNode = startNode || this.virtualRoot;
        if (path.length === 0)
            return startNode;
        if (!startNode.children)
            return null;
        var childId = path.shift();
        var childNode = find(startNode.children, { id: childId });
        if (!childNode)
            return null;
        return this.getNodeByPath(path, childNode);
    };
    TreeModel.prototype.getNodeById = function (id) {
        var idStr = id.toString();
        return this.getNodeBy(function (node) { return node.id.toString() === idStr; });
    };
    TreeModel.prototype.getNodeBy = function (predicate, startNode) {
        if (startNode === void 0) { startNode = null; }
        startNode = startNode || this.virtualRoot;
        if (!startNode.children)
            return null;
        var found = find(startNode.children, predicate);
        if (found) {
            return found;
        }
        else {
            for (var _i = 0, _a = startNode.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var foundInChildren = this.getNodeBy(predicate, child);
                if (foundInChildren)
                    return foundInChildren;
            }
        }
    };
    TreeModel.prototype.isExpanded = function (node) {
        return this.expandedNodeIds[node.id];
    };
    TreeModel.prototype.isHidden = function (node) {
        return this.hiddenNodeIds[node.id];
    };
    TreeModel.prototype.isActive = function (node) {
        return this.activeNodeIds[node.id];
    };
    // actions
    TreeModel.prototype.setData = function (_a) {
        var nodes = _a.nodes, _b = _a.options, options = _b === void 0 ? null : _b, _c = _a.events, events = _c === void 0 ? null : _c;
        if (options) {
            this.options = new TreeOptions(options);
        }
        if (events) {
            this.events = events;
        }
        if (nodes) {
            this.nodes = nodes;
        }
        this.update();
    };
    TreeModel.prototype.update = function () {
        // Rebuild tree:
        var virtualRootConfig = (_a = {
                virtual: true
            },
            _a[this.options.childrenField] = this.nodes,
            _a);
        this.virtualRoot = new TreeNode(virtualRootConfig, null, this, 0);
        this.roots = this.virtualRoot.children;
        // Fire event:
        if (this.firstUpdate) {
            if (this.roots) {
                this.firstUpdate = false;
                this._calculateExpandedNodes();
            }
        }
        else {
            this.fireEvent({ eventName: TREE_EVENTS.onUpdateData });
        }
        var _a;
    };
    TreeModel.prototype.setFocusedNode = function (node) {
        this.focusedNodeId = node ? node.id : null;
    };
    TreeModel.prototype.setFocus = function (value) {
        TreeModel.focusedTree = value ? this : null;
    };
    TreeModel.prototype.doForAll = function (fn) {
        this.roots.forEach(function (root) { return root.doForAll(fn); });
    };
    TreeModel.prototype.focusNextNode = function () {
        var previousNode = this.getFocusedNode();
        var nextNode = previousNode ? previousNode.findNextNode(true, true) : this.getFirstRoot(true);
        if (nextNode)
            nextNode.focus();
    };
    TreeModel.prototype.focusPreviousNode = function () {
        var previousNode = this.getFocusedNode();
        var nextNode = previousNode ? previousNode.findPreviousNode(true) : this.getLastRoot(true);
        if (nextNode)
            nextNode.focus();
    };
    TreeModel.prototype.focusDrillDown = function () {
        var previousNode = this.getFocusedNode();
        if (previousNode && previousNode.isCollapsed && previousNode.hasChildren) {
            previousNode.toggleExpanded();
        }
        else {
            var nextNode = previousNode ? previousNode.getFirstChild(true) : this.getFirstRoot(true);
            if (nextNode)
                nextNode.focus();
        }
    };
    TreeModel.prototype.focusDrillUp = function () {
        var previousNode = this.getFocusedNode();
        if (!previousNode)
            return;
        if (previousNode.isExpanded) {
            previousNode.toggleExpanded();
        }
        else {
            var nextNode = previousNode.realParent;
            if (nextNode)
                nextNode.focus();
        }
    };
    TreeModel.prototype.setActiveNode = function (node, value, multi) {
        if (multi === void 0) { multi = false; }
        if (multi) {
            this._setActiveNodeMulti(node, value);
        }
        else {
            this._setActiveNodeSingle(node, value);
        }
        if (value) {
            node.focus();
            this.fireEvent({ eventName: TREE_EVENTS.onActivate, node: node });
        }
        else {
            this.fireEvent({ eventName: TREE_EVENTS.onDeactivate, node: node });
        }
    };
    TreeModel.prototype.setExpandedNode = function (node, value) {
        this.expandedNodeIds = Object.assign({}, this.expandedNodeIds, (_a = {}, _a[node.id] = value, _a));
        this.fireEvent({ eventName: TREE_EVENTS.onToggleExpanded, node: node, isExpanded: value });
        var _a;
    };
    TreeModel.prototype.expandAll = function () {
        this.roots.forEach(function (root) { return root.expandAll(); });
    };
    TreeModel.prototype.collapseAll = function () {
        this.roots.forEach(function (root) { return root.collapseAll(); });
    };
    TreeModel.prototype.setIsHidden = function (node, value) {
        this.hiddenNodeIds = Object.assign({}, this.hiddenNodeIds, (_a = {}, _a[node.id] = value, _a));
        var _a;
    };
    TreeModel.prototype.setHiddenNodeIds = function (nodeIds) {
        this.hiddenNodeIds = nodeIds.reduce(function (id, hiddenNodeIds) {
            return Object.assign(hiddenNodeIds, (_a = {},
                _a[id] = true,
                _a));
            var _a;
        }, {});
    };
    TreeModel.prototype.performKeyAction = function (node, $event) {
        var action = this.options.actionMapping.keys[$event.keyCode];
        if (action) {
            $event.preventDefault();
            action(this, node, $event);
            return true;
        }
        else {
            return false;
        }
    };
    TreeModel.prototype.filterNodes = function (filter, autoShow) {
        var _this = this;
        if (autoShow === void 0) { autoShow = true; }
        var filterFn;
        if (!filter) {
            return this.clearFilter();
        }
        // support function and string filter
        if (isString(filter)) {
            filterFn = function (node) { return node.displayField.toLowerCase().indexOf(filter.toLowerCase()) !== -1; };
        }
        else if (isFunction(filter)) {
            filterFn = filter;
        }
        else {
            console.error('Don\'t know what to do with filter', filter);
            console.error('Should be either a string or function');
            return;
        }
        var ids = {};
        this.roots.forEach(function (node) { return _this._filterNode(ids, node, filterFn, autoShow); });
        this.hiddenNodeIds = ids;
        this.fireEvent({ eventName: TREE_EVENTS.onChangeFilter });
    };
    TreeModel.prototype.clearFilter = function () {
        this.hiddenNodeIds = {};
        this.fireEvent({ eventName: TREE_EVENTS.onChangeFilter });
    };
    TreeModel.prototype.moveNode = function (node, to) {
        var fromIndex = node.getIndexInParent();
        var fromParent = node.parent;
        if (!this._canMoveNode(node, fromIndex, to))
            return;
        var fromChildren = fromParent.getField('children');
        // If node doesn't have children - create children array
        if (!to.parent.getField('children')) {
            to.parent.setField('children', []);
        }
        var toChildren = to.parent.getField('children');
        var originalNode = fromChildren.splice(fromIndex, 1)[0];
        // Compensate for index if already removed from parent:
        var toIndex = (fromParent === to.parent && to.index > fromIndex) ? to.index - 1 : to.index;
        toChildren.splice(toIndex, 0, originalNode);
        fromParent.treeModel.update();
        if (to.parent.treeModel !== fromParent.treeModel) {
            to.parent.treeModel.update();
        }
        this.fireEvent({ eventName: TREE_EVENTS.onMoveNode, node: originalNode, to: { parent: to.parent.data, index: toIndex } });
    };
    TreeModel.prototype.getState = function () {
        return {
            expandedNodeIds: this.expandedNodeIds,
            activeNodeIds: this.activeNodeIds,
            hiddenNodeIds: this.hiddenNodeIds,
            focusedNodeId: this.focusedNodeId
        };
    };
    TreeModel.prototype.setState = function (state) {
        if (!state)
            return;
        Object.assign(this, {
            expandedNodeIds: state.expandedNodeIds,
            activeNodeIds: state.activeNodeIds,
            hiddenNodeIds: state.hiddenNodeIds,
            focusedNodeId: state.focusedNodeId
        });
    };
    TreeModel.prototype.subscribeToState = function (fn) {
        var _this = this;
        autorun(function () { return fn(_this.getState()); });
    };
    // private methods
    TreeModel.prototype._canMoveNode = function (node, fromIndex, to) {
        // same node:
        if (node.parent === to.parent && fromIndex === to.index) {
            return false;
        }
        return !to.parent.isDescendantOf(node);
    };
    TreeModel.prototype._filterNode = function (ids, node, filterFn, autoShow) {
        var _this = this;
        // if node passes function then it's visible
        var isVisible = filterFn(node);
        if (node.children) {
            // if one of node's children passes filter then this node is also visible
            node.children.forEach(function (child) {
                if (_this._filterNode(ids, child, filterFn, autoShow)) {
                    isVisible = true;
                }
            });
        }
        // mark node as hidden
        if (!isVisible) {
            ids[node.id] = true;
        }
        // auto expand parents to make sure the filtered nodes are visible
        if (autoShow && isVisible) {
            node.ensureVisible();
        }
        return isVisible;
    };
    TreeModel.prototype._calculateExpandedNodes = function (startNode) {
        var _this = this;
        if (startNode === void 0) { startNode = null; }
        startNode = startNode || this.virtualRoot;
        if (startNode.data[this.options.isExpandedField]) {
            this.expandedNodeIds = Object.assign({}, this.expandedNodeIds, (_a = {}, _a[startNode.id] = true, _a));
        }
        if (startNode.children) {
            startNode.children.forEach(function (child) { return _this._calculateExpandedNodes(child); });
        }
        var _a;
    };
    TreeModel.prototype._setActiveNodeSingle = function (node, value) {
        var _this = this;
        // Deactivate all other nodes:
        this.activeNodes
            .filter(function (activeNode) { return activeNode !== node; })
            .forEach(function (activeNode) {
            _this.fireEvent({ eventName: TREE_EVENTS.onDeactivate, node: activeNode });
        });
        if (value) {
            this.activeNodeIds = (_a = {}, _a[node.id] = true, _a);
        }
        else {
            this.activeNodeIds = {};
        }
        var _a;
    };
    TreeModel.prototype._setActiveNodeMulti = function (node, value) {
        this.activeNodeIds = Object.assign({}, this.activeNodeIds, (_a = {}, _a[node.id] = value, _a));
        var _a;
    };
    return TreeModel;
}());
export { TreeModel };
TreeModel.focusedTree = null;
TreeModel.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TreeModel.ctorParameters = function () { return []; };
__decorate([
    observable,
    __metadata("design:type", Array)
], TreeModel.prototype, "roots", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], TreeModel.prototype, "expandedNodeIds", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], TreeModel.prototype, "activeNodeIds", void 0);
__decorate([
    observable,
    __metadata("design:type", Object)
], TreeModel.prototype, "hiddenNodeIds", void 0);
__decorate([
    observable,
    __metadata("design:type", String)
], TreeModel.prototype, "focusedNodeId", void 0);
__decorate([
    observable,
    __metadata("design:type", TreeNode)
], TreeModel.prototype, "virtualRoot", void 0);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], TreeModel.prototype, "focusedNode", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], TreeModel.prototype, "expandedNodes", null);
__decorate([
    computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], TreeModel.prototype, "activeNodes", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "setData", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "update", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "setFocusedNode", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "setFocus", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "doForAll", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "focusNextNode", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "focusPreviousNode", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "focusDrillDown", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "focusDrillUp", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "setActiveNode", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "setExpandedNode", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "expandAll", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "collapseAll", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "setIsHidden", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "setHiddenNodeIds", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "filterNodes", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "clearFilter", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "moveNode", null);
__decorate([
    action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TreeModel.prototype, "setState", null);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tb2RlbHMvdHJlZS5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBQSxFQUF5QixNQUFPLGVBQUEsQ0FBZ0I7QUFDekQsT0FBTyxFQUFFLFVBQUEsRUFBWSxRQUFBLEVBQVUsTUFBQSxFQUFRLE9BQUEsRUFBUSxNQUFPLE1BQUEsQ0FBTztBQUM3RCxPQUFPLEVBQUUsUUFBQSxFQUFTLE1BQU8sbUJBQUEsQ0FBb0I7QUFDN0MsT0FBTyxFQUFFLFdBQUEsRUFBWSxNQUFPLHNCQUFBLENBQXVCO0FBR25ELE9BQU8sRUFBRSxXQUFBLEVBQWEsT0FBQSxFQUFRLE1BQU8scUJBQUEsQ0FBc0I7QUFFM0QsT0FBTyxLQUFLLENBQUEsTUFBTyxRQUFBLENBQVM7QUFFcEIsSUFBQSxlQUFBLEVBQU8sYUFBQSxFQUFNLG1CQUFBLEVBQVMsYUFBQSxFQUFNLHFCQUFBLEVBQ2xDLGlCQUFNLEVBQUUsbUJBQUEsRUFBUyxpQkFBQSxFQUFRLHFCQUFBLEVBQVUseUJBQUEsQ0FBaUI7QUFHdEQ7SUFrQkU7UUFmQSxZQUFPLEdBQWdCLElBQUksV0FBVyxFQUFFLENBQUM7UUFFekMsZUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFJMUIsb0JBQWUsR0FBOEIsRUFBRSxDQUFDO1FBQ2hELGtCQUFhLEdBQThCLEVBQUUsQ0FBQztRQUM5QyxrQkFBYSxHQUE4QixFQUFFLENBQUM7UUFDOUMsa0JBQWEsR0FBVyxJQUFJLENBQUM7UUFHakMsZ0JBQVcsR0FBRyxJQUFJLENBQUM7SUFJM0IsQ0FBQztJQUVELFNBQVM7SUFDVCw2QkFBUyxHQUFULFVBQVUsS0FBSztRQUNiLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUMsSUFBTSxlQUFlLEdBQUcsTUFBTSxD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WU47QUFFTztJQUFQLE1BQU07Ozs7dUNBb0JOO0FBR087SUFBUCxNQUFNOzs7OytDQUVOO0FBRU87SUFBUCxNQUFNOzs7O3lDQUVOO0FBRU87SUFBUCxNQUFNOzs7O3lDQUVOO0FBRU87SUFBUCxNQUFNOzs7OzhDQUlOO0FBRU87SUFBUCxNQUFNOzs7O2tEQUlOO0FBRU87SUFBUCxNQUFNOzs7OytDQVNOO0FBRU87SUFBUCxNQUFNOzs7OzZDQVVOO0FBRU87SUFBUCxNQUFNOzs7OzhDQWNOO0FBRU87SUFBUCxNQUFNOzs7O2dEQUdOO0FBRU87SUFBUCxNQUFNOzs7OzBDQUVOO0FBRU87SUFBUCxNQUFNOzs7OzRDQUVOO0FBRU87SUFBUCxNQUFNOzs7OzRDQUVOO0FBRU87SUFBUCxNQUFNOzs7O2lEQUlOO0FBYU87SUFBUCxNQUFNOzs7OzRDQXdCTjtBQUVPO0lBQVAsTUFBTTs7Ozs0Q0FHTjtBQUVPO0lBQVAsTUFBTTs7Ozt5Q0EyQk47QUFXTztJQUFQLE1BQU07Ozs7eUNBU04iLCJmaWxlIjoidHJlZS5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IG9ic2VydmFibGUsIGNvbXB1dGVkLCBhY3Rpb24sIGF1dG9ydW4gfSBmcm9tICdtb2J4JztcbmltcG9ydCB7IFRyZWVOb2RlIH0gZnJvbSAnLi90cmVlLW5vZGUubW9kZWwnO1xuaW1wb3J0IHsgVHJlZU9wdGlvbnMgfSBmcm9tICcuL3RyZWUtb3B0aW9ucy5tb2RlbCc7XG5pbXBvcnQgeyBUcmVlVmlydHVhbFNjcm9sbCB9IGZyb20gJy4vdHJlZS12aXJ0dWFsLXNjcm9sbC5tb2RlbCc7XG5pbXBvcnQgeyBJVHJlZU1vZGVsIH0gZnJvbSAnLi4vZGVmcy9hcGknO1xuaW1wb3J0IHsgVFJFRV9FVkVOVFMsIG5ld05hbWUgfSBmcm9tICcuLi9jb25zdGFudHMvZXZlbnRzJztcblxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG5jb25zdCB7IGZpcnN0LCBsYXN0LCBjb21wYWN0LCBmaW5kLCBpbmNsdWRlcyxcbiAgcmVtb3ZlLCBpbmRleE9mLCBwdWxsQXQsIGlzU3RyaW5nLCBpc0Z1bmN0aW9uIH0gPSBfO1xuXG5cbmV4cG9ydCBjbGFzcyBUcmVlTW9kZWwgaW1wbGVtZW50cyBJVHJlZU1vZGVsIHtcbiAgc3RhdGljIGZvY3VzZWRUcmVlID0gbnVsbDtcblxuICBvcHRpb25zOiBUcmVlT3B0aW9ucyA9IG5ldyBUcmVlT3B0aW9ucygpO1xuICBub2RlczogYW55W107XG4gIGV2ZW50TmFtZXMgPSBPYmplY3Qua2V5cyhUUkVFX0VWRU5UUyk7XG4gIHZpcnR1YWxTY3JvbGw6IFRyZWVWaXJ0dWFsU2Nyb2xsO1xuXG4gIEBvYnNlcnZhYmxlIHJvb3RzOiBUcmVlTm9kZVtdO1xuICBAb2JzZXJ2YWJsZSBleHBhbmRlZE5vZGVJZHM6IHsgW2lkOiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcbiAgQG9ic2VydmFibGUgYWN0aXZlTm9kZUlkczogeyBbaWQ6IHN0cmluZ106IGJvb2xlYW4gfSA9IHt9O1xuICBAb2JzZXJ2YWJsZSBoaWRkZW5Ob2RlSWRzOiB7IFtpZDogc3RyaW5nXTogYm9vbGVhbiB9ID0ge307XG4gIEBvYnNlcnZhYmxlIGZvY3VzZWROb2RlSWQ6IHN0cmluZyA9IG51bGw7XG4gIEBvYnNlcnZhYmxlIHZpcnR1YWxSb290OiBUcmVlTm9kZTtcblxuICBwcml2YXRlIGZpcnN0VXBkYXRlID0gdHJ1ZTtcbiAgcHJpdmF0ZSBldmVudHM6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIC8vIGV2ZW50c1xuICBmaXJlRXZlbnQoZXZlbnQpIHtcbiAgICBldmVudC50cmVlTW9kZWwgPSB0aGlzO1xuICAgIGNvbnN0IG5ld0V2ZW50TmFtZSA9IG5ld05hbWUoZXZlbnQuZXZlbnROYW1lKTtcbiAgICBjb25zdCBkZXByZWNhdGVkRXZlbnQgPSBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge1xuICAgICAgZGVwcmVjYXRlZDogYFRoaXMgZXZlbnQgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSAke25ld0V2ZW50TmFtZX0gaW5zdGVhZGBcbiAgICB9KTtcbiAgICBldmVudC5ldmVudE5hbWUgPSBuZXdFdmVudE5hbWU7XG5cbiAgICB0aGlzLmV2ZW50c1tkZXByZWNhdGVkRXZlbnQuZXZlbnROYW1lXS5lbWl0KGRlcHJlY2F0ZWRFdmVudCk7XG4gICAgdGhpcy5ldmVudHNbZXZlbnQuZXZlbnROYW1lXS5lbWl0KGV2ZW50KTtcbiAgICB0aGlzLmV2ZW50cy5vbkV2ZW50LmVtaXQoZGVwcmVjYXRlZEV2ZW50KTtcbiAgICB0aGlzLmV2ZW50cy5ldmVudC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIHN1YnNjcmliZShldmVudE5hbWUsIGZuKSB7XG4gICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5zdWJzY3JpYmUoZm4pO1xuICB9XG5cblxuICAvLyBnZXR0ZXJzXG4gIGdldEZvY3VzZWROb2RlKCk6IFRyZWVOb2RlIHtcbiAgICByZXR1cm4gdGhpcy5mb2N1c2VkTm9kZTtcbiAgfVxuXG5cbiAgZ2V0QWN0aXZlTm9kZSgpOiBUcmVlTm9kZSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlTm9kZXNbMF07XG4gIH1cblxuICBnZXRBY3RpdmVOb2RlcygpOiBUcmVlTm9kZVtdIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVOb2RlcztcbiAgfVxuXG4gIGdldFZpc2libGVSb290cygpIHtcbiAgICByZXR1cm4gdGhpcy52aXJ0dWFsUm9vdC52aXNpYmxlQ2hpbGRyZW47XG4gIH1cblxuICBnZXRGaXJzdFJvb3Qoc2tpcEhpZGRlbiA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIGZpcnN0KHNraXBIaWRkZW4gPyB0aGlzLmdldFZpc2libGVSb290cygpIDogdGhpcy5yb290cyk7XG4gIH1cblxuICBnZXRMYXN0Um9vdChza2lwSGlkZGVuID0gZmFsc2UpIHtcbiAgICByZXR1cm4gbGFzdChza2lwSGlkZGVuID8gdGhpcy5nZXRWaXNpYmxlUm9vdHMoKSA6IHRoaXMucm9vdHMpO1xuICB9XG5cbiAgZ2V0IGlzRm9jdXNlZCgpIHtcbiAgICByZXR1cm4gVHJlZU1vZGVsLmZvY3VzZWRUcmVlID09PSB0aGlzO1xuICB9XG5cbiAgaXNOb2RlRm9jdXNlZChub2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9jdXNlZE5vZGUgPT09IG5vZGU7XG4gIH1cblxuICBpc0VtcHR5VHJlZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5yb290cyAmJiB0aGlzLnJvb3RzLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIEBjb21wdXRlZCBnZXQgZm9jdXNlZE5vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9jdXNlZE5vZGVJZCA/IHRoaXMuZ2V0Tm9kZUJ5SWQodGhpcy5mb2N1c2VkTm9kZUlkKSA6IG51bGw7XG4gIH1cblxuICBAY29tcHV0ZWQgZ2V0IGV4cGFuZGVkTm9kZXMoKSB7XG4gICAgY29uc3Qgbm9kZXMgPSBPYmplY3Qua2V5cyh0aGlzLmV4cGFuZGVkTm9kZUlkcylcbiAgICAgIC5maWx0ZXIoKGlkKSA9PiB0aGlzLmV4cGFuZGVkTm9kZUlkc1tpZF0pXG4gICAgICAubWFwKChpZCkgPT4gdGhpcy5nZXROb2RlQnlJZChpZCkpO1xuXG4gICAgcmV0dXJuIGNvbXBhY3Qobm9kZXMpO1xuICB9XG5cbiAgQGNvbXB1dGVkIGdldCBhY3RpdmVOb2RlcygpIHtcbiAgICBjb25zdCBub2RlcyA9IE9iamVjdC5rZXlzKHRoaXMuYWN0aXZlTm9kZUlkcylcbiAgICAgIC5maWx0ZXIoKGlkKSA9PiB0aGlzLmFjdGl2ZU5vZGVJZHNbaWRdKVxuICAgICAgLm1hcCgoaWQpID0+IHRoaXMuZ2V0Tm9kZUJ5SWQoaWQpKTtcblxuICAgIHJldHVybiBjb21wYWN0KG5vZGVzKTtcbiAgfVxuXG4gIC8vIGxvY2F0aW5nIG5vZGVzXG4gIGdldE5vZGVCeVBhdGgocGF0aDogYW55W10sIHN0YXJ0Tm9kZT0gbnVsbCk6IFRyZWVOb2RlIHtcbiAgICBpZiAoIXBhdGgpIHJldHVybiBudWxsO1xuXG4gICAgc3RhcnROb2RlID0gc3RhcnROb2RlIHx8IHRoaXMudmlydHVhbFJvb3Q7XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gc3RhcnROb2RlO1xuXG4gICAgaWYgKCFzdGFydE5vZGUuY2hpbGRyZW4pIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgY2hpbGRJZCA9IHBhdGguc2hpZnQoKTtcbiAgICBjb25zdCBjaGlsZE5vZGUgPSBmaW5kKHN0YXJ0Tm9kZS5jaGlsZHJlbiwgeyBpZDogY2hpbGRJZCB9KTtcblxuICAgIGlmICghY2hpbGROb2RlKSByZXR1cm4gbnVsbDtcblxuICAgIHJldHVybiB0aGlzLmdldE5vZGVCeVBhdGgocGF0aCwgY2hpbGROb2RlKTtcbiAgfVxuXG4gIGdldE5vZGVCeUlkKGlkKSB7XG4gICAgY29uc3QgaWRTdHIgPSBpZC50b1N0cmluZygpO1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0Tm9kZUJ5KChub2RlKSA9PiBub2RlLmlkLnRvU3RyaW5nKCkgPT09IGlkU3RyKTtcbiAgfVxuXG4gIGdldE5vZGVCeShwcmVkaWNhdGUsIHN0YXJ0Tm9kZSA9IG51bGwpIHtcbiAgICBzdGFydE5vZGUgPSBzdGFydE5vZGUgfHwgdGhpcy52aXJ0dWFsUm9vdDtcblxuICAgIGlmICghc3RhcnROb2RlLmNoaWxkcmVuKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGZvdW5kID0gZmluZChzdGFydE5vZGUuY2hpbGRyZW4sIHByZWRpY2F0ZSk7XG5cbiAgICBpZiAoZm91bmQpIHsgLy8gZm91bmQgaW4gY2hpbGRyZW5cbiAgICAgIHJldHVybiBmb3VuZDtcbiAgICB9IGVsc2UgeyAvLyBsb29rIGluIGNoaWxkcmVuJ3MgY2hpbGRyZW5cbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHN0YXJ0Tm9kZS5jaGlsZHJlbikge1xuICAgICAgICBjb25zdCBmb3VuZEluQ2hpbGRyZW4gPSB0aGlzLmdldE5vZGVCeShwcmVkaWNhdGUsIGNoaWxkKTtcbiAgICAgICAgaWYgKGZvdW5kSW5DaGlsZHJlbikgcmV0dXJuIGZvdW5kSW5DaGlsZHJlbjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpc0V4cGFuZGVkKG5vZGUpIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbmRlZE5vZGVJZHNbbm9kZS5pZF07XG4gIH1cblxuICBpc0hpZGRlbihub2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlkZGVuTm9kZUlkc1tub2RlLmlkXTtcbiAgfVxuXG4gIGlzQWN0aXZlKG5vZGUpIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVOb2RlSWRzW25vZGUuaWRdO1xuICB9XG5cbiAgLy8gYWN0aW9uc1xuICBAYWN0aW9uIHNldERhdGEoeyBub2Rlcywgb3B0aW9ucyA9IG51bGwsIGV2ZW50cyA9IG51bGwgfToge25vZGVzOiBhbnksIG9wdGlvbnM6IGFueSwgZXZlbnRzOiBhbnl9KSB7XG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IG5ldyBUcmVlT3B0aW9ucyhvcHRpb25zKTtcbiAgICB9XG4gICAgaWYgKGV2ZW50cykge1xuICAgICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG4gICAgfVxuICAgIGlmIChub2Rlcykge1xuICAgICAgdGhpcy5ub2RlcyA9IG5vZGVzO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cblxuICBAYWN0aW9uIHVwZGF0ZSgpIHtcbiAgICAvLyBSZWJ1aWxkIHRyZWU6XG4gICAgbGV0IHZpcnR1YWxSb290Q29uZmlnID0ge1xuICAgICAgdmlydHVhbDogdHJ1ZSxcbiAgICAgIFt0aGlzLm9wdGlvbnMuY2hpbGRyZW5GaWVsZF06IHRoaXMubm9kZXNcbiAgICB9O1xuXG4gICAgdGhpcy52aXJ0dWFsUm9vdCA9IG5ldyBUcmVlTm9kZSh2aXJ0dWFsUm9vdENvbmZpZywgbnVsbCwgdGhpcywgMCk7XG5cbiAgICB0aGlzLnJvb3RzID0gdGhpcy52aXJ0dWFsUm9vdC5jaGlsZHJlbjtcblxuICAgIC8vIEZpcmUgZXZlbnQ6XG4gICAgaWYgKHRoaXMuZmlyc3RVcGRhdGUpIHtcbiAgICAgIGlmICh0aGlzLnJvb3RzKSB7XG4gICAgICAgIHRoaXMuZmlyc3RVcGRhdGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlRXhwYW5kZWROb2RlcygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZpcmVFdmVudCh7IGV2ZW50TmFtZTogVFJFRV9FVkVOVFMub25VcGRhdGVEYXRhIH0pO1xuICAgIH1cbiAgfVxuXG5cbiAgQGFjdGlvbiBzZXRGb2N1c2VkTm9kZShub2RlKSB7XG4gICAgdGhpcy5mb2N1c2VkTm9kZUlkID0gbm9kZSA/IG5vZGUuaWQgOiBudWxsO1xuICB9XG5cbiAgQGFjdGlvbiBzZXRGb2N1cyh2YWx1ZSkge1xuICAgIFRyZWVNb2RlbC5mb2N1c2VkVHJlZSA9IHZhbHVlID8gdGhpcyA6IG51bGw7XG4gIH1cblxuICBAYWN0aW9uIGRvRm9yQWxsKGZuKSB7XG4gICAgdGhpcy5yb290cy5mb3JFYWNoKChyb290KSA9PiByb290LmRvRm9yQWxsKGZuKSk7XG4gIH1cblxuICBAYWN0aW9uIGZvY3VzTmV4dE5vZGUoKSB7XG4gICAgbGV0IHByZXZpb3VzTm9kZSA9IHRoaXMuZ2V0Rm9jdXNlZE5vZGUoKTtcbiAgICBsZXQgbmV4dE5vZGUgPSBwcmV2aW91c05vZGUgPyBwcmV2aW91c05vZGUuZmluZE5leHROb2RlKHRydWUsIHRydWUpIDogdGhpcy5nZXRGaXJzdFJvb3QodHJ1ZSk7XG4gICAgaWYgKG5leHROb2RlKSBuZXh0Tm9kZS5mb2N1cygpO1xuICB9XG5cbiAgQGFjdGlvbiBmb2N1c1ByZXZpb3VzTm9kZSgpIHtcbiAgICBsZXQgcHJldmlvdXNOb2RlID0gdGhpcy5nZXRGb2N1c2VkTm9kZSgpO1xuICAgIGxldCBuZXh0Tm9kZSA9IHByZXZpb3VzTm9kZSA/IHByZXZpb3VzTm9kZS5maW5kUHJldmlvdXNOb2RlKHRydWUpIDogdGhpcy5nZXRMYXN0Um9vdCh0cnVlKTtcbiAgICBpZiAobmV4dE5vZGUpIG5leHROb2RlLmZvY3VzKCk7XG4gIH1cblxuICBAYWN0aW9uIGZvY3VzRHJpbGxEb3duKCkge1xuICAgIGxldCBwcmV2aW91c05vZGUgPSB0aGlzLmdldEZvY3VzZWROb2RlKCk7XG4gICAgaWYgKHByZXZpb3VzTm9kZSAmJiBwcmV2aW91c05vZGUuaXNDb2xsYXBzZWQgJiYgcHJldmlvdXNOb2RlLmhhc0NoaWxkcmVuKSB7XG4gICAgICBwcmV2aW91c05vZGUudG9nZ2xlRXhwYW5kZWQoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsZXQgbmV4dE5vZGUgPSBwcmV2aW91c05vZGUgPyBwcmV2aW91c05vZGUuZ2V0Rmlyc3RDaGlsZCh0cnVlKSA6IHRoaXMuZ2V0Rmlyc3RSb290KHRydWUpO1xuICAgICAgaWYgKG5leHROb2RlKSBuZXh0Tm9kZS5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIEBhY3Rpb24gZm9jdXNEcmlsbFVwKCkge1xuICAgIGxldCBwcmV2aW91c05vZGUgPSB0aGlzLmdldEZvY3VzZWROb2RlKCk7XG4gICAgaWYgKCFwcmV2aW91c05vZGUpIHJldHVybjtcbiAgICBpZiAocHJldmlvdXNOb2RlLmlzRXhwYW5kZWQpIHtcbiAgICAgIHByZXZpb3VzTm9kZS50b2dnbGVFeHBhbmRlZCgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxldCBuZXh0Tm9kZSA9IHByZXZpb3VzTm9kZS5yZWFsUGFyZW50O1xuICAgICAgaWYgKG5leHROb2RlKSBuZXh0Tm9kZS5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIEBhY3Rpb24gc2V0QWN0aXZlTm9kZShub2RlLCB2YWx1ZSwgbXVsdGkgPSBmYWxzZSkge1xuICAgIGlmIChtdWx0aSkge1xuICAgICAgdGhpcy5fc2V0QWN0aXZlTm9kZU11bHRpKG5vZGUsIHZhbHVlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLl9zZXRBY3RpdmVOb2RlU2luZ2xlKG5vZGUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIG5vZGUuZm9jdXMoKTtcbiAgICAgIHRoaXMuZmlyZUV2ZW50KHsgZXZlbnROYW1lOiBUUkVFX0VWRU5UUy5vbkFjdGl2YXRlLCBub2RlIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZpcmVFdmVudCh7IGV2ZW50TmFtZTogVFJFRV9FVkVOVFMub25EZWFjdGl2YXRlLCBub2RlIH0pO1xuICAgIH1cbiAgfVxuXG4gIEBhY3Rpb24gc2V0RXhwYW5kZWROb2RlKG5vZGUsIHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRlZE5vZGVJZHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmV4cGFuZGVkTm9kZUlkcywge1tub2RlLmlkXTogdmFsdWV9KTtcbiAgICB0aGlzLmZpcmVFdmVudCh7IGV2ZW50TmFtZTogVFJFRV9FVkVOVFMub25Ub2dnbGVFeHBhbmRlZCwgbm9kZSwgaXNFeHBhbmRlZDogdmFsdWUgfSk7XG4gIH1cblxuICBAYWN0aW9uIGV4cGFuZEFsbCgpIHtcbiAgICB0aGlzLnJvb3RzLmZvckVhY2goKHJvb3QpID0+IHJvb3QuZXhwYW5kQWxsKCkpO1xuICB9XG5cbiAgQGFjdGlvbiBjb2xsYXBzZUFsbCgpIHtcbiAgICB0aGlzLnJvb3RzLmZvckVhY2goKHJvb3QpID0+IHJvb3QuY29sbGFwc2VBbGwoKSk7XG4gIH1cblxuICBAYWN0aW9uIHNldElzSGlkZGVuKG5vZGUsIHZhbHVlKSB7XG4gICAgdGhpcy5oaWRkZW5Ob2RlSWRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5oaWRkZW5Ob2RlSWRzLCB7W25vZGUuaWRdOiB2YWx1ZX0pO1xuICB9XG5cbiAgQGFjdGlvbiBzZXRIaWRkZW5Ob2RlSWRzKG5vZGVJZHMpIHtcbiAgICB0aGlzLmhpZGRlbk5vZGVJZHMgPSBub2RlSWRzLnJlZHVjZSgoaWQsIGhpZGRlbk5vZGVJZHMpID0+IE9iamVjdC5hc3NpZ24oaGlkZGVuTm9kZUlkcywge1xuICAgICAgW2lkXTogdHJ1ZVxuICAgIH0pLCB7fSk7XG4gIH1cblxuICBwZXJmb3JtS2V5QWN0aW9uKG5vZGUsICRldmVudCkge1xuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMub3B0aW9ucy5hY3Rpb25NYXBwaW5nLmtleXNbJGV2ZW50LmtleUNvZGVdO1xuICAgIGlmIChhY3Rpb24pIHtcbiAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgYWN0aW9uKHRoaXMsIG5vZGUsICRldmVudCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIEBhY3Rpb24gZmlsdGVyTm9kZXMoZmlsdGVyLCBhdXRvU2hvdyA9IHRydWUpIHtcbiAgICBsZXQgZmlsdGVyRm47XG5cbiAgICBpZiAoIWZpbHRlcikge1xuICAgICAgcmV0dXJuIHRoaXMuY2xlYXJGaWx0ZXIoKTtcbiAgICB9XG5cbiAgICAvLyBzdXBwb3J0IGZ1bmN0aW9uIGFuZCBzdHJpbmcgZmlsdGVyXG4gICAgaWYgKGlzU3RyaW5nKGZpbHRlcikpIHtcbiAgICAgIGZpbHRlckZuID0gKG5vZGUpID0+IG5vZGUuZGlzcGxheUZpZWxkLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXIudG9Mb3dlckNhc2UoKSkgIT09IC0xO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc0Z1bmN0aW9uKGZpbHRlcikpIHtcbiAgICAgICBmaWx0ZXJGbiA9IGZpbHRlcjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdEb25cXCd0IGtub3cgd2hhdCB0byBkbyB3aXRoIGZpbHRlcicsIGZpbHRlcik7XG4gICAgICBjb25zb2xlLmVycm9yKCdTaG91bGQgYmUgZWl0aGVyIGEgc3RyaW5nIG9yIGZ1bmN0aW9uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaWRzID0ge307XG4gICAgdGhpcy5yb290cy5mb3JFYWNoKChub2RlKSA9PiB0aGlzLl9maWx0ZXJOb2RlKGlkcywgbm9kZSwgZmlsdGVyRm4sIGF1dG9TaG93KSk7XG4gICAgdGhpcy5oaWRkZW5Ob2RlSWRzID0gaWRzO1xuICAgIHRoaXMuZmlyZUV2ZW50KHsgZXZlbnROYW1lOiBUUkVFX0VWRU5UUy5vbkNoYW5nZUZpbHRlciB9KTtcbiAgfVxuXG4gIEBhY3Rpb24gY2xlYXJGaWx0ZXIoKSB7XG4gICAgdGhpcy5oaWRkZW5Ob2RlSWRzID0ge307XG4gICAgdGhpcy5maXJlRXZlbnQoeyBldmVudE5hbWU6IFRSRUVfRVZFTlRTLm9uQ2hhbmdlRmlsdGVyIH0pO1xuICB9XG5cbiAgQGFjdGlvbiBtb3ZlTm9kZShub2RlLCB0bykge1xuICAgIGNvbnN0IGZyb21JbmRleCA9IG5vZGUuZ2V0SW5kZXhJblBhcmVudCgpO1xuICAgIGNvbnN0IGZyb21QYXJlbnQgPSBub2RlLnBhcmVudDtcblxuICAgIGlmICghdGhpcy5fY2FuTW92ZU5vZGUobm9kZSwgZnJvbUluZGV4ICwgdG8pKSByZXR1cm47XG5cbiAgICBjb25zdCBmcm9tQ2hpbGRyZW4gPSBmcm9tUGFyZW50LmdldEZpZWxkKCdjaGlsZHJlbicpO1xuXG4gICAgLy8gSWYgbm9kZSBkb2Vzbid0IGhhdmUgY2hpbGRyZW4gLSBjcmVhdGUgY2hpbGRyZW4gYXJyYXlcbiAgICBpZiAoIXRvLnBhcmVudC5nZXRGaWVsZCgnY2hpbGRyZW4nKSkge1xuICAgICAgdG8ucGFyZW50LnNldEZpZWxkKCdjaGlsZHJlbicsIFtdKTtcbiAgICB9XG4gICAgY29uc3QgdG9DaGlsZHJlbiA9IHRvLnBhcmVudC5nZXRGaWVsZCgnY2hpbGRyZW4nKTtcblxuICAgIGNvbnN0IG9yaWdpbmFsTm9kZSA9IGZyb21DaGlsZHJlbi5zcGxpY2UoZnJvbUluZGV4LCAxKVswXTtcblxuICAgIC8vIENvbXBlbnNhdGUgZm9yIGluZGV4IGlmIGFscmVhZHkgcmVtb3ZlZCBmcm9tIHBhcmVudDpcbiAgICBsZXQgdG9JbmRleCA9IChmcm9tUGFyZW50ID09PSB0by5wYXJlbnQgJiYgdG8uaW5kZXggPiBmcm9tSW5kZXgpID8gdG8uaW5kZXggLSAxIDogdG8uaW5kZXg7XG5cbiAgICB0b0NoaWxkcmVuLnNwbGljZSh0b0luZGV4LCAwLCBvcmlnaW5hbE5vZGUpO1xuXG4gICAgZnJvbVBhcmVudC50cmVlTW9kZWwudXBkYXRlKCk7XG4gICAgaWYgKHRvLnBhcmVudC50cmVlTW9kZWwgIT09IGZyb21QYXJlbnQudHJlZU1vZGVsKSB7XG4gICAgICB0by5wYXJlbnQudHJlZU1vZGVsLnVwZGF0ZSgpO1xuICAgIH1cblxuICAgIHRoaXMuZmlyZUV2ZW50KHsgZXZlbnROYW1lOiBUUkVFX0VWRU5UUy5vbk1vdmVOb2RlLCBub2RlOiBvcmlnaW5hbE5vZGUsIHRvOiB7IHBhcmVudDogdG8ucGFyZW50LmRhdGEsIGluZGV4OiB0b0luZGV4IH0gfSk7XG4gIH1cblxuICBnZXRTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXhwYW5kZWROb2RlSWRzOiB0aGlzLmV4cGFuZGVkTm9kZUlkcyxcbiAgICAgIGFjdGl2ZU5vZGVJZHM6IHRoaXMuYWN0aXZlTm9kZUlkcyxcbiAgICAgIGhpZGRlbk5vZGVJZHM6IHRoaXMuaGlkZGVuTm9kZUlkcyxcbiAgICAgIGZvY3VzZWROb2RlSWQ6IHRoaXMuZm9jdXNlZE5vZGVJZFxuICAgIH07XG4gIH1cblxuICBAYWN0aW9uIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKCFzdGF0ZSkgcmV0dXJuO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7XG4gICAgICBleHBhbmRlZE5vZGVJZHM6IHN0YXRlLmV4cGFuZGVkTm9kZUlkcyxcbiAgICAgIGFjdGl2ZU5vZGVJZHM6IHN0YXRlLmFjdGl2ZU5vZGVJZHMsXG4gICAgICBoaWRkZW5Ob2RlSWRzOiBzdGF0ZS5oaWRkZW5Ob2RlSWRzLFxuICAgICAgZm9jdXNlZE5vZGVJZDogc3RhdGUuZm9jdXNlZE5vZGVJZFxuICAgIH0pO1xuICB9XG5cbiAgc3Vic2NyaWJlVG9TdGF0ZShmbikge1xuICAgIGF1dG9ydW4oKCkgPT4gZm4odGhpcy5nZXRTdGF0ZSgpKSk7XG4gIH1cblxuICAvLyBwcml2YXRlIG1ldGhvZHNcbiAgcHJpdmF0ZSBfY2FuTW92ZU5vZGUobm9kZSwgZnJvbUluZGV4LCB0bykge1xuICAgIC8vIHNhbWUgbm9kZTpcbiAgICBpZiAobm9kZS5wYXJlbnQgPT09IHRvLnBhcmVudCAmJiBmcm9tSW5kZXggPT09IHRvLmluZGV4KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuICF0by5wYXJlbnQuaXNEZXNjZW5kYW50T2Yobm9kZSk7XG4gIH1cblxuXG4gIHByaXZhdGUgX2ZpbHRlck5vZGUoaWRzLCBub2RlLCBmaWx0ZXJGbiwgYXV0b1Nob3cpIHtcbiAgICAvLyBpZiBub2RlIHBhc3NlcyBmdW5jdGlvbiB0aGVuIGl0J3MgdmlzaWJsZVxuICAgIGxldCBpc1Zpc2libGUgPSBmaWx0ZXJGbihub2RlKTtcblxuICAgIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgICAvLyBpZiBvbmUgb2Ygbm9kZSdzIGNoaWxkcmVuIHBhc3NlcyBmaWx0ZXIgdGhlbiB0aGlzIG5vZGUgaXMgYWxzbyB2aXNpYmxlXG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9maWx0ZXJOb2RlKGlkcywgY2hpbGQsIGZpbHRlckZuLCBhdXRvU2hvdykpIHtcbiAgICAgICAgICBpc1Zpc2libGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBtYXJrIG5vZGUgYXMgaGlkZGVuXG4gICAgaWYgKCFpc1Zpc2libGUpIHtcbiAgICAgIGlkc1tub2RlLmlkXSA9IHRydWU7XG4gICAgfVxuICAgIC8vIGF1dG8gZXhwYW5kIHBhcmVudHMgdG8gbWFrZSBzdXJlIHRoZSBmaWx0ZXJlZCBub2RlcyBhcmUgdmlzaWJsZVxuICAgIGlmIChhdXRvU2hvdyAmJiBpc1Zpc2libGUpIHtcbiAgICAgIG5vZGUuZW5zdXJlVmlzaWJsZSgpO1xuICAgIH1cbiAgICByZXR1cm4gaXNWaXNpYmxlO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlRXhwYW5kZWROb2RlcyhzdGFydE5vZGUgPSBudWxsKSB7XG4gICAgc3RhcnROb2RlID0gc3RhcnROb2RlIHx8IHRoaXMudmlydHVhbFJvb3Q7XG5cbiAgICBpZiAoc3RhcnROb2RlLmRhdGFbdGhpcy5vcHRpb25zLmlzRXhwYW5kZWRGaWVsZF0pIHtcbiAgICAgIHRoaXMuZXhwYW5kZWROb2RlSWRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5leHBhbmRlZE5vZGVJZHMsIHtbc3RhcnROb2RlLmlkXTogdHJ1ZX0pO1xuICAgIH1cbiAgICBpZiAoc3RhcnROb2RlLmNoaWxkcmVuKSB7XG4gICAgICBzdGFydE5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHRoaXMuX2NhbGN1bGF0ZUV4cGFuZGVkTm9kZXMoY2hpbGQpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zZXRBY3RpdmVOb2RlU2luZ2xlKG5vZGUsIHZhbHVlKSB7XG4gICAgLy8gRGVhY3RpdmF0ZSBhbGwgb3RoZXIgbm9kZXM6XG4gICAgdGhpcy5hY3RpdmVOb2Rlc1xuICAgICAgLmZpbHRlcigoYWN0aXZlTm9kZSkgPT4gYWN0aXZlTm9kZSAhPT0gbm9kZSlcbiAgICAgIC5mb3JFYWNoKChhY3RpdmVOb2RlKSA9PiB7XG4gICAgICAgIHRoaXMuZmlyZUV2ZW50KHsgZXZlbnROYW1lOiBUUkVFX0VWRU5UUy5vbkRlYWN0aXZhdGUsIG5vZGU6IGFjdGl2ZU5vZGUgfSk7XG4gICAgICB9KTtcblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5hY3RpdmVOb2RlSWRzID0ge1tub2RlLmlkXTogdHJ1ZX07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5hY3RpdmVOb2RlSWRzID0ge307XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2V0QWN0aXZlTm9kZU11bHRpKG5vZGUsIHZhbHVlKSB7XG4gICAgdGhpcy5hY3RpdmVOb2RlSWRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5hY3RpdmVOb2RlSWRzLCB7W25vZGUuaWRdOiB2YWx1ZX0pO1xuICB9XG5cbnN0YXRpYyBkZWNvcmF0b3JzOiBEZWNvcmF0b3JJbnZvY2F0aW9uW10gPSBbXG57IHR5cGU6IEluamVjdGFibGUgfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbnN0YXRpYyBjdG9yUGFyYW1ldGVyczogKCkgPT4gKHt0eXBlOiBhbnksIGRlY29yYXRvcnM/OiBEZWNvcmF0b3JJbnZvY2F0aW9uW119fG51bGwpW10gPSAoKSA9PiBbXG5dO1xufVxuXG5pbnRlcmZhY2UgRGVjb3JhdG9ySW52b2NhdGlvbiB7XG4gIHR5cGU6IEZ1bmN0aW9uO1xuICBhcmdzPzogYW55W107XG59XG4iXX0=