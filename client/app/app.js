'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import localStorage from 'angular-local-storage';

// TODO: sprawdzic gdzies w kodzie przed korzystaniem z funkcji
// isSupported
// https://github.com/grevory/angular-local-storage#issupported

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';

// import ngMessages from 'angular-messages';
// import ngValidationMatch from 'angular-validation-match';


import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import affix from '../components/affix';
import pollComponent from '../components/poll/poll.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import ngChartjs from '../../node_modules/angular-chart.js/dist/angular-chart.min.js';
import ngNotify from '../../node_modules/ng-notify/dist/ng-notify.min.js';
import './app.scss';

angular.module('fccVotingApp2App', [ngChartjs, affix, 'ngNotify', ngCookies, ngResource, ngSanitize, localStorage, uiRouter, uiBootstrap, _Auth,
    account, admin, navbar, footer, pollComponent, main, constants, util
  ])
  .config(routeConfig)
  .config(localStorageServiceProvider => {
    'ngInject';
    localStorageServiceProvider
      .setStorageType('sessionStorage')
      .setPrefix('votingApp')
      .setDefaultToCookie(false);
  })
  .run(function($rootScope, $location, Auth, localStorageService) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in
    localStorageService.set('timeStamp', Math.ceil(new Date().getTime() / 1000));
    let timeStamp = localStorageService.get('timeStamp');

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });



angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['fccVotingApp2App'], {
      strictDi: true
    });
  });