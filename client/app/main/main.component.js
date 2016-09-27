import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  /*@ngInject*/
  constructor(Poll, Auth, filterFilter, $scope) {
    this.Auth = Auth;
    this.Poll = Poll;
    this.$scope = $scope;
    this.filterFilter = filterFilter;
    this.polls = [];
  }

  $onInit() {
    this.Poll.query().$promise.then(res=> {
      this.filtered = '';


      this.polls = res;
      console.log(res);


      let self = this;
      this.currentPage = 1; //current page
      this.maxSize = 5; //pagination max size
      this.entryLimit = 4; //max rows for data table

      /* init pagination with this.list */
      this.noOfPages = Math.ceil(this.polls.length/this.entryLimit);

      this.$scope.$watch('search', function(term) {
          // Create this.filtered and then calculat this.noOfPages, no racing!
          self.filtered = self.filterFilter(self.polls, term);
          self.noOfPages = Math.ceil(self.filtered.length/self.entryLimit);
      });
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

function startFrom() {
  return function(input, start) {
      if(input) {
          start = +start;
          return input.slice(start);
      }
      return [];
  }
}

export default angular.module('fccVotingApp2App.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .filter('startFrom', startFrom)
  .name;
