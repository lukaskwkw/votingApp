'use strict';

export default class LoginController {

  /*@ngInject*/
  constructor(Auth, $state, ngNotify) {
    this.Auth = Auth;
    this.$state = $state;
    this.ngNotify = ngNotify;
  }

  login(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
        .then(user => {
          console.log(user);
          this.ngNotify.set(`Hello ${user.name}. You have logged successfully`, {
              type: 'success',
              duration: 5000
          });

          // Logged in, redirect to home
          this.$state.go('main');
        })
        .catch(err => {
          this.ngNotify.set(err.message, {
              type: 'error',
              duration: 5000
          });
          this.errors.login = err.message;
        });
    }
  }
}
