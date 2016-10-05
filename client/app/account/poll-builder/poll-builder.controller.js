'use strict';

import _ from 'lodash';

export default class PollBuilderController {

  /*@ngInject*/

  constructor($resource, $timeout, Poll, $rootScope, ngNotify, $scope, localStorageService) {
    this.Poll = Poll;
    this.$timeout = $timeout;
    this.butttonCaption = 'Add Poll';
    this.$resource = $resource;
    this.question = '';
    this.newCategory = null;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
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

    this.categories = [];
    if (this.$rootScope.categories) {
      this.categories = this.$rootScope.categories;
    }
    else {
      this.categories = this.localStorageService.get('categories');

    if (!this.categories) {
      this.Poll.$resource.query().$promise.then(resPolls => {
        this.categories = _.uniq(_.map(resPolls, 'category'));
        this.$rootScope.categories = this.categories;
        this.localStorageService.set('categories', this.categories);
      });
    }
    }

    this.categories.push('Add new...');

    this.selectedCategory = this.categories[0];
    this.created = false;
    this.ngNotify = ngNotify;
    // this.labels = this.options.
    this.labels = _.map(this.options, 'opt');
    this.chartData = [_.random(1, 5)];

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

  submitPoll(form) {
    this.submitted = true;

    if(!form.$valid) {
      this.$timeout(()=>{
        this.submitted = false;
      }, 2300);
      return;
    }

    if (this.selectedCategory === this.categories[this.categories.length-1])
      if (!this.newCategory) {
        this.submitted = false;
        return;
      }
        else
        this.selectedCategory = this.newCategory;

    // TODO: sprawdzic jesli wybrana opcjia New category i jesli jest pusty input to niedopuscic do wyslania

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

    this.Poll.$resource.save(formData).$promise.then(res => {

      if (this.newCategory)
        this.$rootScope.categories.push(this.newCategory);

      let poll = formData;

      //set properties from response for storage in Poll service
      poll.createdBy = res.createdBy;
      poll._id = res._id;

      //  TODO: z tym serwisem this.Poll mozna by zrobic setter ze jak nie ma polli to niech pobierze baze danych
      this.Poll.polls.push(poll);
      this.ngNotify.set(`Your pool ${this.question} has been successfully created`, {
        type: 'info',
        duration: 4000
      });
    }).catch(err => {
      this.submitted = false;

      this.ngNotify.set(err.data.message || "Server Error. Did you filled poll properly?", {
        type: 'error',
        duration: 4000
      });
    });

  }

}
