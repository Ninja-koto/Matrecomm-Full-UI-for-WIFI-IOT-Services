import { Component, Input, ViewEncapsulation } from '@angular/core';
var TreeNodeWrapperComponent = (function () {
    function TreeNodeWrapperComponent() {
    }
    return TreeNodeWrapperComponent;
}());
export { TreeNodeWrapperComponent };
TreeNodeWrapperComponent.decorators = [
    { type: Component, args: [{
                selector: 'tree-node-wrapper',
                encapsulation: ViewEncapsulation.None,
                styles: [
                    ".node-content-wrapper {\n      display: inline-block;\n      padding: 2px 5px;\n      border-radius: 2px;\n      transition: background-color .15s,box-shadow .15s;\n    }",
                    '.node-wrapper {display: flex; align-items: flex-start;}',
                    ".node-content-wrapper-active,\n     .node-content-wrapper.node-content-wrapper-active:hover,\n     .node-content-wrapper-active.node-content-wrapper-focused {\n        background: #beebff;\n     }",
                    '.node-content-wrapper-focused { background: #e7f4f9 }',
                    '.node-content-wrapper:hover { background: #f7fbff }',
                    ".node-content-wrapper-active, .node-content-wrapper-focused, .node-content-wrapper:hover {\n      box-shadow: inset 0 0 1px #999;\n    }",
                    '.node-content-wrapper.is-dragging-over { background: #ddffee; box-shadow: inset 0 0 1px #999; }',
                    '.node-content-wrapper.is-dragging-over-disabled { opacity: 0.5 }'
                ],
                template: "\n      <div *ngIf=\"!templates.treeNodeWrapperTemplate\" class=\"node-wrapper\" [style.padding-left]=\"node.getNodePadding()\">\n        <tree-node-expander [node]=\"node\"></tree-node-expander>\n        <div class=\"node-content-wrapper\"\n          [class.node-content-wrapper-active]=\"node.isActive\"\n          [class.node-content-wrapper-focused]=\"node.isFocused\"\n          (click)=\"node.mouseAction('click', $event)\"\n          (dblclick)=\"node.mouseAction('dblClick', $event)\"\n          (contextmenu)=\"node.mouseAction('contextMenu', $event)\"\n          (treeDrop)=\"node.onDrop($event)\"\n          (treeDropDragOver)=\"node.mouseAction('dragOver', $event)\"\n          (treeDropDragLeave)=\"node.mouseAction('dragLeave', $event)\"\n          (treeDropDragEnter)=\"node.mouseAction('dragEnter', $event)\"\n          [treeAllowDrop]=\"node.allowDrop\"\n          [treeDrag]=\"node\"\n          [treeDragEnabled]=\"node.allowDrag()\">\n\n          <tree-node-content [node]=\"node\" [index]=\"index\" [template]=\"templates.treeNodeTemplate\">\n          </tree-node-content>\n        </div>\n      </div>\n      <ng-container \n        [ngTemplateOutlet]=\"templates.treeNodeWrapperTemplate\" \n        [ngOutletContext]=\"{ $implicit: node, node: node, index: index }\">\n      </ng-container>\n    "
            },] },
];
/** @nocollapse */
TreeNodeWrapperComponent.ctorParameters = function () { return []; };
TreeNodeWrapperComponent.propDecorators = {
    'node': [{ type: Input },],
    'index': [{ type: Input },],
    'templates': [{ type: Input },],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb21wb25lbnRzL3RyZWUtbm9kZS13cmFwcGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBQSxFQUFXLEtBQUEsRUFBTyxpQkFBQSxFQUErQixNQUFPLGVBQUEsQ0FBZ0I7QUFLakY7SUFNRTtJQUFnQixDQUFDO0lBK0RuQiwrQkFBQztBQUFELENBckVBLEFBcUVDOztBQTdETSxtQ0FBVSxHQUEwQjtJQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQ3hCLFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxNQUFNLEVBQUU7b0JBQ04sNEtBS0U7b0JBQ0YseURBQXlEO29CQUN6RCxzTUFJRztvQkFDSCx1REFBdUQ7b0JBQ3ZELHFEQUFxRDtvQkFDckQsMElBRUU7b0JBQ0YsaUdBQWlHO29CQUNqRyxrRUFBa0U7aUJBQ25FO2dCQUNELFFBQVEsRUFBRSx5eUNBeUJQO2FBQ0osRUFBRyxFQUFFO0NBQ0wsQ0FBQztBQUNGLGtCQUFrQjtBQUNYLHVDQUFjLEdBQW1FLGNBQU0sT0FBQSxFQUM3RixFQUQ2RixDQUM3RixDQUFDO0FBQ0ssdUNBQWMsR0FBMkM7SUFDaEUsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFDMUIsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFDM0IsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7Q0FDOUIsQ0FBQyIsImZpbGUiOiJ0cmVlLW5vZGUtd3JhcHBlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgVmlld0VuY2Fwc3VsYXRpb24sIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUcmVlTm9kZSB9IGZyb20gJy4uL21vZGVscy90cmVlLW5vZGUubW9kZWwnO1xuXG5cblxuZXhwb3J0IGNsYXNzIFRyZWVOb2RlV3JhcHBlckNvbXBvbmVudCB7XG5cbiAgIG5vZGU6IFRyZWVOb2RlO1xuICAgaW5kZXg6IG51bWJlcjtcbiAgIHRlbXBsYXRlczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbnN0YXRpYyBkZWNvcmF0b3JzOiBEZWNvcmF0b3JJbnZvY2F0aW9uW10gPSBbXG57IHR5cGU6IENvbXBvbmVudCwgYXJnczogW3tcbiAgc2VsZWN0b3I6ICd0cmVlLW5vZGUtd3JhcHBlcicsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHN0eWxlczogW1xuICAgIGAubm9kZS1jb250ZW50LXdyYXBwZXIge1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgcGFkZGluZzogMnB4IDVweDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgLjE1cyxib3gtc2hhZG93IC4xNXM7XG4gICAgfWAsXG4gICAgJy5ub2RlLXdyYXBwZXIge2Rpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O30nLFxuICAgIGAubm9kZS1jb250ZW50LXdyYXBwZXItYWN0aXZlLFxuICAgICAubm9kZS1jb250ZW50LXdyYXBwZXIubm9kZS1jb250ZW50LXdyYXBwZXItYWN0aXZlOmhvdmVyLFxuICAgICAubm9kZS1jb250ZW50LXdyYXBwZXItYWN0aXZlLm5vZGUtY29udGVudC13cmFwcGVyLWZvY3VzZWQge1xuICAgICAgICBiYWNrZ3JvdW5kOiAjYmVlYmZmO1xuICAgICB9YCxcbiAgICAnLm5vZGUtY29udGVudC13cmFwcGVyLWZvY3VzZWQgeyBiYWNrZ3JvdW5kOiAjZTdmNGY5IH0nLFxuICAgICcubm9kZS1jb250ZW50LXdyYXBwZXI6aG92ZXIgeyBiYWNrZ3JvdW5kOiAjZjdmYmZmIH0nLFxuICAgIGAubm9kZS1jb250ZW50LXdyYXBwZXItYWN0aXZlLCAubm9kZS1jb250ZW50LXdyYXBwZXItZm9jdXNlZCwgLm5vZGUtY29udGVudC13cmFwcGVyOmhvdmVyIHtcbiAgICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMCAxcHggIzk5OTtcbiAgICB9YCxcbiAgICAnLm5vZGUtY29udGVudC13cmFwcGVyLmlzLWRyYWdnaW5nLW92ZXIgeyBiYWNrZ3JvdW5kOiAjZGRmZmVlOyBib3gtc2hhZG93OiBpbnNldCAwIDAgMXB4ICM5OTk7IH0nLFxuICAgICcubm9kZS1jb250ZW50LXdyYXBwZXIuaXMtZHJhZ2dpbmctb3Zlci1kaXNhYmxlZCB7IG9wYWNpdHk6IDAuNSB9J1xuICBdLFxuICB0ZW1wbGF0ZTogYFxuICAgICAgPGRpdiAqbmdJZj1cIiF0ZW1wbGF0ZXMudHJlZU5vZGVXcmFwcGVyVGVtcGxhdGVcIiBjbGFzcz1cIm5vZGUtd3JhcHBlclwiIFtzdHlsZS5wYWRkaW5nLWxlZnRdPVwibm9kZS5nZXROb2RlUGFkZGluZygpXCI+XG4gICAgICAgIDx0cmVlLW5vZGUtZXhwYW5kZXIgW25vZGVdPVwibm9kZVwiPjwvdHJlZS1ub2RlLWV4cGFuZGVyPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibm9kZS1jb250ZW50LXdyYXBwZXJcIlxuICAgICAgICAgIFtjbGFzcy5ub2RlLWNvbnRlbnQtd3JhcHBlci1hY3RpdmVdPVwibm9kZS5pc0FjdGl2ZVwiXG4gICAgICAgICAgW2NsYXNzLm5vZGUtY29udGVudC13cmFwcGVyLWZvY3VzZWRdPVwibm9kZS5pc0ZvY3VzZWRcIlxuICAgICAgICAgIChjbGljayk9XCJub2RlLm1vdXNlQWN0aW9uKCdjbGljaycsICRldmVudClcIlxuICAgICAgICAgIChkYmxjbGljayk9XCJub2RlLm1vdXNlQWN0aW9uKCdkYmxDbGljaycsICRldmVudClcIlxuICAgICAgICAgIChjb250ZXh0bWVudSk9XCJub2RlLm1vdXNlQWN0aW9uKCdjb250ZXh0TWVudScsICRldmVudClcIlxuICAgICAgICAgICh0cmVlRHJvcCk9XCJub2RlLm9uRHJvcCgkZXZlbnQpXCJcbiAgICAgICAgICAodHJlZURyb3BEcmFnT3Zlcik9XCJub2RlLm1vdXNlQWN0aW9uKCdkcmFnT3ZlcicsICRldmVudClcIlxuICAgICAgICAgICh0cmVlRHJvcERyYWdMZWF2ZSk9XCJub2RlLm1vdXNlQWN0aW9uKCdkcmFnTGVhdmUnLCAkZXZlbnQpXCJcbiAgICAgICAgICAodHJlZURyb3BEcmFnRW50ZXIpPVwibm9kZS5tb3VzZUFjdGlvbignZHJhZ0VudGVyJywgJGV2ZW50KVwiXG4gICAgICAgICAgW3RyZWVBbGxvd0Ryb3BdPVwibm9kZS5hbGxvd0Ryb3BcIlxuICAgICAgICAgIFt0cmVlRHJhZ109XCJub2RlXCJcbiAgICAgICAgICBbdHJlZURyYWdFbmFibGVkXT1cIm5vZGUuYWxsb3dEcmFnKClcIj5cblxuICAgICAgICAgIDx0cmVlLW5vZGUtY29udGVudCBbbm9kZV09XCJub2RlXCIgW2luZGV4XT1cImluZGV4XCIgW3RlbXBsYXRlXT1cInRlbXBsYXRlcy50cmVlTm9kZVRlbXBsYXRlXCI+XG4gICAgICAgICAgPC90cmVlLW5vZGUtY29udGVudD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxuZy1jb250YWluZXIgXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRlbXBsYXRlcy50cmVlTm9kZVdyYXBwZXJUZW1wbGF0ZVwiIFxuICAgICAgICBbbmdPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBub2RlLCBub2RlOiBub2RlLCBpbmRleDogaW5kZXggfVwiPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgYFxufSwgXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuc3RhdGljIGN0b3JQYXJhbWV0ZXJzOiAoKSA9PiAoe3R5cGU6IGFueSwgZGVjb3JhdG9ycz86IERlY29yYXRvckludm9jYXRpb25bXX18bnVsbClbXSA9ICgpID0+IFtcbl07XG5zdGF0aWMgcHJvcERlY29yYXRvcnM6IHtba2V5OiBzdHJpbmddOiBEZWNvcmF0b3JJbnZvY2F0aW9uW119ID0ge1xuJ25vZGUnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4naW5kZXgnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4ndGVtcGxhdGVzJzogW3sgdHlwZTogSW5wdXQgfSxdLFxufTtcbn1cblxuaW50ZXJmYWNlIERlY29yYXRvckludm9jYXRpb24ge1xuICB0eXBlOiBGdW5jdGlvbjtcbiAgYXJncz86IGFueVtdO1xufVxuIl19