import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';
import _ from 'lodash';

export class MainController {

  /*@ngInject*/
  constructor(Poll, Auth, $state, filterFilter, $scope, $rootScope, localStorageService) {
    this.Auth = Auth;
    this.Poll = Poll;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.filterFilter = filterFilter;
    this.localStorageService = localStorageService;
    this.polls = [];
    this.isMyPollsDemand = false;
    this.$state = $state;

    this.Auth.getCurrentUser().then(user => {
      this.currentUser = user;

      if (!this.currentUser._id)
        this.currentUser._id = null;

      this.$rootScope.$broadcast('signature', this.currentUser._id);
    });
  }

  _getTimeDiff(timeStampThenInSec) {
    let now = Math.ceil(new Date().getTime() / 1000);
    let timeDiff = now - timeStampThenInSec;
    return timeDiff;
  }

  showAll() {
      this.filtered = this.filterFilter(this.polls, this.$scope.search);
      this.isMyPollsDemand = false;
      this.$rootScope.$broadcast('navShowAll');
  }

  $onInit() {

    let self = this;

    function _setWatchOnSearch() {
        self.filtered = [];

        self.currentPage = 1; //current page
        // self.maxSize = 5; //pagination max size
        self.entryLimit = 4; //max rows for data table

        /* init pagination with self.list */
        self.noOfPages = Math.ceil(self.polls.length / self.entryLimit);

        self.$scope.$watch('search', function(term) {
          // Create self.filtered and then calculat self.noOfPages, no racing!
          self.filtered = self.filterFilter(self.polls, term);
          if (self.isMyPollsDemand) {
            self.filtered = _.filter(self.filtered, {createdBy: self.currentUser._id})
            // console.log(test);
            // term = self.currentUser._id + ' ' + term;
            // console.log('haaha: ', term);
            self.$rootScope.$broadcast('signature', self.currentUser._id);

          }
          self.noOfPages = Math.ceil(self.filtered.length / self.entryLimit);
        });
      }

      // TODO: sprawdzic ifem czy juz cos zostalo zapisane w localStorag-u
      // jesli tak to zabrac z tamtad i przypisac do this.polls, o ile czas od tamtej pory nie przekroczyl
      // 30-60 sek (czas spradzac diffem Date.time czy cos takiego)
      // w przeciwnych wypadkach pobrac baze

    let localDB = this.localStorageService.get('PollsDB');
    var timeDiff = +this._getTimeDiff(this.localStorageService.get('timeStamp'));

    if (timeDiff > 30 || !localDB) {
      this.Poll.query().$promise.then(res => {
        this.polls = res;
        this.localStorageService.set('PollsDB', this.polls);

        _setWatchOnSearch();
        this.localStorageService.set('timeStamp', Math.ceil(new Date().getTime() / 1000));
      });
    } else {
      this.polls = this.localStorageService.get('PollsDB');
      _setWatchOnSearch();
    }


    this.$rootScope.$on('myPolls', (event, val)=>{
      if (val) {
        let user = this.Auth.getCurrentUserSync();
        self.filtered = _.filter(self.filtered, {createdBy:  user._id})
      }
      else
        this.filtered = this.filterFilter(this.polls, this.$scope.search);

      this.isMyPollsDemand = val;
    })

    this.$rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      self.$rootScope.$broadcast('navShowAll');
    });
  }

  editPoll(poll) {
    this.$state.go('edit-poll').then(()=>{
      this.$rootScope.$broadcast('poll', poll);
    });
  }

  deletePoll(poll) {
    let self = this;
    console.log(poll);
    console.log(this.polls.indexOf(poll));

    this.Poll.delete({
      id: poll._id
    }).$promise
    .then(() => {
      self.localStorageService.remove('PollsDB');
      self.polls.splice(self.polls.indexOf(poll), 1);
      self.filtered.splice(self.filtered.indexOf(poll), 1);
      // self.filtered = _.filter(self.filtered, {createdBy:  self.currentUser._id});
    });
  }
}

function startFrom() {
  return function(input, start) {
    if (input) {
      start = +start;
      return input.slice(start);
    }
    return [];
  };
}

export default angular.module('fccVotingApp2App.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .filter('startFrom', startFrom)
  .name;
