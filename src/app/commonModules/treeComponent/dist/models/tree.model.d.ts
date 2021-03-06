import { TreeNode } from './tree-node.model';
import { TreeOptions } from './tree-options.model';
import { TreeVirtualScroll } from './tree-virtual-scroll.model';
import { ITreeModel } from '../defs/api';
export declare class TreeModel implements ITreeModel {
    static focusedTree: any;
    options: TreeOptions;
    nodes: any[];
    eventNames: string[];
    virtualScroll: TreeVirtualScroll;
    roots: TreeNode[];
    expandedNodeIds: {
        [id: string]: boolean;
    };
    activeNodeIds: {
        [id: string]: boolean;
    };
    hiddenNodeIds: {
        [id: string]: boolean;
    };
    focusedNodeId: string;
    virtualRoot: TreeNode;
    private firstUpdate;
    private events;
    constructor();
    fireEvent(event: any): void;
    subscribe(eventName: any, fn: any): void;
    getFocusedNode(): TreeNode;
    getActiveNode(): TreeNode;
    getActiveNodes(): TreeNode[];
    getVisibleRoots(): TreeNode[];
    getFirstRoot(skipHidden?: boolean): TreeNode;
    getLastRoot(skipHidden?: boolean): TreeNode;
    readonly isFocused: boolean;
    isNodeFocused(node: any): boolean;
    isEmptyTree(): boolean;
    readonly focusedNode: any;
    readonly expandedNodes: any[];
    readonly activeNodes: any[];
    getNodeByPath(path: any[], startNode?: any): TreeNode;
    getNodeById(id: any): any;
    getNodeBy(predicate: any, startNode?: any): any;
    isExpanded(node: any): boolean;
    isHidden(node: any): boolean;
    isActive(node: any): boolean;
    setData({nodes, options, events}: {
        nodes: any;
        options: any;
        events: any;
    }): void;
    update(): void;
    setFocusedNode(node: any): void;
    setFocus(value: any): void;
    doForAll(fn: any): void;
    focusNextNode(): void;
    focusPreviousNode(): void;
    focusDrillDown(): void;
    focusDrillUp(): void;
    setActiveNode(node: any, value: any, multi?: boolean): void;
    setExpandedNode(node: any, value: any): void;
    expandAll(): void;
    collapseAll(): void;
    setIsHidden(node: any, value: any): void;
    setHiddenNodeIds(nodeIds: any): void;
    performKeyAction(node: any, $event: any): boolean;
    filterNodes(filter: any, autoShow?: boolean): void;
    clearFilter(): void;
    moveNode(node: any, to: any): void;
    getState(): {
        expandedNodeIds: {
            [id: string]: boolean;
        };
        activeNodeIds: {
            [id: string]: boolean;
        };
        hiddenNodeIds: {
            [id: string]: boolean;
        };
        focusedNodeId: string;
    };
    setState(state: any): void;
    subscribeToState(fn: any): void;
    private _canMoveNode(node, fromIndex, to);
    private _filterNode(ids, node, filterFn, autoShow);
    private _calculateExpandedNodes(startNode?);
    private _setActiveNodeSingle(node, value);
    private _setActiveNodeMulti(node, value);
}
