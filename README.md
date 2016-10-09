# VotePlexer

## Getting Started

MEAN stack Voting app. Vote on polls, create own and share them on social media. Chart.js for
displaying aggregate votes. Technologies: ES6, AngularJS 1.5, UI Bootstrap. PassportJS
authentication for twitter OAuth. Lusca for XSS, CSRF protection.

* Votes for unauthenticated users are saved by client IP address.

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `npm install` to install server dependencies.

2. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

3. Run `gulp serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `gulp build` for building and `gulp serve` for preview.

## Testing

Running `npm test` will run the unit tests with karma.
