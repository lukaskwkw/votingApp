'use strict';

import _ from 'lodash';

export default class PollBuilderController {

  /*@ngInject*/

  constructor($resource, Poll, $rootScope, ngNotify, $scope, localStorageService) {
    this.Poll = Poll;
    this.butttonCaption = 'Add Poll';
    this.$resource = $resource;
    this.question = '';
    this.$rootScope = $rootScope;
    this.options = [{
      opt: ''
    }];
    this.localStorageService = localStorageService;
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

    this.chartType = this.chartTypes[0];

    // TODO: dodanie opcji tworzenia nowej kategorii jesli zadna nam nie pasuje
    this.categories = [];
    if (this.$rootScope.categories) {
      this.categories = this.$rootScope.categories;
    }
    else {
      this.categories = this.localStorageService.get('categories');

    if (!this.categories) {
      this.Poll.query().$promise.then(resPolls => {
        this.categories = _.uniq(_.map(resPolls, 'category'));
        this.$rootScope.categories = categories;
        this.localStorageService.set('categories', categories);
      });
    }
    }
    // TODO: a jesli nie ma localDB to sciagnij albo zrobic tak zeby uzytkownik mogl sam wybrac kategorie

    this.categories.push('Add new...')
    console.log(this.categories);

    this.parsedData = [{
      category: 'Tech'
    }, {
      category: 'Web'
    }]
    this.selectedCategory = this.categories[0];
    this.created = false;
    this.ngNotify = ngNotify;
    // this.labels = this.options.
    this.labels = _.map(this.options, 'opt');
    this.chartData = [_.random(1, 5)]
    console.log(this.labels);

    this.$scope = $scope;
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

  $onInit() {
  }

  submitPoll() {
    this.submitted = true;

    let choices = this.options.map(function(elem) {
      return {
        text: elem.opt,
        votes: []
      }
    });

    let formData = {
      category: this.selectedCategory,
      question: this.question,
      choices,
      chartType: this.chartType.id
    }

    this.Poll.save(formData).$promise.then(res => {

      // set timeStamp to 0 to pull db from server in order to see changes immediately
      // instead wait 30 sec for pull request to db

      this.localStorageService.remove('PollsDB');
      this.ngNotify.set(`Your pool ${this.question} has been successfully created`, {
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

}