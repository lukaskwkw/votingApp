'use strict';

export default class PollBuilderController {

  /*@ngInject*/

  constructor($resource, Poll, ngNotify) {
    this.Poll = Poll;
    this.$resource = $resource;
    this.question = '';
    this.options = [{ opt : ''}];
    this.parsedData = [{ category: 'Tech'},{category: 'Web'}]
    this.selectedCategory = this.parsedData[0];
    this.created = false;
    this.ngNotify = ngNotify;
  }

  createPoll() {
    // let Poll = this.$resource('/api/polls/:id/', {
          // id: '@_id'
        // });

    let choices = this.options.map(function (elem) {
        return {
          text: elem.opt,
          votes: []
        }});

    let formData = {
      category: this.selectedCategory.category,
      question: this.question,
      choices
    }

    this.Poll.save(formData).$promise.then(res => {
      this.ngNotify.set(`Your pool ${this.question} has been successfully created`, {
          type: 'info',
          duration: 5000
      });
      console.log(res);
    }).catch(err=> {
      this.ngNotify.set(err.message, {
          type: 'error',
          duration: 5000
      });
    });

    this.submitted = true;
  }

}
