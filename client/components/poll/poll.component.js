'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';
import PollResource from './poll.service';

export class PollComponent {

  constructor(Poll) {
    'ngInject';
    this.Poll = Poll;

    this.myChoice = {
      index: null
    };

    //check if user already perform vote
    this.isVoted = false;

    this.isVoted = !this.data.choices.every(choice => {
      return choice.votes.every(vote => {
        return vote.userId !== this.signature;
      });
    });
  }

  $onInit() {
    this.labels = this.data.choices.map(elem => {
      return elem.text;
    });
    this.chartData = this.data.choices.map(elem => {
      return elem.votes.length;
    });
  }

  vote() {
    this.isVoted = true;

    let choice = this.myChoice.index === 'custom' ? this.customChoice : this.myChoice.index;

    this.Poll.vote({
      id: this.data._id,
      choice
    }).$promise.then(res => {
      if(this.myChoice.index === 'custom') {
        this.labels.push(choice);
        this.chartData.push(1);
      } else
        this.chartData[choice]++;

      this.isVoted = true;
      console.log(res);
    }).catch(err => {
      console.log(err);

      if(err.data === 'Already voted!')
        return this.isVoted = true;
      this.isVoted = false;
    });
  }

}

export default angular.module('directives.poll', [])
  .factory('Poll', PollResource)
  .component('poll', {
    template: require('./poll.html'),
    bindings: {
      data: '=',
      signature: '='
    },
    controller: PollComponent
  })
  .name;
