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

  // {op:"replace", path:"/firstName", value:"Joachim" },
  // {op:"add", path:"/lastName", value:"Wester" },
  // {op:"add", path:"/contactDetails/phoneNumbers/0", value:{ number:"555-123" }

  vote() {
    let myChoice = this.myChoice.index;
    let path = "/choices/" + this.myChoice.index + "/votes/" + ++this.chartData[myChoice] + '/userId'

    this.Poll.vote({
      id: this.data._id
    }, {
      op: "add",
      path,
      value: "anonymous"
    }).$promise.then(res => {
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