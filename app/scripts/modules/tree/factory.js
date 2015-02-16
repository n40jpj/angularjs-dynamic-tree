
angular.module('tree.factory', ['tree.service']);

angular.module('tree.factory')
    .factory('TreeRecursionHelper', ['$compile'
        , function ($compile) {
            var TreeRecursionHelper = {
                compile: function (element) {
                    var factory = {};

                    var contents = element.contents().remove();
                    var compiledContents;

                    factory = function (scope, element) {

                        if (!compiledContents) {
                            compiledContents = $compile(contents);
                        }

                        compiledContents(scope, function (clone) {
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
            collapseNodes: function (currentNode) {                
                if (currentNode != null) {
                    if (currentNode.children) {
                        for (var i = 0; i < currentNode.children.length; i++) {
                            //Close all the child folders
                            var child = currentNode.children[i];
                            child.attr.expanded = false;
                        }
                    }
                }                              
            },
            removeSelectableValueFromAllNodes: function (currentNode) {
                currentNode.attr.selectable = false;
                if (currentNode.children) {
                    for (var i = 0; i < currentNode.children.length; i++) {
                        NodesHelper.removeSelectableValueFromAllNodes(currentNode.children[i]);
                    }
                }
            },
            refreshSelectOrDeselectedBasedOnNodeTrackingService: function (currentNode, checkParent) {
                if (currentNode != null) {

                    var checkChildren = false;

                    if (!checkParent) {
                        checkChildren = true;
                    } else {
                        if (currentNode.attr.selected == 1 || currentNode.attr.selected == 2) {
                            checkChildren = true;
                        } else {
                            checkChildren = false;
                        }
                    }

                    // We need to go over all of the parents direct child items to work out if this node should be selected or not
                    if (currentNode.children && checkChildren) {
                        for (var i = 0; i < currentNode.children.length; i++) {
                            var child = currentNode.children[i];

                            // Check if the child end node is seleted or not
                            if (child.attr.isEndNode) {
                                if (NodeTrackingService.findSelectedNode(child.attr.documentId, child.attr.documentGroupId)) {
                                    child.attr.selected = 1;
                                } else {
                                    child.attr.selected = 0;
                                }


                            }
                            else {
                                // Check if the child end node is seleted or not
                                if (NodeTrackingService.findSelectedFolder(child.attr.documentGroupId)) {
                                    child.attr.selected = 1;
                                } else {
                                    child.attr.selected = 0;
                                }
                            }
                            if (child.children) {
                                // go to the folders children and select
                                NodesHelper.refreshSelectOrDeselectedBasedOnNodeTrackingService(child, checkParent);
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
                var newValue = 0;
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
                            if (NodeTrackingService.findSelectedFolder(currentNode.attr.documentGroupId)) {
                                newValue = 1;
                            } else {
                                newValue = 0;
                            }
                            
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
                            newValue = 1;
                        }

                        if (currentNode.children.length == 0) {
                            if (currentNode.attr.selected == 0 || currentNode.attr.selected == 2) {
                                newValue = 0;
                            } else {
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
                    if (!angular.isUndefined(currentNode.attr)) {
                        if (currentNode.attr.show) {
                            currentNode.attr.selected = newValue;
                        }
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
                            if (!currentNode.children[i].attr.show) {
                                hiddenChildCount = hiddenChildCount + 1;
                            }
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