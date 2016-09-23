'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';
import PollResource from './poll.service';

export class PollComponent {

  constructor($attrs, Poll) {
    'ngInject';
    this.Poll = Poll;
    this.myChoice = {
      index: null
    };
  }

  vote() {
    let myChoice = this.myChoice.index;
    let path = "/_doc/choices/" + myChoice + "/votes"

    this.data.choices[myChoice].votes.push({userId: 'anonymous'});

    this.Poll.update({
      id: this.data._id
    }, this.data).$promise.then(res => {
      this.chartData[myChoice]++;

      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  }


  $onInit() {

    this.labels = this.data.choices.map(elem => {
      return elem.text;
    })
    this.chartData = this.data.choices.map(elem => {
      return elem.votes.length;
    })
  }
}

  export default angular.module('directives.poll', [])
    .factory('Poll', PollResource)
    .component('poll', {
      template: require('./poll.html'),
      bindings: {
        data: '='
      },
      controller: PollComponent
    })
    .name;