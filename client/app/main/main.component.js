import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  /*@ngInject*/
  constructor(Poll, Auth, filterFilter, $scope, localStorageService) {
    this.Auth = Auth;
    this.Poll = Poll;
    this.$scope = $scope;
    this.filterFilter = filterFilter;
    this.localStorageService = localStorageService;
    this.polls = [];
  }

  _getTimeDiff(timeStampThenInSec) {
    let now = Math.ceil(new Date().getTime() / 1000);
    let timeDiff = now - timeStampThenInSec;
    return timeDiff;
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


    this.Auth.getCurrentUser().then(user => {
      this.currentUser = user;

      if (!this.currentUser._id)
        this.currentUser._id = null;
    });
  }

  deletePoll(poll) {
    console.log(this.polls.indexOf(poll));

    this.Poll.delete({
      id: poll._id
    }).$promise(() => {
      this.polls.splice(this.polls.indexOf(poll), 1);
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