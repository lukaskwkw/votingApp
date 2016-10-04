'use strict';

import _ from 'lodash';

export default class PollEditController {

  /*@ngInject*/

  constructor($resource, $state, $timeout, Poll, ngNotify, $scope, $rootScope, localStorageService) {
    this.butttonCaption = 'Update';
    this.$state = $state;
    this.$timeout = $timeout;

    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.pollToEdit = null;
    this.newCategory = null;
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

    this.Poll = Poll;
    this.$resource = $resource;
    // this.options = [{
    //   opt: ''
    // }];

    this.localStorageService = localStorageService;


    // TODO: dodanie opcji tworzenia nowej kategorii jesli zadna nam nie pasuje
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

      this.categories.push('Add new...')
      this.selectedCategory = this.categories[0];

      this.created = false;
      this.ngNotify = ngNotify;

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

      this.selectedCategory = poll.category;
      console.log(this.labels);
      console.log(this.chartType);

    });

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

    // TODO: poll-edit sprawdzic jesli wybrana opcjia New category i jesli jest pusty input to niedopuscic do wyslania


    let choices = this.options.map(function(elem) {
      return {
        text: elem.opt,
        votes: elem.votes || []
      }
    });

    let formData = {
      category: this.selectedCategory,
      question: this.question,
      choices,
      chartType: this.chartType.id
    }

    this.Poll.$resource.update({id:this.pollToEdit._id}, formData).$promise.then(res => {


      if (this.newCategory)
        this.$rootScope.categories.push(this.newCategory);


      this.ngNotify.set(`Your pool ${this.question} has been successfully updated`, {
        type: 'info',
        duration: 4000
      });

      let poll = formData;

      //set properties from response for storage in Poll service
      poll.createdBy = res.createdBy;
      poll._id = res._id;
      let foundedIndex = _.findIndex(this.Poll.polls, {_id: poll._id})

      this.Poll.polls[foundedIndex] = poll;
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