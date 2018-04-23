/**
 * Welcome to ng2tree
 */
export interface IAllowDropFn {
    (element: any, to: {
        parent: ITreeNode;
        index: number;
    }, $event?: any): boolean;
}
export interface INodeHeightFn {
    (node: ITreeNode): number;
}
export interface IAllowDragFn {
    (node: ITreeNode): boolean;
}
export interface ITreeState {
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
}
export interface ITreeOptions {
    /**
     * A string representing the attribute of the node that contains the array of children.
 
     * **Default value: `children`.**
 
     For example, if your nodes have a `nodes` attribute, that contains the children, use:
     ```
       options = { childrenField: 'nodes' }
     ```
     */
    childrenField?: string;
    /**
     * A string representing the attribute of the node to display.
 
     * **Default value: `name`**
 
       For example, if your nodes have a `title` attribute that should be displayed, use:
       ```
         options = { displayField: 'title' }
       ```
     */
    displayField?: string;
    /**
     * A string representing the attribute of the node that contains the unique ID.
       This will be used to construct the `path`, which is an array of IDs that point to the node.
 
       * **Default value: `id`.**
 
       For example, if your nodes have a `uuid` attribute, that contains the unique key, use:
       ```
         options = { idField: 'uuid' }
       ```
     */
    idField?: string;
    /**
     * A string representing the attribute of the node that contains whether the node starts as expanded.
 
       * **Default value: `isExpanded`.**
 
       For example, if your nodes have an `expanded` attribute, that contains a boolean value, use:
       ```
         options = { isExpandedField: 'expanded' }
       ```
     */
    isExpandedField?: string;
    /**
     * Function for loading a node's children.
       The function receives a TreeNode, and returns a value or a promise that resolves to the node's children.
 
       This function will be called whenever a node is expanded, the `hasChildren` field is true, and the `children` field is empty.
       The result will be loaded into the node's children attribute.
 
       Example:
       ```
       * options = {
       *   getChildren: (node:TreeNode) => {
       *     return request('/api/children/' + node.id);
       *   }
       * }
       ```
     */
    getChildren?: (node: ITreeNode) => any;
    /**
     * Rewire which trigger causes which action using this attribute, or create custom actions / event bindings.
     * See the [Action Mapping Section](https://angular2-tree.readme.io/docs/action-mapping) for more details.
     */
    actionMapping?: any;
    /**
     * Specify if dragging tree nodes is allowed.
     * This could be a boolean, or a function that receives a TreeNode and returns a boolean
 
     * **Default value: false**
 
     Example:
     ```
     * options = {
     *  allowDrag: true
     * }
     ```
     */
    allowDrag?: boolean | IAllowDragFn;
    /**
     * Specify whether dropping inside the tree is allowed. Optional types:
     *  - boolean
     *  - (element:any, to:{parent:ITreeNode, index:number}):boolean
          A function that receives the dragged element, and the drop location (parent node and index inside the parent),
          and returns true or false.
 
     * **Default Value: true**
 
     example:
     ```
     * options = {
     *  allowDrop: (element, {parent, index}) => parent.isLeaf
     * }
     ```
    */
    allowDrop?: boolean | IAllowDropFn;
    /**
    * Specify padding per node (integer).
     Each node will have padding-left value of level * levelPadding, instead of using the default padding for children.
 
     This option is good for example for allowing whole row selection, etc.
 
     You can alternatively use the tree-node-level-X classes to give padding on a per-level basis.
 
     * **Default value: 0**
    */
    levelPadding?: number;
    /**
     * Specify a function that returns a class per node. Useful for styling the nodes individually.
 
       Example:
       ```
       * options = {
       *   nodeClass: (node:TreeNode) => {
       *     return 'icon-' + node.data.icon;
       *   }
       * }
       ```
     */
    nodeClass?: (node: ITreeNode) => string;
    /**
     Boolean flag to use the virtual scroll option.
 
     To use this option, you must supply the height of the container, and the height of each node in the tree.
 
     You can also specify height for the dropSlot which is located between nodes.
 
     * **Default Value: false**
 
     example:
     ```
     * options = {
     *   useVirtualScroll: true,
     *   nodeHeight: (node: TreeNode) => node.myHeight,
     *   dropSlotHeight: 3
     * }
     ```
     */
    useVirtualScroll?: boolean;
    /**
     * For use with `useVirtualScroll` option.
     * Specify a height for nodes in pixels. Could be either:
     * - number
     * - (node: TreeNode) => number
 
     * **Default Value: 22**
     */
    nodeHeight?: number | INodeHeightFn;
    /**
     * For use with `useVirtualScroll` option.
     * Specify a height for drop slots (located between nodes) in pixels
 
     * **Default Value: 2**
     */
    dropSlotHeight?: number;
    /**
     * Boolean whether or not to animate expand / collapse of nodes.
 
     * **Default Value: false**
     */
    animateExpand?: boolean;
    /**
     * Speed of expand animation (described in pixels per 17 ms).
 
     * **Default Value: 30**
     */
    animateSpeed?: number;
    /**
     * Increase of expand animation speed (described in multiply per 17 ms).
 
     * **Default Value: 1.2**
     */
    animateAcceleration?: number;
    /**
     * Whether to scroll to the node to make it visible when it is selected.
 
     * **Default Value: true**
     */
    scrollOnSelect?: boolean;
}
export interface ITreeNode {
    /**
     * Parent node
     */
    parent: ITreeNode;
    /**
     * The value of the node's field that is used for displaying its content.
     * By default 'name', unless stated otherwise in the options
     */
    displayField: string;
    /**
     * The children of the node.
     * By default is determined by 'node.data.children', unless stated otherwise in the options
     */
    children: ITreeNode[];
    /**
     * Pointer to the original data.
     */
    data: any;
    /**
     * Pointer to the ElementRef of the TreeNodeComponent that's displaying this node
     */
    elementRef: any;
    /**
     * Level in the tree (starts from 1).
     */
    level: number;
    /**
     * Path in the tree: Array of IDs.
     */
    path: string[];
    /**
     * index of the node inside its parent's children
     */
    index: number;
    /**
     * A unique key of this node among its siblings.
     * By default it's the 'id' of the original node, unless stated otherwise in options.idField
     */
    id: any;
    isExpanded: boolean;
    isActive: boolean;
    isFocused: boolean;
    isCollapsed: boolean;
    isLeaf: boolean;
    hasChildren: boolean;
    isRoot: boolean;
    /**
     * @param skipHidden whether to skip hidden nodes
     * @returns next sibling (or null)
     */
    findNextSibling(skipHidden: any): ITreeNode;
    /**
     * @param skipHidden whether to skip hidden nodes
     * @returns previous sibling (or null)
     */
    findPreviousSibling(skipHidden: any): ITreeNode;
    /**
     * @param skipHidden whether to skip hidden nodes
     * @returns first child (or null)
     */
    getFirstChild(skipHidden: any): ITreeNode;
    /**
     * @param skipHidden whether to skip hidden nodes
     * @returns last child (or null)
     */
    getLastChild(skipHidden: any): ITreeNode;
    /**
     * Finds the visually next node in the tree.
     * @param goInside whether to look for children or just siblings
     * @returns next node.
     */
    findNextNode(goInside: boolean): ITreeNode;
    /**
     * Finds the visually previous node in the tree.
     * @param skipHidden whether to skip hidden nodes
     * @returns previous node.
     */
    findPreviousNode(skipHidden: any): ITreeNode;
    /**
     * @returns      true if this node is a descendant of the parameter node
     */
    isDescendantOf(node: ITreeNode): boolean;
    /**
     * @returns      in case levelPadding option is supplied, returns the current node's padding
     */
    getNodePadding(): string;
    /**
     * @returns      in case nodeClass option is supplied, returns the current node's class
     */
    getClass(): string;
    /**
     * Expands / Collapses the node
     */
    toggleExpanded(): any;
    /**
     * Expands the node
     */
    expand(): any;
    /**
     * Collapses the node
     */
    collapse(): any;
    /**
     * Expands all ancestors of the node
     */
    ensureVisible(): any;
    /**
     * Activates / Deactivates the node (selects / deselects)
     */
    toggleActivated(multi: any): any;
    /**
     * Focus on the node
     */
    focus(): any;
    /**
     * Blur (unfocus) the node
     */
    blur(): any;
    /**
     * Hides the node
     */
    hide(): any;
    /**
     * Makes the node visible
     */
    show(): any;
    /**
     * @param value  if true makes the node hidden, otherwise visible
     */
    setIsHidden(value: boolean): any;
    /**
     * Scroll the screen to make the node visible
     */
    scrollIntoView(): any;
    /**
     * Fire an event to the renderer of the tree (if it was registered)
     */
    fireEvent(event: any): any;
    /**
     * Invokes a method for every node under this one - depth first
     * @param fn  a function that receives the node
     */
    doForAll(fn: (node: ITreeNode) => any): any;
    /**
     * expand all nodes under this one
     */
    expandAll(): any;
    /**
     * collapse all nodes under this one
     */
    collapseAll(): any;
}
export interface ITreeModel {
    /**
     * All root nodes
     */
    roots: ITreeNode[];
    /**
     * Current focused node
     */
    focusedNode: ITreeNode;
    /**
     * Options that were passed to the tree component
     */
    options: ITreeOptions;
    /**
     * Is the tree currently focused
     */
    isFocused: boolean;
    /**
     * @returns Current active (selected) nodes
     */
    activeNodes: ITreeNode[];
    /**
     * @returns Current expanded nodes
     */
    expandedNodes: ITreeNode[];
    /**
     * @returns Current active (selected) node. If multiple nodes are active - returns the first one.
     */
    getActiveNode(): ITreeNode;
    /**
     * @returns Current focused node (either hovered or traversed with keys)
     */
    getFocusedNode(): ITreeNode;
    /**
     * Set focus on a node
     * @param value  true or false - whether to set focus or blur.
     */
    setFocusedNode(node: ITreeNode): any;
    /**
     * @param skipHidden  true or false - whether to skip hidden nodes
     * @returns      first root of the tree
     */
    getFirstRoot(skipHidden?: boolean): ITreeNode;
    /**
     * @param skipHidden  true or false - whether to skip hidden nodes
     * @returns      last root of the tree
     */
    getLastRoot(skipHidden?: boolean): ITreeNode;
    /**
     * @returns      true if the tree is empty
     */
    isEmptyTree(): boolean;
    /**
     * @returns All root nodes that pass the current filter
     */
    getVisibleRoots(): ITreeNode[];
    /**
     * @param     path  array of node IDs to be traversed respectively
     * @param     statrNode  optional. Which node to start traversing from
     * @returns   The node, if found - null otherwise
     */
    getNodeByPath(path: any[], startNode?: ITreeNode): ITreeNode;
    /**
     * @param     id  node ID to find
     * @returns   The node, if found - null otherwise
     */
    getNodeById(id: any): ITreeNode;
    /**
     * @param     predicate - either an object or a function, used as a test condition on all nodes.
     *            Could be every predicate that's supported by lodash's `find` method
     * @param     statrNode  optional. Which node to start traversing from
     * @returns   First node that matches the predicate, if found - null otherwise
     */
    getNodeBy(predicate: any, startNode?: ITreeNode): ITreeNode;
    /**
     * Focuses or blurs the tree
     * @param value  true or false - whether to set focus or blur.
     */
    setFocus(value: boolean): any;
    /**
     * Focuses on the next node in the tree (same as down arrow)
     */
    focusNextNode(): any;
    /**
     * Focuses on the previous node in the tree (same as up arrow)
     */
    focusPreviousNode(): any;
    /**
     * Focuses on the inner child of the current focused node (same as right arrow on an expanded node)
     */
    focusDrillDown(): any;
    /**
     * Focuses on the parent of the current focused node (same as left arrow on a collapsed node)
     */
    focusDrillUp(): any;
    /**
     * Marks isHidden field in all nodes recursively according to the filter param.
     * If a node is marked visible, all of its ancestors will be marked visible as well.
     * @param filter  either a string or a function.
     *   In case it's a string, it will be searched case insensitively in the node's display attribute
     *   In case it's a function, it will be passed the node, and should return true if the node should be visible, false otherwise
     * @param autoShow  if true, make sure all nodes that passed the filter are visible
     */
    filterNodes(filter: any, autoShow?: boolean): any;
    /**
     * Marks all nodes isHidden = false
     */
    clearFilter(): any;
    /**
     * moves a node from one location in the tree to another
     * @param location  has a from and a to attributes, each has a node and index attributes.
       The combination of node + index tells which node needs to be moved, and to where
     */
    moveNode(node: ITreeNode, to: {
        node: ITreeNode;
        index: number;
    }): any;
    /**
     * Invokes a method for every node of the tree - depth first
     * @param fn  a function that receives the node
     */
    doForAll(fn: (node: ITreeNode) => any): any;
    /**
     * expand all nodes
     */
    expandAll(): any;
    /**
     * collapse all nodes
     */
    collapseAll(): any;
    /**
     * get tree state
     */
    getState(): ITreeState;
    /**
     * set tree state
     */
    setState(state: ITreeState): any;
    subscribeToState(fn: (state: ITreeState) => any): any;
}
/**
 * This is the interface of the TreeNodeDrag service
 */
export interface ITreeNodeDrag {
    /**
     * Gets the current dragged node. Useful for overriding the drop action.
     * @param node  The parent node of the current dragged node
     * @param index  The index inside parent's children, of the current dragged node
     */
    getDragNode(): {
        node: ITreeNode;
        index: number;
    };
}