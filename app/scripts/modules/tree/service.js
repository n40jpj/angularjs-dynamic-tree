
angular.module('tree.service', []);

angular.module('tree.service')
    .service("NodeTrackingService", function () {
        var node = {};
        var nodeList = [];
        var folderNodeList = [];
        var clickedNode = {};
        var clickedNodes = [];
        var hoveredNode = {};
        var expandedNodeList = [];
        var copiedNodeList = [];
        var folderClickedNode = {};
        var destinationFolderNodeList = [];
        var isCutOperation = false;
        var clickedNodeIndex = 0;
        var rightClickAndAction = false;
        var selectedTreeMenu = "CoreAndCustom";

        return {
            setSelectedTreeMenu: function(value) {
                selectedTreeMenu = value;
            },
            getSelectedTreeMenu: function() {
                return selectedTreeMenu;
            },
            setExpandedNode: function (value) {
                expandedNodeList.push(value);
            },
            clearExpandedNodes: function () {
                expandedNodeList = [];
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
            /* Node functions */
            setSelectedNode: function (value) {
                node = value;
                if (!angular.isUndefined(value.attr)) {
                    if (value.attr.isEndNode) {
                        var alreadyAdded = false;
                        for (var i = 0; i < nodeList.length; i++) {
                            if (nodeList[i].DocumentId == value.attr.documentId && nodeList[i].DocumentGroupId == value.attr.documentGroupId) {
                                alreadyAdded = true;
                            }
                        }

                        if (!alreadyAdded) {
                            var newNode = {
                                DocumentId: value.attr.documentId,
                                DocumentGroupId: value.attr.documentGroupId,
                                DocumentTypeId: value.attr.documentTypeId,
                                DocumentTitle: value.data.title,
                                Draft: value.attr.draft
                            };

                            nodeList.push(newNode);
                        }
                    } else {

                        //find the number of child folders
                        var numberOfChildFolders = 0;
                        for (var i = 0; i < value.children.length; i++) {
                            if (!value.children[i].attr.isEndNode) {
                                if (value.children[i].attr.documentGroupId < 1000000) {
                                    numberOfChildFolders = numberOfChildFolders + 1;
                                }
                            }
                        }

                        var alreadyAddedFolder = false;

                        // Check that the selected folder is not jsut a document grouping defined by 1900009
                        if (value.attr.documentGroupId < 1000000) {
                            for (var i = 0; i < folderNodeList.length; i++) {
                                if (folderNodeList[i].FolderGroupId == value.attr.documentGroupId) {
                                    alreadyAddedFolder = true;
                                }
                            }

                            if (!alreadyAddedFolder) {
                                var newFolderNode = {
                                    FolderGroupId: value.attr.documentGroupId,
                                    FolderTitle: value.data.title,
                                    NumberOfChildFolders: numberOfChildFolders
                                };
                                folderNodeList.push(newFolderNode);
                            }
                        }
                    }
                }
            },
            removeSelectedEndNode: function (documentId, documentGroupId) {
                for (var i = 0; i < nodeList.length; i++) {
                    var node = nodeList[i];
                    if (angular.isDefined(node) && node.DocumentId == documentId) {
                        nodeList.splice(i, 1);
                        i--;
                    }
                }

            },
            removeSelectedEndNodeByGroupId: function (documentId, documentGroupId) {
                for (var i = 0; i < nodeList.length; i++) {
                    var node = nodeList[i];
                    if (angular.isDefined(node) && node.DocumentId == documentId && nodeList[i].DocumentGroupId == documentGroupId) {
                        nodeList.splice(i, 1);
                        i--;
                    }
                }

            },
            removeSelectedNode: function (value) {
                node = value;
                if (value.attr.isEndNode) {
                    for (var i = 0; i < nodeList.length; i++) {
                        if (nodeList[i].DocumentId == value.attr.documentId && nodeList[i].DocumentGroupId == value.attr.documentGroupId) {
                            nodeList.splice(i, 1);
                        }
                    }
                } else {
                    for (var i = 0; i < folderNodeList.length; i++) {
                        if (folderNodeList[i].FolderGroupId == value.attr.documentGroupId) {
                            folderNodeList.splice(i, 1);
                        }
                    }
                }
            },
            removeSelectedNodeById: function (documentId) {
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].DocumentId == documentId) {
                        nodeList.splice(i, 1);
                    }
                }
            },
            removeSelectedFolderById: function (folderId) {
                for (var i = 0; i < folderNodeList.length; i++) {
                    if (folderNodeList[i].FolderGroupId == folderId) {
                        folderNodeList.splice(i, 1);
                    }
                }
            },

            /* NodeList functions */
            seedSelectNodeList: function (documentList, folderList ) {
                nodeList = documentList.slice();
                folderNodeList = folderList.slice();
            },
            getSelectedFolderNodeList: function () {
                return folderNodeList;
            },
            getSelectedFolderNodeListOfIds: function () {
                var folderNodeListIds = [];
                for (var i = 0; i < folderNodeList.length; i++) {
                    folderNodeListIds.push(folderNodeList[i].FolderGroupId);
                }
                return folderNodeListIds;
            },
            getSelectedNodeList: function () {
                return nodeList;
            },
            getDistinctSelectedNodeList: function (existingNodeList) {
                var distinctList = [];
                for (var i = 0; i < existingNodeList.length; i++) {
                    var currentNode = existingNodeList[i];
                    var found = false;
                    for (var j = 0; j < distinctList.length; j++) {
                        if (distinctList[j].DocumentId == currentNode.DocumentId) {
                            found = true;
                        }
                    }
                    if (!found) {
                        distinctList.push(currentNode);
                    }
                }
                return distinctList;
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
                folderNodeList = [];
                destinationFolderNodeList = [];

            },
            findSelectedNode: function (documentId, groupId) {
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].DocumentId == documentId && nodeList[i].DocumentGroupId == groupId) {
                        return true;
                    }
                }
                return false;
            },
            findSelectedFolder: function (groupId) {
                for (var i = 0; i < folderNodeList.length; i++) {
                    if (folderNodeList[i].FolderGroupId == groupId) {
                        return true;
                    }
                }
                return false;
            },
            getClickedNodeIndex: function () {
                return clickedNodeIndex;
            },
            setClickedNodeIndex: function (value) {
                clickedNodeIndex = value;
            },
            getRightClickAndAction: function () {
                return rightClickAndAction;
            },
            setRightClickAndAction: function (value) {
                rightClickAndAction = value;
            },
            getClickedNode: function () {
                return clickedNode;
            },
            setClickedNode: function (value) {
                clickedNode = value;
            },
            getClickedNodes: function () {
                return clickedNodes;
            },
            getClickedFolderNodes: function () {
                var returnNodes = [];
                for (var i = 0; i < clickedNodes.length; i++) {
                    var currentNode = clickedNodes[i];
                    if (!currentNode.attr.isEndNode) {
                        returnNodes.push(currentNode);
                    }
                }
                return returnNodes;
            },
            getClickedDocumentNodes: function () {
                var returnNodes = [];
                for (var i = 0; i < clickedNodes.length; i++) {
                    var currentNode = clickedNodes[i];
                    if (currentNode.attr.isEndNode) {
                        returnNodes.push(currentNode);
                    }
                }
                return returnNodes;
            },
            isClickedNode: function (value) {
                return clickedNodes.indexOf(value) > -1 ? true : false;
            },
            addToClickedNodes: function (value) {
                var alreadyAdded = false;
                for (var i = 0; i < clickedNodes.length; i++) {
                    if (clickedNodes[i] == value) {
                        alreadyAdded = true;
                    }
                }

                if (!alreadyAdded) {
                    clickedNodes.push(value);
                }
            },
            removeClickedNode: function (value) {
                clickedNodes.splice(clickedNodes.indexOf(value), 1);
            },
            clearClickedNodes: function () {
                clickedNodes = [];
                clickedNode = {};
            },
            getCopiedNodesCount: function () {
                return copiedNodeList.length;
            },
            getCopiedFolderNodes: function () {
                var returnNodes = [];
                for (var i = 0; i < copiedNodeList.length; i++) {
                    var currentNode = copiedNodeList[i];
                    if (!currentNode.attr.isEndNode) {
                        returnNodes.push(currentNode);
                    }
                }
                return returnNodes;
            },
            getCopiedDocumentNodes: function () {
                var returnNodes = [];
                for (var i = 0; i < copiedNodeList.length; i++) {
                    var currentNode = copiedNodeList[i];
                    if (currentNode.attr.isEndNode) {
                        returnNodes.push(currentNode);
                    }
                }
                return returnNodes;
            },
            setCutNodes: function () {
                copiedNodeList = angular.copy(clickedNodes);
            },
            setCopiedNodes: function () {
                var documentIds = [];
                var distinctNodes = [];
                for (var i = 0; i < clickedNodes.length; i++) {
                    if (documentIds.indexOf(clickedNodes[i].attr.documentId) == -1) {
                        distinctNodes.push(clickedNodes[i]);
                        documentIds.push(clickedNodes[i].attr.documentId);
                    }
                }
                copiedNodeList = angular.copy(distinctNodes);
            },
            clearCopiedNodes: function () {
                copiedNodeList = [];
            },
            setIsCutOperation: function (value) {
                isCutOperation = value;
            },
            getIsCutOperation: function () {
                return isCutOperation;
            },
            getHoveredNode: function () {
                return hoveredNode;
            },
            setHoveredNode: function (value) {
                hoveredNode = value;
            },
            removeHoveredNode: function () {
                hoveredNode = {};
            },
            setDestinationFolderNodes: function (value) {
                destinationFolderNodeList.push(value);
            },
            removeDestinationFolderNodes: function (value) {
                destinationFolderNodeList.splice(destinationFolderNodeList.indexOf(value), 1);
            },
            getDestinationFolderNodes: function () {
                return destinationFolderNodeList;
            },
            setFolderClickedNode: function (value) {
                folderClickedNode = value;
            },
            getFolderClickedNode: function () {
                return folderClickedNode;
            },
            clearFolderClickedNode: function () {
                folderClickedNode = {};
            }
        };
    });