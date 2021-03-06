'use strict';

/**
 * @ngdoc function
 * @name angularjsDynamicTreeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularjsDynamicTreeApp
 */
angular.module('angularjsDynamicTreeApp')
  .controller('MainCtrl', function ($scope) {
      $scope.treeViewData =
      {"data":{"title":"Documents"},"attr":{"documentId":0,"href":"","documentGroupId":0,"documentTypeId":3,"selectable":false,"selected":0,"expanded":true,"isEndNode":false,"show":true,"draft":false},"children":[{"data":{"title":"Business"},"attr":{"documentId":0,"href":"","documentGroupId":6702,"documentTypeId":3,"selectable":true,"selected":0,"expanded":false,"isEndNode":false,"show":true,"draft":false},"children":[{"data":{"title":"Introduction To My Business"},"attr":{"documentId":18101,"href":"","documentGroupId":6702,"documentTypeId":2,"selectable":true,"selected":0,"expanded":false,"isEndNode":true,"show":true,"draft":false},"children":null}]},{"data":{"title":"Personal"},"attr":{"documentId":0,"href":"","documentGroupId":6704,"documentTypeId":3,"selectable":true,"selected":0,"expanded":false,"isEndNode":false,"show":true,"draft":false},"children":[{"data":{"title":"All about me"},"attr":{"documentId":18101,"href":"","documentGroupId":6704,"documentTypeId":2,"selectable":true,"selected":0,"expanded":false,"isEndNode":true,"show":true,"draft":false},"children":[{"data":{"title":"Holidays"},"attr":{"documentId":0,"href":"","documentGroupId":6859,"documentTypeId":3,"selectable":true,"selected":0,"expanded":false,"isEndNode":false,"show":true,"draft":false},"children":[{"data":{"title":"Summer Holiday Plan"},"attr":{"documentId":312,"href":"","documentGroupId":6859,"documentTypeId":1,"selectable":true,"selected":0,"expanded":false,"isEndNode":true,"show":true,"draft":false},"children":null},{"data":{"title":"Winter Holiday Plan"},"attr":{"documentId":12,"href":"","documentGroupId":6859,"documentTypeId":1,"selectable":true,"selected":0,"expanded":false,"isEndNode":true,"show":true,"draft":false},"children":null},{"data":{"title":"School Holiday Plan"},"attr":{"documentId":14,"href":"","documentGroupId":6859,"documentTypeId":1,"selectable":true,"selected":0,"expanded":false,"isEndNode":true,"show":true,"draft":false},"children":null}]}]}]}]};
  });
