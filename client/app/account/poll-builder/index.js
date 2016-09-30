'use strict';

import angular from 'angular';
import PollBuilderController from './poll-builder.controller';
import PollEditController from './poll-edit.controller';

export default angular.module('fccVotingApp2App.poll-builder', [])
  .controller('PollBuilderController', PollBuilderController)
  .controller('PollEditController', PollEditController)
  .name;
