import { Component, Input, ViewEncapsulation, ElementRef } from '@angular/core';
import { deprecatedSelector } from '../deprecated-selector';
var TreeNodeComponent = (function () {
    function TreeNodeComponent(elementRef) {
        this.elementRef = elementRef;
        deprecatedSelector('TreeNode', 'tree-node', elementRef);
    }
    return TreeNodeComponent;
}());
export { TreeNodeComponent };
TreeNodeComponent.decorators = [
    { type: Component, args: [{
                selector: 'TreeNode, tree-node',
                encapsulation: ViewEncapsulation.None,
                styles: [],
                template: "\n    <ng-container *mobxAutorun>\n      <div\n        *ngIf=\"!templates.treeNodeFullTemplate\"\n        [class]=\"node.getClass()\"\n        [class.tree-node]=\"true\"\n        [class.tree-node-expanded]=\"node.isExpanded && node.hasChildren\"\n        [class.tree-node-collapsed]=\"node.isCollapsed && node.hasChildren\"\n        [class.tree-node-leaf]=\"node.isLeaf\"\n        [class.tree-node-active]=\"node.isActive\"\n        [class.tree-node-focused]=\"node.isFocused\"\n        >\n\n        <tree-node-drop-slot *ngIf=\"index === 0\" [dropIndex]=\"node.index\" [node]=\"node.parent\"></tree-node-drop-slot>\n\n        <tree-node-wrapper [node]=\"node\" [index]=\"index\" [templates]=\"templates\"></tree-node-wrapper>\n\n        <tree-node-children [node]=\"node\" [templates]=\"templates\"></tree-node-children>\n        <tree-node-drop-slot [dropIndex]=\"node.index + 1\" [node]=\"node.parent\"></tree-node-drop-slot>\n      </div>\n      <ng-container\n        [ngTemplateOutlet]=\"templates.treeNodeFullTemplate\"\n        [ngOutletContext]=\"{ $implicit: node, node: node, index: index, templates: templates }\">\n      </ng-container>\n    </ng-container>"
            },] },
];
/** @nocollapse */
TreeNodeComponent.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
TreeNodeComponent.propDecorators = {
    'node': [{ type: Input },],
    'index': [{ type: Input },],
    'templates': [{ type: Input },],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb21wb25lbnRzL3RyZWUtbm9kZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQUEsRUFBVyxLQUFBLEVBQU8saUJBQUEsRUFBZ0MsVUFBQSxFQUFXLE1BQU8sZUFBQSxDQUFnQjtBQUU3RixPQUFPLEVBQUUsa0JBQUEsRUFBbUIsTUFBTyx3QkFBQSxDQUF5QjtBQUk1RDtJQUtFLDJCQUFvQixVQUFzQjtRQUF0QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3hDLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQTJDSCx3QkFBQztBQUFELENBbERBLEFBa0RDOztBQXpDTSw0QkFBVSxHQUEwQjtJQUMzQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQ3hCLFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxNQUFNLEVBQUUsRUFBRTtnQkFDVixRQUFRLEVBQUUsb3BDQXdCUTthQUNuQixFQUFHLEVBQUU7Q0FDTCxDQUFDO0FBQ0Ysa0JBQWtCO0FBQ1gsZ0NBQWMsR0FBbUUsY0FBTSxPQUFBO0lBQzlGLEVBQUMsSUFBSSxFQUFFLFVBQVUsR0FBRztDQUNuQixFQUY2RixDQUU3RixDQUFDO0FBQ0ssZ0NBQWMsR0FBMkM7SUFDaEUsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFDMUIsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFDM0IsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7Q0FDOUIsQ0FBQyIsImZpbGUiOiJ0cmVlLW5vZGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFZpZXdFbmNhcHN1bGF0aW9uLCBUZW1wbGF0ZVJlZiwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVHJlZU5vZGUgfSBmcm9tICcuLi9tb2RlbHMvdHJlZS1ub2RlLm1vZGVsJztcbmltcG9ydCB7IGRlcHJlY2F0ZWRTZWxlY3RvciB9IGZyb20gJy4uL2RlcHJlY2F0ZWQtc2VsZWN0b3InO1xuXG5cblxuZXhwb3J0IGNsYXNzIFRyZWVOb2RlQ29tcG9uZW50IHtcbiAgIG5vZGU6IFRyZWVOb2RlO1xuICAgaW5kZXg6IG51bWJlcjtcbiAgIHRlbXBsYXRlczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICAgIGRlcHJlY2F0ZWRTZWxlY3RvcignVHJlZU5vZGUnLCAndHJlZS1ub2RlJywgZWxlbWVudFJlZik7XG4gIH1cblxuc3RhdGljIGRlY29yYXRvcnM6IERlY29yYXRvckludm9jYXRpb25bXSA9IFtcbnsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xuICBzZWxlY3RvcjogJ1RyZWVOb2RlLCB0cmVlLW5vZGUnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBzdHlsZXM6IFtdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250YWluZXIgKm1vYnhBdXRvcnVuPlxuICAgICAgPGRpdlxuICAgICAgICAqbmdJZj1cIiF0ZW1wbGF0ZXMudHJlZU5vZGVGdWxsVGVtcGxhdGVcIlxuICAgICAgICBbY2xhc3NdPVwibm9kZS5nZXRDbGFzcygpXCJcbiAgICAgICAgW2NsYXNzLnRyZWUtbm9kZV09XCJ0cnVlXCJcbiAgICAgICAgW2NsYXNzLnRyZWUtbm9kZS1leHBhbmRlZF09XCJub2RlLmlzRXhwYW5kZWQgJiYgbm9kZS5oYXNDaGlsZHJlblwiXG4gICAgICAgIFtjbGFzcy50cmVlLW5vZGUtY29sbGFwc2VkXT1cIm5vZGUuaXNDb2xsYXBzZWQgJiYgbm9kZS5oYXNDaGlsZHJlblwiXG4gICAgICAgIFtjbGFzcy50cmVlLW5vZGUtbGVhZl09XCJub2RlLmlzTGVhZlwiXG4gICAgICAgIFtjbGFzcy50cmVlLW5vZGUtYWN0aXZlXT1cIm5vZGUuaXNBY3RpdmVcIlxuICAgICAgICBbY2xhc3MudHJlZS1ub2RlLWZvY3VzZWRdPVwibm9kZS5pc0ZvY3VzZWRcIlxuICAgICAgICA+XG5cbiAgICAgICAgPHRyZWUtbm9kZS1kcm9wLXNsb3QgKm5nSWY9XCJpbmRleCA9PT0gMFwiIFtkcm9wSW5kZXhdPVwibm9kZS5pbmRleFwiIFtub2RlXT1cIm5vZGUucGFyZW50XCI+PC90cmVlLW5vZGUtZHJvcC1zbG90PlxuXG4gICAgICAgIDx0cmVlLW5vZGUtd3JhcHBlciBbbm9kZV09XCJub2RlXCIgW2luZGV4XT1cImluZGV4XCIgW3RlbXBsYXRlc109XCJ0ZW1wbGF0ZXNcIj48L3RyZWUtbm9kZS13cmFwcGVyPlxuXG4gICAgICAgIDx0cmVlLW5vZGUtY2hpbGRyZW4gW25vZGVdPVwibm9kZVwiIFt0ZW1wbGF0ZXNdPVwidGVtcGxhdGVzXCI+PC90cmVlLW5vZGUtY2hpbGRyZW4+XG4gICAgICAgIDx0cmVlLW5vZGUtZHJvcC1zbG90IFtkcm9wSW5kZXhdPVwibm9kZS5pbmRleCArIDFcIiBbbm9kZV09XCJub2RlLnBhcmVudFwiPjwvdHJlZS1ub2RlLWRyb3Atc2xvdD5cbiAgICAgIDwvZGl2PlxuICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJ0ZW1wbGF0ZXMudHJlZU5vZGVGdWxsVGVtcGxhdGVcIlxuICAgICAgICBbbmdPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBub2RlLCBub2RlOiBub2RlLCBpbmRleDogaW5kZXgsIHRlbXBsYXRlczogdGVtcGxhdGVzIH1cIj5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIDwvbmctY29udGFpbmVyPmBcbn0sIF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbnN0YXRpYyBjdG9yUGFyYW1ldGVyczogKCkgPT4gKHt0eXBlOiBhbnksIGRlY29yYXRvcnM/OiBEZWNvcmF0b3JJbnZvY2F0aW9uW119fG51bGwpW10gPSAoKSA9PiBbXG57dHlwZTogRWxlbWVudFJlZiwgfSxcbl07XG5zdGF0aWMgcHJvcERlY29yYXRvcnM6IHtba2V5OiBzdHJpbmddOiBEZWNvcmF0b3JJbnZvY2F0aW9uW119ID0ge1xuJ25vZGUnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4naW5kZXgnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4ndGVtcGxhdGVzJzogW3sgdHlwZTogSW5wdXQgfSxdLFxufTtcbn1cblxuaW50ZXJmYWNlIERlY29yYXRvckludm9jYXRpb24ge1xuICB0eXBlOiBGdW5jdGlvbjtcbiAgYXJncz86IGFueVtdO1xufVxuIl19