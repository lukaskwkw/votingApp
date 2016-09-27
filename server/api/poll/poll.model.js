'use strict';

import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var VoteSchema = new Schema({userId: String});

var ChoiceSchema = new Schema({
	                                        text: {
		                                        type: String,
		                                        required: true
	},
	                                        votes: [VoteSchema]
});

var PollSchema = new Schema({
	                                        category: {
		                                        type: String,
		                                        required: true
	},
	                                        question: {
		                                        type: String,
		                                        required: true
	},
	                                        createdBy: String,
	                                        choices: [ChoiceSchema]
});

export default mongoose.model('Poll', PollSchema);
