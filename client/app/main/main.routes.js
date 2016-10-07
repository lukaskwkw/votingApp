'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
  	.state('main', {
    url: '/',
    template: '<main></main>'
  })
  	.state('poll', {
    url: '/polls/:id',
    template: '<main></main>'
  })
}
