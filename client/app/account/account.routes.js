'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
    url: '/login',
    template: require('./login/login.html'),
    controller: 'LoginController',
    controllerAs: 'vm'
  })
    .state('logout', {
      url: '/logout?referrer',
      referrer: 'main',
      template: '',
      controller($state, Auth) {
        'ngInject';

        var referrer = $state.params.referrer || $state.current.referrer || 'main';
        Auth.logout();
        $state.go(referrer);
      }
    })
    .state('signup', {
      url: '/signup',
      template: require('./signup/signup.html'),
      controller: 'SignupController',
      controllerAs: 'vm'
    })
    .state('settings', {
      url: '/settings',
      template: require('./settings/settings.html'),
      controller: 'SettingsController',
      controllerAs: 'vm',
      authenticate: true
    })
    .state('poll-builder', {
      url: '/poll-builder',
      template: require('./poll-builder/poll-builder.html'),
      controller: 'PollBuilderController',
      controllerAs: 'vm',
      authenticate: true
    })
    .state('edit-poll', {
      url: '/edit-poll',
      template: require('./poll-builder/poll-builder.html'),
      controller: 'PollEditController',
      controllerAs: 'vm',
      authenticate: true
    });
}
