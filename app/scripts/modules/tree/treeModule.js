
angular.module('treeModule', ['tree.service', 'tree.factory', 'tree.directive', 'contextMenuModule']);

angular.module('tree.directive', [])
.directive('tree', function ($compile, NodesHelper, NodeTrackingService, TreeRecursionHelper) {
        return {
            restrict: "A",
            require: "^tree",
            transclude: true,
            scope: {
                node: '=',
                type: '='
            },
            replace: false,
            controller: function ($scope, $rootScope) {
                
                $scope.isReadOnly = true;

                $scope.hover = function () {
                    NodeTrackingService.setHoveredNode($scope.node);
                    $rootScope.$broadcast("hoveredNodeChanged");
                };

                $scope.exitHover = function () {
                    NodeTrackingService.removeHoveredNode();
                    $rootScope.$broadcast("hoveredNodeExit");
                };

                $scope.clickedStartIndex = 0;

                $scope.openDocument = function (event) {
                    if (ctrlClicked || shiftClicked) {
                        event.preventDefault();
                    } else {
                        // Open document navigation in here
                    }
                }

                $scope.clickNode = function (event) {

                    switch (event.which) {
                        case 1:

                            //left click
                            if (!(ctrlClicked || shiftClicked)) {
                                if (!angular.isUndefined($scope.$parent.node)) {
                                    NodeTrackingService.setClickedNodeIndex($scope.$parent.node.children.indexOf($scope.node));
                                }

                                if (NodeTrackingService.getClickedNodes().indexOf($scope.node) == -1) {
                                    // The node has not been selected so clear down all previous selections
                                    NodeTrackingService.clearClickedNodes();
                                    NodeTrackingService.addToClickedNodes($scope.node);
                                    NodeTrackingService.setClickedNode($scope.node);
                                } 
                            }

                            if (ctrlClicked) {
                                event.preventDefault();

                                var previousNode = NodeTrackingService.getClickedNode();
                                NodeTrackingService.setSelectedNode(previousNode);
                                NodeTrackingService.addToClickedNodes(previousNode);

                                var clickedNodes = NodeTrackingService.getClickedNodes();
                                var newSelectedState = 1;

                                // Check that they are all selected
                                for (var j = 0; j < clickedNodes.length; j++) {
                                    NodeTrackingService.setSelectedNode($scope.node);
                                    NodesHelper.selectChildNodeItterator(clickedNodes[j], newSelectedState);
                                }

                                if (clickedNodes.indexOf($scope.node) == -1) {
                                    NodeTrackingService.addToClickedNodes($scope.node);
                                    NodeTrackingService.setSelectedNode($scope.node);
                                    newSelectedState = 1;
                                } else {
                                    NodeTrackingService.removeClickedNode($scope.node);
                                    NodeTrackingService.removeSelectedNode($scope.node);
                                    newSelectedState = 0;
                                }

                                // Select all children
                                NodesHelper.selectChildNodeItterator($scope.node, newSelectedState);

                                // Emits the select to all parents in scope
                                $scope.$emit("SelectNodeParents", newSelectedState);


                            }

                            if (shiftClicked) {

                                event.preventDefault();

                                var startIndex = NodeTrackingService.getClickedNodeIndex();;
                                var endIndex = $scope.$parent.node.children.indexOf($scope.node);

                                var beginIndex = startIndex;
                                var toIndex = endIndex;

                                if (startIndex > endIndex) {
                                    beginIndex = endIndex;
                                    toIndex = startIndex;
                                }

                                NodeTrackingService.clearClickedNodes();

                                for (var i = beginIndex; i <= toIndex; i++) {
                                    NodeTrackingService.setSelectedNode($scope.$parent.node.children[i]);
                                    NodeTrackingService.addToClickedNodes($scope.$parent.node.children[i]);
                                }

                                NodesHelper.refreshSelectOrDeselectedBasedOnNodeTrackingService($scope.$parent.node, false);

                            }


                            break;
                        case 2:
                            break;
                        case 3:
                            // Check to see if the rightclicked item is in the selected list of items
                            var clickedNodes = NodeTrackingService.getClickedNodes();
                            var clickedInCurrentSelection = false;
                            var clickedNode = $scope.node;
                            for (var i = 0; i < clickedNodes.length; i++) {
                                var node = clickedNodes[i];
                                if (node === clickedNode) {
                                    clickedInCurrentSelection = true;
                                }
                            }

                            if (clickedInCurrentSelection) {
                                NodeTrackingService.setClickedNode($scope.node);
                            } else {
                                // remove all previous selections and add just this one
                                NodeTrackingService.clearClickedNodes();
                                NodeTrackingService.addToClickedNodes($scope.node);
                                NodeTrackingService.setSelectedNode($scope.node);
                                NodeTrackingService.setClickedNode($scope.node);
                            }
                            break;
                    }
                }

                $scope.isClickedNode = function () {
                    return NodeTrackingService.isClickedNode($scope.node);
                };

                $scope.$on('CreateFolder', function () {
                    if ($scope.type == "Folder") {
                        if (NodeTrackingService.getClickedNode().attr.documentGroupId == $scope.node.attr.documentGroupId && !$scope.node.attr.isEndNode) {
                            $scope.createFolder();
                        }
                    }
                });

                $scope.$on('RenameFolder', function () {
                    if ($scope.type == "Folder") {
                        if (!angular.isUndefined(NodeTrackingService.getClickedNode().attr) && NodeTrackingService.getClickedNode().attr.documentGroupId == $scope.node.attr.documentGroupId && !$scope.node.attr.isEndNode) {
                            $scope.setIsReadOnly(false);
                        }
                    }
                });

                $scope.$on('CutFolder', function () {
                    if ($scope.type == "Folder") {
                        if (!angular.isUndefined(NodeTrackingService.getClickedNode().attr) && NodeTrackingService.getClickedNode().attr.documentGroupId == $scope.node.attr.documentGroupId && !$scope.node.attr.isEndNode) {
                            $scope.cut();
                        }
                    }
                });

                $scope.$on('CopyFolder', function () {
                    if ($scope.type == "Folder") {
                        if (!angular.isUndefined(NodeTrackingService.getClickedNode().attr) && NodeTrackingService.getClickedNode().attr.documentGroupId == $scope.node.attr.documentGroupId && !$scope.node.attr.isEndNode) {
                            $scope.copy();
                        }
                    }
                });

                $scope.$on('PasteFolder', function () {
                    if ($scope.type == "Folder") {
                        if (!angular.isUndefined(NodeTrackingService.getClickedNode().attr) && NodeTrackingService.getClickedNode().attr.documentGroupId == $scope.node.attr.documentGroupId && !$scope.node.attr.isEndNode) {
                            $scope.paste();
                        }
                    }
                });

                $scope.$on('DeleteFolder', function () {
                    if ($scope.type == "Folder") {
                        if (!angular.isUndefined(NodeTrackingService.getClickedNode().attr) && NodeTrackingService.getClickedNode().attr.documentGroupId == $scope.node.attr.documentGroupId && !$scope.node.attr.isEndNode) {

                            $scope.deleteFolders();
                        }
                    }
                });

                $scope.customise = function () {
                   //Customise / Edit API call here
                }


                $scope.setIsReadOnly = function (isReadOnly) {
                    $scope.isReadOnly = isReadOnly;
                }

                $scope.renameNode = function () {
                    $scope.isReadOnly = true;
                    // Remane API Call in here
                };

                $scope.cut = function () {
                    NodeTrackingService.setIsCutOperation(true);
                    NodeTrackingService.setCutNodes();
                    NodeTrackingService.clearClickedNodes();
                }

                $scope.copy = function () {
                    NodeTrackingService.setIsCutOperation(false);
                    NodeTrackingService.setCopiedNodes();
                    NodeTrackingService.clearClickedNodes();
                }


                $scope.paste = function () {
                    // Paste api call in here
                }

                $scope.deleteFolders = function () {
                    // Delete api call in here
                }

                $scope.createFolder = function () {

                   //Create API call in here

                };

                // Work out the scopes 
                $scope.numberOfVisibleChildren = function () {
                    var numberOfVisibleChildren = 0;
                    if ($scope.node.children) {
                        for (var i = 0; i < $scope.node.children.length; i++) {
                            var child = $scope.node.children[i];
                            if (child.attr.show) {
                                numberOfVisibleChildren = numberOfVisibleChildren + 1;
                            }
                        }
                    }
                    return numberOfVisibleChildren;
                }


                $scope.$on('SelectNodeParents', function (node, value) {
                    NodesHelper.selectParentsChildNodeItterator($scope.node, value);
                });

                $scope.expandNode = function ($event) {
                    $event.preventDefault();
                    $scope.node.attr.expanded = !$scope.node.attr.expanded;
                    if ($scope.node.attr.expanded) {
                        NodeTrackingService.setExpandedNode($scope.node.attr.documentGroupId);
                    } else {
                        NodeTrackingService.removeExpandedNode($scope.node.attr.documentGroupId);
                    }
                };

                $scope.select = function ($event) {
                    $event.preventDefault();
                    var currentSelectedState = $scope.node.attr.selected;
                    var newSelectedState = 0;

                    if (currentSelectedState == 0) {
                        newSelectedState = 1;
                    }
                    if (currentSelectedState == 1) {
                        newSelectedState = 0;
                    }
                    if (currentSelectedState == 2) {
                        newSelectedState = 1;
                    }

                    $scope.node.attr.selected = newSelectedState;

                    if (newSelectedState == 1) {
                        NodeTrackingService.setSelectedNode($scope.node);
                    }
                    if (newSelectedState == 0) {
                        NodeTrackingService.removeSelectedNode($scope.node);
                    }

                    // Select all children
                    NodesHelper.selectChildNodeItterator($scope.node, newSelectedState);

                    // Emits the select to all parents in scope
                    $scope.$emit("SelectNodeParents", newSelectedState);

                };

            },

            template: '' +

                '<div class="endNode nodeListItem" ng-switch="node.attr.isEndNode">' +
                    '<a draganddrop ng-switch-when="true" ng-click="openDocument($event)" ng-mousedown="clickNode($event)" ng-class="{\'selected\': isClickedNode()}" popover type="{{type}}" isendnode="{{node.attr.isEndNode}}" nodeid="{{node.attr.documentId}}" isdraft="{{node.attr.draft}}" ng-mouseover="hover();" ng-mouseleave="exitHover();">' +
                        '<ins class="leaf"></ins>' +
                        '<ins ng-if="node.attr.selectable==true && node.attr.selected==0" class="checkedNone" name="$parent.$index" value="node.attr.nodeReference" ng-click="$event.stopPropagation(); select($event)"/>' +
                        '<ins ng-if="node.attr.selectable==true && node.attr.selected==1" class="checkedImg" name="$parent.$index" value="node.attr.nodeReference" ng-click="$event.stopPropagation(); select($event)"/>' +
                        '<ins ng-if="node.attr.selectable==true && node.attr.selected==2" class="checkedSome" name="$parent.$index" value="node.attr.nodeReference" ng-click="$event.stopPropagation(); select($event)"/>' +
                        '<ins class="doc" /> ' +
                        '<label class="treeNodeLabel">{{ node.data.title }}</label>' +
                    '</a>' +

                    '<a draganddrop  ng-switch-when="false" ng-switch="node.attr.expanded"  ng-mousedown="clickNode($event)" ng-class="{\'selected\': isClickedNode()}" popover type="{{type}}" isendnode="{{node.attr.isEndNode}}" nodeid="{{node.attr.documentGroupId}}" isdraft="{{node.attr.draft}}" documentGroupId="{{node.attr.documentGroupId}}">' +
                        '<ins ng-switch-when="true" ng-show="node.children.length > 0" class="open-tree" ng-click="$event.stopPropagation(); expandNode($event);"></ins>' +
                        '<ins ng-switch-when="false" ng-show="node.children.length > 0" class="closed" ng-click="$event.stopPropagation(); expandNode($event);"></ins>' +
                        '<ins ng-switch-when="true" ng-show="node.children.length == 0" class="folderLeaf"></ins>' +
                        '<ins ng-switch-when="false" ng-show="node.children.length == 0" class="folderLeaf"></ins>' +
                        '<ins ng-if="node.attr.selectable==true && node.attr.selected==0" class="checkedNone" name="$parent.$index" value="node.attr.nodeReference" ng-click="$event.stopPropagation(); select($event)"/>' +
                        '<ins ng-if="node.attr.selectable==true && node.attr.selected==1" class="checkedImg" name="$parent.$index" value="node.attr.nodeReference" ng-click="$event.stopPropagation(); select($event)"/>' +
                        '<ins ng-if="node.attr.selectable==true && node.attr.selected==2" class="checkedSome" name="$parent.$index" value="node.attr.nodeReference" ng-click="$event.stopPropagation(); select($event)"/>' +
                        '<ins class="folder" />' +
                        '<label ng-if="type!=\'Folder\'" class="treeNodeLabel"> {{ node.data.title }} ({{ node.children.length }})</label>' +
                        '<label ng-if="type==\'Folder\' && node.attr.documentGroupId == 0" class="treeNodeLabel"> {{ node.data.title }} ({{ node.children.length }})</label>' +
                        '<label ng-if="type==\'Folder\' && node.attr.documentGroupId != 0 && isReadOnly==true" ng-dblclick="setIsReadOnly(false)"  class="treeNodeLabel"> {{ node.data.title }} ({{ node.children.length }})</label>' +
                        '<input onfocus="this.select();" ng-if="type==\'Folder\' && node.attr.documentGroupId != 0 && isReadOnly==false" ng-readonly="isReadOnly" type="text" ng-model="node.data.title" ng-dblclick="setIsReadOnly(true)" focus-input ng-blur="isReadOnly?return:renameNode();" ng-enter="isReadOnly?return:$event.stopPropagation();renameNode();">' +
                    '</a>' +
                '</div>' +

                '<div ng-if="node.children  && node.children.length > 0 && node.attr.expanded" class="node">' +
                    '<ul>' +
                        '<li ng-repeat="child in node.children track by $index " ng-show="child.attr.show">' +
                            '<ul>' +
                                '<li tree ng-class="{\'folderdots \': !$last}" node="child" type="type"></li>' +
                            '</ul>' +
                        '</li>' +
                    '</ul>' +
                '</div>',
            compile: function (element) {
                return TreeRecursionHelper.compile(element);
            }
        };
    });
  
