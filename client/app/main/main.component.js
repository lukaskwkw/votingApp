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
    console.log('constructor');
    console.log('Poll service polls', this.Poll.polls);
    this.isMyPollsDemand = false;
    this.$state = $state;
    self = this;


    // TODO: check if all votes have been perfomed
    // if so navigate to next page if avialiable or to page where votes
    // have been checked
    // only for logged user (for now)

    // $scope.$on('vote', (event, val)=>{
    //   if (this.currentUser._id === null)
    //     return;

    //   this.filt

    // });


    $scope.$on('keydown', function( msg, code ) {
      self.noOfPages = Math.ceil(self.filtered.length / self.entryLimit);
      if (code === 39 && self.currentPage !== self.noOfPages) {
        self.currentPage = self.currentPage + 1
      }
      if (code === 37 && self.currentPage !== 1) {
        self.currentPage = self.currentPage - 1
      }
      self.$rootScope.$apply();
    });

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
      this.filtered = this.filterFilter(self.Poll.polls, this.$scope.search);
      this.noOfPages = Math.ceil(this.filtered.length / this.entryLimit);
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
        self.noOfPages = Math.ceil(self.filtered.length / self.entryLimit);

        self.$scope.$watch('search', function(term) {
          // Create self.filtered and then calculat self.noOfPages, no racing!
          self.filtered = self.filterFilter(self.Poll.polls, term);
          if (self.isMyPollsDemand) {
            self.filtered = _.filter(self.filtered, {createdBy: self.currentUser._id})
            self.$rootScope.$broadcast('signature', self.currentUser._id);
          }
          self.noOfPages = Math.ceil(self.filtered.length / self.entryLimit);
        });
      }

      if (!this.Poll.polls)
      this.Poll.$resource.query().$promise.then(res => {
        this.Poll.polls = res;
        console.log('pobrano polle');
        console.log(this.Poll.polls);
        // this.polls = res;
        let categories = _.uniq(_.map(this.Poll.polls, 'category'));
        this.$rootScope.categories = categories;
        this.localStorageService.set('categories', categories);
        // this.$rootScope.polls = this.polls;
        _setWatchOnSearch();
      });
    else  {
      // this.polls = this.$rootScope.polls;
      // this.polls = this.Poll.polls;
      let categories = _.uniq(_.map(this.Poll.polls, 'category'));
      this.$rootScope.categories = categories;
      this.localStorageService.set('categories', categories);
        _setWatchOnSearch();

    }

    this.$rootScope.$on('myPolls', (event, val)=>{
      if (val) {
        let user = this.Auth.getCurrentUserSync();
        self.filtered = _.filter(self.filtered, {createdBy:  user._id})
      }
      else
        self.filtered = self.filterFilter(self.Poll.polls, self.$scope.search);

      self.noOfPages = Math.ceil(self.filtered.length / self.entryLimit);

      self.isMyPollsDemand = val;
    })

    this.$rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      self.$rootScope.$broadcast('navShowAll');
    });
  }


  nextClick() {
    this.currentPage = this.currentPage + 1;
  }

  editPoll(poll) {
    this.$state.go('edit-poll').then(()=>{
      this.$rootScope.$broadcast('poll', poll);
    });
  }

  deletePoll(poll) {
    let self = this;

    this.Poll.$resource.delete({
      id: poll._id
    }).$promise
    .then(() => {
      self.Poll.polls.splice(self.Poll.polls.indexOf(poll), 1);
      self.filtered.splice(self.filtered.indexOf(poll), 1);
      self.noOfPages = Math.ceil(self.filtered.length / self.entryLimit);
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
  // added to body in _index.html
  .directive('keyTrap', function() {
    return function( scope, elem ) {
      elem.bind('keydown', function( event ) {
        if (event.keyCode === 37 || event.keyCode === 39)
          scope.$broadcast('keydown', event.keyCode );
      });
    };
  })
  .filter('startFrom', startFrom)
  .name;
