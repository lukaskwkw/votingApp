'use strict';

export default function PollResource($resource) {
	'ngInject';
	//storage for polls
	var polls = null;
	var $resource = $resource('/api/polls/:id/:vote', {
			id: '@_id',
			choice: '@choice'
		}, {
			vote: {
				method: 'POST',
				params: {
					vote: 'vote'
				}
			},
			update: {
				method: 'PUT'
			}
		});
	return  {polls, $resource};
}