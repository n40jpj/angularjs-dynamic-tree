
angular.module('treeModule', ['tree.service', 'tree.factory', 'tree.directive', 'contextMenuModule']);

angular.module('tree.service', [])
    .service("NodeTrackingService", function () {
        var node = {};
        var nodeList = [];
        var clickedNode = {};
        var hoveredNode = {};
        var expandedNodeList = [];

        return {
            setExpandedNode: function (value) {
                expandedNodeList.push(value);
            },
            removeExpandedNode: function (value) {
                expandedNodeList.splice(expandedNodeList.indexOf(value), 1);
            },
            findExpandedNode: function (value) {
                for (var i = 0; i < expandedNodeList.length; i++) {
                    if (expandedNodeList[i] == value) {
                        return true;
                    }
                }
                return false;
            },
            getSelectedNode: function () {
                    return node;
                },
            setSelectedNode: function (value) {
                node = value;
                if (value.attr.isEndNode) {
                    var newNode = {
                        DocumentId: value.attr.documentId,
                        DocumentGroupId: value.attr.documentGroupId,
                        DocumentTypeId: value.attr.documentTypeId,
                        DocumentTitle: value.data.title
                    };

                    var alreadyAdded = false;
                    
                    for (var i = 0; i < nodeList.length ; i++)
                    {
                        if (nodeList[i].DocumentId == value.attr.documentId) {
                            alreadyAdded = true;
                        }
                    }

                    if (!alreadyAdded) {
                        nodeList.push(newNode);
                    }
                }
            },
            removeSelectedNode: function (value) {
                node = value;
                if (value.attr.isEndNode) {
                    for (var i = 0; i < nodeList.length ; i++) {
                        if (nodeList[i].DocumentId == value.attr.documentId) {
                            nodeList.splice(i, 1);
                            
                        }
                    }
                }
            },
            getSelectedNodeList: function () {
                return nodeList;
            },
            getSelectedNodeListOfIds: function () {
                var selectedNodeIds = [];
                for (var i = 0; i < nodeList.length; i++) {
                    selectedNodeIds.push(nodeList[i].DocumentId);
                }
                return selectedNodeIds;
            },
            clearAllSelectedNodes: function () {
                nodeList = [];
            },
            findSelectedNode: function (value) {
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].DocumentId == value) {
                        return true;
                    }
                }
                return false;
            },
            getClickedNode: function () {
                return clickedNode;
            },
            setClickedNode: function (value) {
                clickedNode = value;
            },
            getHoveredNode: function () {
                return hoveredNode;
            },
            setHoveredNode: function (value) {
                hoveredNode = value;
            },
            removeHoveredNode: function () {
                hoveredNode = {};
            }
            
        };
    });

angular.module('tree.factory', [])
    .factory('TreeRecursionHelper', ['$compile', '$rootScope'
        , function ($compile, $rootScope) {
            var TreeRecursionHelper = {
                compile: function (element) {
                    var factory = {};
                    var contents = element.contents().remove();
                    var compiledContents;

                    factory = function(scope, element) {
                        
                        if (!compiledContents) {
                            compiledContents = $compile(contents);
                        }

                        /*Add drag and drop*/
                        if (scope.node.attr.isEndNode) {

                            var widget = "<div class='ui-widget-header'>" + scope.node.data.title + "</div>";

                            element.draggable({
                                snap: true,
                                revert: 'revert',
                                appendTo: 'body',
                                cursor: "move",
                                cursorAt: { top: 5, left: -10 },
                                helper: function (event) {
                                    return $(widget);
                                }

                            });
                            
                        }
                        else {
                            element.droppable({
                                hoverClass: 'tf_dropBox_hover',
                                greedy: true,
                                drop: function(event, ui) {
                                    
                                nodeScope = angular.element(ui.draggable).scope()
                                nodeParentScope = nodeScope.$parent;

                                if (!(angular.isUndefined(nodeParentScope)
                                    && angular.isUndefined(nodeParentScope.node)
                                    && angular.isUndefined(nodeParentScope.node.children)
                                    && angular.isUndefined(nodeScope.$index)
                                    )) {

                                    // Remove the old node
                                    nodeParentScope.node.children.splice(nodeScope.$index, 1);

                                    // Add the new node
                                    scope.node.children.push(nodeScope.child);

                                    // Save the changes to the scope
                                    scope.$apply();

                                }   

                                }
                            });
                        }

                        compiledContents(scope, function(clone) {
                            element.append(clone);
                        });

                    };
                    return factory;
                }
            };
            return TreeRecursionHelper;
        }
    ])
    .factory('NodesHelper', function (NodeTrackingService) {
        var NodesHelper = {
            refreshSelectOrDeselectedBasedOnNodeTrackingService: function (currentNode) {
                if (currentNode != null) {
                    // We need to go over all of the parents direct child items to work out if this node should be selected or not
                    if (currentNode.children) {
                        for (var i = 0; i < currentNode.children.length; i++) {
                            var child = currentNode.children[i];
                            if (child.attr.isEndNode && NodeTrackingService.findSelectedNode(child.attr.documentId)) {
                                child.attr.selected = true;
                            }
                            if (child.children) {
                                // go to the folders children and select
                                NodesHelper.refreshSelectOrDeselectedBasedOnNodeTrackingService(child);
                            }
                        };
                    }
                    NodesHelper.findChildNodeAndSetStateOfParentsItterator(currentNode);
                }
            },
            refreshExpandedNodesBasedOnNodeTrackingService: function (currentNode) {
                if (currentNode != null) {
                    // We need to go over all of the parents direct child items to work out if this node should be selected or not
                    if (currentNode.children) {
                        for (var i = 0; i < currentNode.children.length; i++) {
                            var child = currentNode.children[i];
                            
                            if (!child.attr.isEndNode && NodeTrackingService.findExpandedNode(child.attr.documentGroupId)) {
                                child.attr.expanded = true;
                            }
                            if (child.children) {
                                // go to the folders children and select
                                NodesHelper.refreshExpandedNodesBasedOnNodeTrackingService(child);
                            }
                        };
                    }
                }
            },
            findChildNodesAndSelectOrDeselect: function (currentNode, documentIdToFind, newValue) {

                if (currentNode != null) {
                    // We need to go over all of the parents direct child items to work out if this node should be selected or not
                    if (currentNode.children) {
                        // We have a folder

                        for (var i = 0; i < currentNode.children.length; i++) {
                            var child = currentNode.children[i];
                            if (child.attr.isEndNode) {
                                if (child.attr.documentId == documentIdToFind) {
                                    child.attr.selected = newValue;
                                    if (newValue == 1) {
                                        NodeTrackingService.setSelectedNode(child);
                                    }
                                    if (newValue == 0) {
                                        NodeTrackingService.removeSelectedNode(child);
                                    }
                                }
                            } else {
                                if (child.children) {
                                    // go to the folders children and select
                                    NodesHelper.findChildNodesAndSelectOrDeselect(child, documentIdToFind, newValue);
                                }
                            }
                            

                        };
                    }
                }
            },
            findChildNodeAndSetStateOfParentsItterator: function (currentNode) {
                if (currentNode != null) {
                    
                    // We need to go over all of the parents direct child items to work out if this node should be selected or not
                    if (currentNode.children) {
                        // We have a folder
                        var selectedChildCount = 0;
                        var partiallySelectedCount = 0;

                        for (var i = 0; i < currentNode.children.length; i++) {
                            var child = currentNode.children[i];
                            NodesHelper.findChildNodeAndSetStateOfParentsItterator(child);
                            if (child.attr.selected == 1) { selectedChildCount = selectedChildCount + 1; }
                            if (child.attr.selected == 2) { partiallySelectedCount = partiallySelectedCount + 1; }
                        }

                        // Partially Selected
                        if (selectedChildCount > 0 || partiallySelectedCount > 0) {
                            newValue = 2;
                        }
                        
                        // All Children Selected
                        if (selectedChildCount == currentNode.children.length) {
                            if (selectedChildCount == 1) {
                                newValue = currentNode.children[0].attr.selected;
                            } else {
                                newValue = 1;
                            }
                        }
                        
                        // No children selected
                        if (selectedChildCount == 0 && partiallySelectedCount == 0) {
                            newValue = 0;
                        }
                        currentNode.attr.selected = newValue;
                    }
                }
            },
            selectParentsChildNodeItterator: function (currentNode, newValue) {
                
                if (currentNode != null) {
                    // We need to go over all of the parents direct child items to work out if this node should be selected or not
                    if (currentNode.children) {
                        // We have a folder
                        var selectedChildCount = 0;
                        var partiallySelectedCount = 0;

                        for (var i = 0; i < currentNode.children.length; i++) {
                            var child = currentNode.children[i];
                            if (child.attr.selected == 1) { selectedChildCount = selectedChildCount + 1; }
                            if (child.attr.selected == 2) { partiallySelectedCount = partiallySelectedCount + 1; }
                        }

                        // Partially Selected
                        if (selectedChildCount > 0 || partiallySelectedCount > 0) {
                            newValue = 2;
                        }

                        // No children selected
                        if (selectedChildCount == 0 && partiallySelectedCount == 0) {
                            newValue = 0;
                        }

                        // All Children Selected
                        if (selectedChildCount == currentNode.children.length) {
                            if (selectedChildCount == 1) {
                                newValue = currentNode.children[0].attr.selected;
                            }
                            else {
                                newValue = 1;
                            }
                        }
                    }
                    currentNode.attr.selected = newValue;
                }
            },
            selectChildNodeItterator: function (currentNode, newValue) {
                if (currentNode != null) {
                    // We need to go over all of the parents direct child items to work out if this node should be selected or not
                    if (currentNode.children) {
                        // We have a folder

                        for (var i = 0; i < currentNode.children.length; i++) {
                            var child = currentNode.children[i];
                            
                            if (child.attr.show) {
                                child.attr.selected = newValue;
                                if (newValue == 1) {
                                    NodeTrackingService.setSelectedNode(child);
                                }
                                if (newValue == 0) {
                                    NodeTrackingService.removeSelectedNode(child);
                                }
                            }
                            if (child.children) {
                                // go to the folders children and select
                                NodesHelper.selectChildNodeItterator(child, newValue);
                            }

                        };//);
                    }

                    if (currentNode.attr.show) {
                        currentNode.attr.selected = newValue;
                    }
                }
            },
            showParentsNodeItterator: function (currentNode) {
                if (currentNode != null && !currentNode.attr.isEndNode) {
                    // We need to go over all of the parents direct child items to work out if this node should be selected or not
                    if (currentNode.children) {
                        // We have a folder
                        var hiddenChildCount = 0;
                        for (var i = 0; i < currentNode.children.length; i++) {
                            if (!currentNode.children[i].attr.show) { hiddenChildCount = hiddenChildCount + 1 }
                        };

                        if (hiddenChildCount == currentNode.children.length) {
                            currentNode.attr.show = false;
                        }
                        else {
                            currentNode.attr.show = true;
                        }
                    }
                    else {
                        currentNode.attr.show = true;
                    }
                }
            }

        };

        return NodesHelper;
    });

angular.module('tree.directive', [])
    .directive('tree', function ($compile, NodesHelper, NodeTrackingService, TreeRecursionHelper) {
        return {
            restrict: "A",
            scope: {
                node: '='
            },
            replace: false,
            controller: function ($scope, $rootScope, $location) {

                $scope.hover = function () {
                    NodeTrackingService.setHoveredNode($scope.node);
                    $scope.$emit("hoveredNodeChanged");
                };

                $scope.exitHover = function () {
                    NodeTrackingService.removeHoveredNode();
                    $scope.$emit("hoveredNodeChanged");
                };

                $scope.countVisibleChildren = function () {
                    var numberOfVisibleChildren = 0;
                    for (var i = 0; i < $scope.node.children.length; i++) {
                        var child = $scope.node.children[i];
                        if (child.attr.show) {
                            numberOfVisibleChildren = numberOfVisibleChildren + 1;
                        }
                    }
                    return numberOfVisibleChildren;
                };

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

                    $scope.$emit("SaveSelectedNodes", newSelectedState);

                    // Emits the select to all parents in scope
                    $scope.$emit("SelectNodeParents", newSelectedState);

                };

            },

            template: 
                '<div class="endNode" ng-switch="node.attr.isEndNode" >' +
                    '<ins ng-switch-when="true" class="leaf" />' +
                    '<a ng-switch-when="true" href="{{node.attr.href}}}}" context-menu-module isendnode="{{node.attr.isEndNode}}" nodeid="{{node.attr.documentId}}" isdraft="{{node.attr.draft}}" ng-mouseover="hover();" ng-mouseleave="exitHover();">' +
                        '<ins ng-if="node.attr.selectable==true && node.attr.selected==0" class="checkedNone" name="$parent.$index" value="node.attr.nodeReference" ng-click="$event.stopPropagation(); select($event)"/>' +
                        '<ins ng-if="node.attr.selectable==true && node.attr.selected==1" class="checkedImg" name="$parent.$index" value="node.attr.nodeReference" ng-click="$event.stopPropagation(); select($event)"/>' +
                        '<ins ng-if="node.attr.selectable==true && node.attr.selected==2" class="checkedSome" name="$parent.$index" value="node.attr.nodeReference" ng-click="$event.stopPropagation(); select($event)"/>' +
                        '<ins class="doc" /> ' +
                        '<span>{{ node.data.title }}</span>' +
                    '</a>' +
                    '<a ng-switch-when="false" ng-switch="node.attr.expanded" context-menu-module isendnode="{{node.attr.isEndNode}}" nodeid="{{node.attr.documentGroupId}}" isdraft="{{node.attr.draft}}">' +
                        '<ins ng-switch-when="true" class="open-tree" ng-click="$event.stopPropagation(); expandNode($event);" />' +
                        '<ins ng-switch-when="false" class="closed" ng-click="$event.stopPropagation(); expandNode($event);" />' +
                        '<ins ng-if="node.attr.selectable==true && node.attr.selected==0" class="checkedNone" name="$parent.$index" value="node.attr.nodeReference" ng-click="$event.stopPropagation(); select($event)"/>' +
                        '<ins ng-if="node.attr.selectable==true && node.attr.selected==1" class="checkedImg" name="$parent.$index" value="node.attr.nodeReference" ng-click="$event.stopPropagation(); select($event)"/>' +
                        '<ins ng-if="node.attr.selectable==true && node.attr.selected==2" class="checkedSome" name="$parent.$index" value="node.attr.nodeReference" ng-click="$event.stopPropagation(); select($event)"/>' +
                        '<ins class="folder" />' +
                        '<label class="isNotSearchResult"> {{ node.data.title }}</label>' +
                    '</a>' +
                '</div>' +

                '<div ng-if="node.children && node.attr.expanded" class="node">' +
                    '<ul ng-if="countVisibleChildren()==\'0\'" >' +
                        '<li>' +
                            '<ul>' +
                                '<li>' +
                                    '<div class="endNode">' +
                                        '<ins class="leaf" />' +
                                        '<a href="#">' +
                                            '<span> No Results Found </span>' +
                                        '</a>' +
                                    '</div>' +
                                '</li>' +
                            '</ul>' +
                        '</li>' +
                    '</ul>' +
                    '<ul>' +
                        '<li ng-repeat="child in node.children track by $index " ng-show="child.attr.show">' +
                            '<ul>' +
                                '<li ng-if="!$last" class="dots" tree node="child" type="type" ></li>' +
                                '<li ng-if="$last" tree node="child" type="type"></li>' +
                            '</ul>' +
                        '</li>' +
                    '</ul>' +
                '</div>',
            compile: function (element) {
                return TreeRecursionHelper.compile(element);
            }
        };
    });
