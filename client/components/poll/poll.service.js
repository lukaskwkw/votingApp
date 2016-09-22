'use strict';

export default function UserResource($resource) {
  'ngInject';

  return $resource('/api/polls/:id/', {
    id: '@_id'
  }, {
  vote: {method:'PATCH'}
 });
}
