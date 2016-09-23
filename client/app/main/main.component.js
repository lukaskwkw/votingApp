import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  /*@ngInject*/
  constructor($http, Poll) {
    this.$http = $http;
    this.Poll = Poll;

  }

  $onInit() {
    this.Poll.query().$promise.then(res=> {
      this.polls = res;
      console.log(res);
    })
  }
}

export default angular.module('fccVotingApp2App.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
