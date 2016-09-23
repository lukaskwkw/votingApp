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

    //check if user already perform vote
    console.log(this.signature);
    this.isVoted = false;

    this.isVoted = !this.data.choices.every(choice=>{
      return choice.votes.every(vote=>{

        return vote.userId !== this.signature;
      })
    });


  }

  vote() {
    this.isVoted = true;
    let myChoice = this.myChoice.index;

    this.Poll.vote({
      id: this.data._id,
      choice: myChoice
    }).$promise.then(res => {
      this.chartData[myChoice]++;

      this.isVoted = true;
      console.log(res);
    }).catch(err => {
      console.log(err);

      if (err.data === 'Already voted!')
        return this.isVoted = true;
      this.isVoted = false;
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
      data: '=',
      signature: '='
    },
    controller: PollComponent
  })
  .name;