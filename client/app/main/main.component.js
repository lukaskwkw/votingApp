import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  /*@ngInject*/
  constructor(Poll, Auth) {
    this.Auth = Auth;
    this.Poll = Poll;

  }

  $onInit() {
    this.Poll.query().$promise.then(res=> {
      this.polls = res;
      console.log(res);
    });

    this.Auth.getCurrentUser().then(user=>{
      this.currentUser = user;

      if (!this.currentUser._id)
          this.currentUser._id = null;
    })

  }

  deletePoll(poll) {
    console.log(this.polls.indexOf(poll));

    this.Poll.delete({
      id: poll._id
    }).$promise(()=>{
      this.polls.splice(this.polls.indexOf(poll), 1);
    });

  }
}

export default angular.module('fccVotingApp2App.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
