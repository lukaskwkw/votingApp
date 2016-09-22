'use strict';

import angular from 'angular';
import PollBuilderController from './poll-builder.controller';

export default angular.module('fccVotingApp2App.poll-builder', [])
  .controller('PollBuilderController', PollBuilderController)
  .name;
