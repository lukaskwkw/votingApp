'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';
import PollResource from './poll.service';

export class PollComponent {

  constructor(Poll, $scope, ngNotify, localStorageService) {
    'ngInject';
    this.Poll = Poll;
    this.localStorageService = localStorageService;
    this.ngNotify = ngNotify;
    this.myChoice = {
      index: null
    };

    this.$scope = $scope;

    this.labels = [];

    this.isVoted = false;

    this.votedChoiceIndex = null;

    if (!this.data.chartType)
      this.data.chartType = 1;

    this.isVoted = !this.data.choices.every((choice, index) => {
      this.votedChoiceIndex = index;
      return choice.votes.every(vote => {
        return vote.userId !== this.signature;
      });

      if (this.isVoted)
        this.myChoice.index = this.votedChoiceIndex;

    });

/* TODO: dac zeby kolor byl na zielono podswietlany i wylaczyc mozliwosc wyboru np dac disabled na panelu czyc cos*/
/* TODO: jak nie jest po IP (niezalogowany user) to po kliknieciu zaznaczac i wylaczac przycisk (disabled);)*/
//       albo sciagnac IP z serwera i przefiltrowac baze w poszukiwaniu IP-ka
/* TODO: zmniejszyc czcionke odstepy zaby pulle byly mniejsze */

  }

  $onInit() {


    this.isVoted = !this.data.choices.every((choice, index) => {
      this.votedChoiceIndex = index;
      return choice.votes.every(vote => {
        return vote.userId !== this.signature;
      });
    });

    if (this.isVoted)
      this.myChoice.index = this.votedChoiceIndex;


    this.labels = this.data.choices.map(elem => {
      return elem.text;
    });
    this.chartData = this.data.choices.map(elem => {
      return elem.votes.length;
    });
  }

  vote($index) {
    this.isVoted = true;

    let choice = this.myChoice.index === 'custom' ? this.customChoice : this.myChoice.index;
    if ($index !== undefined)
      choice = $index;

    console.log('data', this.data);
    console.log(choice);
    this.Poll.$resource.vote({
      id: this.data._id,
      choice
    }).$promise.then(res => {

      var choiceText = '';
      if(this.myChoice.index === 'custom') {
        choiceText = choice;
        console.log(choice);
        this.data.choices.push({text: choice, votes: [{userId: this.signature}]});
        this.labels.push(choice);
        this.chartData.push(1);
        this.myChoice.index = this.labels.length-1;
      } else {
        this.data.choices[choice].votes.push({userId: this.signature});
        choiceText = this.labels[choice];
        this.chartData[choice]++;
      }

      this.isVoted = true;
      // this.localStorageService.remove('PollsDB');
      console.log(res);


      /* TODO: zamienic to zeby podswietlalo na zielono na opcje na ktora zaglosowalem */
      this.ngNotify.set(`You voted on ${choiceText} `, {
          type: 'info',
          duration: 3000
      });

    }).catch(err => {
      console.log(err);
      this.ngNotify.set(err.data, {
          type: 'error',
          duration: 3000
      });
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
