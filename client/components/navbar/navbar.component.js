'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {

  constructor(Auth, $rootScope, $state) {
    'ngInject';

    this.isCollapsed = true;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.$rootScope = $rootScope;
    this.$state = $state;
    this.isMyPollsClicked = false;
    this.myPollsCaption = 'My polls';

    this.$rootScope.$on('navShowAll', ()=>{
      this.isMyPollsClicked = false;
      this.myPollsCaption = 'My polls';

    })
  }

  pollsClick() {
      this.isMyPollsClicked = false;
      this.myPollsCaption = 'My polls';
      this.$rootScope.$broadcast('myPolls', this.isMyPollsClicked);
  }

  myPollsClick() {
    if (!this.isLoggedIn()) {
      this.$state.go('login');

      return;
    }
    this.$state.go('main').then( () => {
      this.isMyPollsClicked = !this.isMyPollsClicked;
      this.myPollsCaption = this.isMyPollsClicked ? 'Show all' : 'My polls';
      this.$rootScope.$broadcast('myPolls', this.isMyPollsClicked);

    });

  }


}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
