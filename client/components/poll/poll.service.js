'use strict';

export default function UserResource($resource) {
  'ngInject';

  return $resource('/api/polls/:id/:vote', {
    id: '@_id'
  }, {
  vote: {method:'POST', params: {vote: 'vote'}},
  update: { method:'PUT' }
 });
}
