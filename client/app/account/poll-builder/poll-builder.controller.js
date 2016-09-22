'use strict';

export default class PollBuilderController {

  /*@ngInject*/

  constructor($resource, Poll) {
    this.Poll = Poll;
    this.$resource = $resource;
    this.question = '';
    this.options = [{ opt : ''}];
    this.parsedData = [{ category: 'Tech'},{category: 'Web'}]
    this.selectedCategory = this.parsedData[0];
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
      console.log(res);
    })

    this.submitted = true;
  }

}
