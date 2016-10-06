'use strict';

import angular from 'angular';

export default angular.module('fccVotingApp2App.affix', [])
  .directive('affix', function ($window) {
      'ngInject';
      return {
          restrict: 'A',
          link: function ($scope, $element, attr) {
              var win = angular.element($window);
              var topOffset = $element[0].offsetTop;

              function affixElement() {

                  // console.log($window.pageYOffset);
                  // console.log(attr.offsettop);

                  if ($window.pageYOffset > topOffset + attr.offsettop) {
                      $element.css('position', 'fixed');
                      $element.css('top', '0px');
                  } else {
                      $element.css('position', '');
                      $element.css('top', '');
                  }
              }

              $scope.$on('$routeChangeStart', function() {
                  win.unbind('scroll', affixElement);
              });
              win.bind('scroll', affixElement);
          }
      };
  })
  .name;
