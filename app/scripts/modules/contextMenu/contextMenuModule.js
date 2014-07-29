angular.module('contextMenuModule', [])
.directive('contextMenuModule', ['$compile', function (compile) {
    return {
        scope: false,
        replace: false,
        link: function ($scope, element) {
            $scope.Print = function () {
                endRightClickEvent();
                alert("Print");
            };

            $scope.Edit = function () {
                endRightClickEvent();
                alert("Edit");
            };

            $scope.Delete = function () {
                endRightClickEvent();
                alert("Delete");
            };
            
            var htmlTemplate = htmlTemplate =
                        '<ul id="contextmenu-node" class="dropdown-menu">' +
                        '<li><a ng-click="$event.stopPropagation();Print()">Print</a></li>' +
                        '<li><a ng-click="$event.stopPropagation();Edit()">Edit</a></li>' +
                        '<li><a ng-click="$event.stopPropagation();Delete()">Delete</a></li>' +
                        '</ul>';
            
            element.on("contextmenu", function (e) {
                console.log("in right click");
                endRightClickEvent();
                element.css('background-color', 'LightBlue');
                e.preventDefault(); // default context menu is disabled
                e.stopPropagation(); // stop any further right click
                
                var newElement = compile(htmlTemplate)($scope);
                newElement.css({
                    left: event.clientX + 'px',
                    top: event.clientY + 'px'
                });
                element.append(newElement);
            });

            element.on("mouseleave", function (event) {
                endRightClickEvent(event);
            });
            
            function endRightClickEvent(event) {
                if ($("#contextmenu-node")){
                    $("#contextmenu-node").remove();
                    element.css('background-color', 'White');
                }
            }

            $scope.$on('$destroy', function () {
                $(document).unbind('mouseleave', endRightClickEvent);
                $(document).unbind('contextmenu', endRightClickEvent);
            });

        }
    };
}]);




