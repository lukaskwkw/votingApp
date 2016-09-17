'use strict';

import angular from 'angular';

export default angular.module('fccVotingApp2App.constants', [])
  .constant('appConfig', require('../../server/config/environment/shared'))
  .name;
