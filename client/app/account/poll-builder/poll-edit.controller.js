'use strict';

import _ from 'lodash';

export default class PollEditController {

  /*@ngInject*/

  constructor($resource, $state, Poll, ngNotify, $scope, $rootScope, localStorageService) {
    this.butttonCaption = 'Update';
    this.$state = $state;
    this.$scope = $scope;
    this.pollToEdit = null;
    this.chartData = [];
    this.labels = [];

    this.chartTypes = [{
      type: 'pie',
      id: 1
    }, {
      type: 'bar',
      id: 2
    }, {
      type: 'doughnut',
      id: 3
    }, {
      type: 'horizontal-bar',
      id: 4
    }, {
      type: 'polar-area',
      id: 5
    }];


    this.$scope.$on('poll', (event, poll) => {
      this.pollToEdit = poll;
      this.question = this.pollToEdit.question;
      let chartId = this.pollToEdit.chartType;

      this.options = (_.map(this.pollToEdit.choices, (elem)=> {
        this.chartData.push(elem.votes.length);
        return {opt: elem.text, votes: elem.votes};
      }));

      this.labels = _.map(this.options, 'opt');

      this.chartType = _.find(this.chartTypes, {id: chartId});
      console.log(this.labels);
      console.log(this.chartType);

    });

    this.Poll = Poll;
    this.$resource = $resource;
    // this.options = [{
    //   opt: ''
    // }];

    this.localStorageService = localStorageService;


    // TODO: dodanie opcji tworzenia nowej kategorii jesli zadna nam nie pasuje
    this.categories = [];
    let localDB = this.localStorageService.get('PollsDB');
      if (localDB)
        _.forEach(localDB, elem => {
          if (this.categories.indexOf(elem.category) === -1)
            this.categories.push(elem.category);
        });
      this.categories.push('Add new...')
      console.log(this.categories);

      this.selectedCategory = this.categories[0];
      this.created = false;
      this.ngNotify = ngNotify;
      // this.labels = this.options.


      console.log(this.labels);

    }

    submitPoll() {
    this.submitted = true;
    console.log(this.pollToEdit);

    let choices = this.options.map(function(elem) {
      return {
        text: elem.opt,
        votes: elem.votes || []
      }
    });

    console.log(choices);

    let formData = {
      category: this.selectedCategory,
      question: this.question,
      choices,
      chartType: this.chartType.id
    }

    this.Poll.update({id:this.pollToEdit._id}, formData).$promise.then(res => {

      // set timeStamp to 0 to pull db from server in order to see changes immediately
      // instead wait 30 sec for pull request to db

      // this.localStorageService.remove('PollsDB');
      this.ngNotify.set(`Your pool ${this.question} has been successfully updated`, {
        type: 'info',
        duration: 4000
      });
      console.log(res);
    }).catch(err => {
      this.submitted = false;

      this.ngNotify.set(err.data.message || "Server Error. Did you filled poll properly?", {
        type: 'error',
        duration: 4000
      });
    });

  }

    addOptionClick() {
      this.options.push({
        opt: ''
      });
      this.labels = _.map(this.options, 'opt');
      this.chartData.push(_.random(1, 5));
    }

    removeOptionClick($index) {
      this.options.splice($index, 1);
      this.labels.splice($index, 1);
      this.chartData.splice($index, 1);
    }


  }