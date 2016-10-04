'use strict';

import angular from 'angular';

export default class SignupController {

  /*@ngInject*/
  constructor(Auth, $timeout, $state, ngNotify) {
    this.Auth = Auth;
    this.$state = $state;
    this.ngNotify = ngNotify;
    this.$timeout = $timeout;
  }

  register(form) {
    this.submitted = true;

    if(form.$valid) {
      return this.Auth.createUser({
        name: this.user.name,
        email: this.user.email,
        password: this.user.password
      })
        .then((user) => {
          // Account created, redirect to home
          this.ngNotify.set(`User ${user.name} have been successfully created`, {
              type: 'success',
              duration: 5000
          });
          this.$state.go('main');
        })
        .catch(err => {
          err = err.data;
          this.errors = {};
          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });
        });
    } else {
      this.$timeout(()=>{
        this.submitted = false;
      }, 2300);
      return;
    }
  }
}
