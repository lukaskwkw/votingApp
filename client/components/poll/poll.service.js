'use strict';

export default function UserResource($resource) {
	'ngInject';

	return $resource('/api/polls/:id/:vote', {
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
}