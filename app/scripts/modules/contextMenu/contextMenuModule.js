angular.module('contextMenuModule', ['tree.service'])

.directive('popover', ['$compile', 'NodeTrackingService', function (compile, NodeTrackingService) {
    return {
        scope: false,
        replace: false,
        link: function ($scope, element, attributes) {
            
            $scope.Print = function () {
                alert("Problem with Print");
            };

            $scope.Customsie = function () {
                handleClickEvent();
                //$state.go('main.document.customise', { id: attributes.nodeid });
            };

            $scope.CopyAndCustomsie = function () {
                handleClickEvent();
                //$state.go('main.document.customise', { id: result.DocumentId });
            };

            $scope.CopyDocuments = function (event) {
                handleClickEvent();
                NodeTrackingService.setRightClickAndAction(true);
                //$state.go('main.documents.copy');
            };

            $scope.Delete = function () {
                handleClickEvent();
                NodeTrackingService.setRightClickAndAction(true);
                //$state.go('main.documents.delete');
            };

            $scope.Approve = function () {
                handleClickEvent();
                NodeTrackingService.setRightClickAndAction(true);
                //$state.go('main.documents.approve');
            };

            $scope.AddToFolder = function () {
                handleClickEvent();
                //$state.go('main.documents.addToFolder');
            };

            $scope.RemoveFromFolder = function () {
                handleClickEvent();
                NodeTrackingService.setRightClickAndAction(true);
                //$state.go('main.documents.removeFromFolder');
            };

            /* SERVICE MODEL FOLDER OPTIONS*/

            $scope.CreateFolder = function () {
                handleClickEvent();
                $scope.$parent.createFolder();
            };
            $scope.RenameFolder = function () {
                handleClickEvent();
                $scope.$parent.setIsReadOnly(false);
            };
            $scope.Cut = function () {
                handleClickEvent();
                $scope.$parent.cut();
            };
            $scope.Copy = function () {
                handleClickEvent();
                $scope.$parent.copy();
            };
            $scope.Paste = function () {
                handleClickEvent();
                $scope.$parent.paste();
            };
            $scope.DeleteFolders = function () {
                handleClickEvent();
                $scope.$parent.deleteFolders();
            };


            element.on("contextmenu", function (event) {
                
                
                var htmlTemplate = '';
                var showRightClick = true;

                handleClickEvent();
                event.preventDefault(); // default context menu is disabled
                event.stopPropagation();

                var screenHeight = screen.height;
                var xPosition = event.clientX - element[0].getBoundingClientRect().left;
                var yPosition = event.clientY - element[0].getBoundingClientRect().top;
            

                        htmlTemplate =
                            '<ul id="contextmenu-node" class="dropdown-menu">';
                        htmlTemplate +=
                            '<li><a ng-mousedown="$event.preventDefault();$event.stopPropagation();" ng-click="$event.stopPropagation();Cut()">Cut</a></li>' +
                            '<li><a ng-mousedown="$event.preventDefault();$event.stopPropagation();" ng-click="$event.stopPropagation();Copy()">Copy</a></li>';
                        
                        if (NodeTrackingService.getCopiedNodesCount() > 0) {
                            htmlTemplate += '<li><a ng-mousedown="$event.preventDefault();$event.stopPropagation();" ng-click="$event.stopPropagation();Paste()">Paste</a></li>';
                        }
                        htmlTemplate += '<li><a ng-mousedown="$event.preventDefault();$event.stopPropagation();" ng-click="$event.stopPropagation();RemoveFromFolder()">Delete From Service Model</a></li>';
                        htmlTemplate += '<li><a ng-mousedown="$event.preventDefault();$event.stopPropagation();" ng-click="$event.preventDefault();$event.stopPropagation();CopyDocuments($event)">Copy To Draft</a></li>';
                        htmlTemplate += '</ul>';

                    var newElement = compile(htmlTemplate)($scope);
                    newElement.css({
                        left: xPosition + 'px',
                        top: yPosition + 'px'
                    });                    
                    element.append(newElement);

  
            });

            element.on("mouseleave", function () {
                // on mouse leave, the context menu is removed.
                handleClickEvent();
            });

            function handleClickEvent() {
                if ($("#contextmenu-node")) {
                    $("#contextmenu-node").remove();
                    element.css('background-color', 'White');
                }
            }

            $scope.$on('$destroy', function () {
                $(document).unbind('mouseleave', handleClickEvent);
                $(document).unbind('contextmenu', handleClickEvent);
            });

        }
    };
}])

.directive('draganddrop', function ($compile, NodeTrackingService) {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
                
                
                // Set up folder / service model drag and drop

                element.draggable({
                    helper: function(event, ui) {
                        return '<div class="tree-widget documentHover" ></div>';
                    },
                    start: function(event, ui) {
                        var folders = NodeTrackingService.getClickedFolderNodes();
                        var documents = NodeTrackingService.getClickedDocumentNodes();
                        var title = "";
                        
                        folders.length > 1 ? title = "Move Folders" : title = title;
                        folders.length == 1 ? title = "Move Folders" : title = title;
                        if (folders.length > 0) {
                            documents.length > 1 ? title = title + " & Documents" : title = title;
                            documents.length == 1 ? title = title + " & Documents" : title = title;
                        } else {
                            documents.length > 1 ? title = "Move Documents" : title = title;
                            documents.length == 1 ? title = "Move Document" : title = title;
                        }

                        var widgetHtml = "<div class='tree-widget-header text-center'>" + title + "</div>";
                        widgetHtml += "<div class='tree-widget-content'>";

                        if (folders.length > 0) {
                            widgetHtml += "<h4>Folders</h4><ul>";
                            for (var i = 0; i < folders.length; i++) {
                                widgetHtml += "<li>" + folders[i].data.title + "</li>";
                            }
                            widgetHtml += "</ul>";
                        }
                        if (documents.length > 0) {
                            widgetHtml += "<h4>Documents</h4><ul>";
                            for (var i = 0; i < documents.length; i++) {
                                widgetHtml += "<li>" + documents[i].data.title + "</li>";
                            }
                            widgetHtml += "</ul>";
                        }
                        widgetHtml += "</div>";

                        angular.element(ui.helper)[0].innerHTML = widgetHtml;
                    },
                    scroll: true,
                    scrollSensitivity: 20,
                    scrollSpeed: 10,
                    opacity: 0.9,
                    delay: 250,
                    cursor: "move",
                    axis: 'y',
                    revert: "invalid",
                    revertDuration: 100,
                    zIndex: 9999,
                    cursorAt: { top: -15, left: 100 },
                });

                element.droppable({
                    greedy: true,
                    hoverClass: "sm_dropBox_hover",
                    tolerance: 'pointer',
                    drop: function(event, ui) {
                        var draggedNode = angular.element(ui.draggable).scope().node;


                        if (NodeTrackingService.getClickedNodes().length == 0) {
                            NodeTrackingService.clearClickedNodes();
                            NodeTrackingService.addToClickedNodes(draggedNode);
                            NodeTrackingService.setClickedNode(draggedNode);
                        }

                        if (!scope.node.attr.isEndNode) {
                            scope.$parent.cut();
                            NodeTrackingService.setClickedNode(scope.node);
                            alert ("Dropped node(s)");
                            scope.$parent.paste();
                        } 

                    },
                });

            

            scope.$on('$destroy', function () {
                element.off('**');
            });
        }
    };
});



