const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConsequenceSchema = new Schema({
  list: {
    type: Schema.Types.ObjectId,
    ref: 'list'
  },
  content: { type: String }
});

ConsequenceSchema.statics.editConsequence = function(id, content) {
  return this.findById(id).then(consequence => {
    consequence.content = content;
    return consequence.save();
  });
}

// add these if i want to track each pull and pick
// to get a select percentage for consequence comparisons
// pulls: { type: Number, default: 0 },
// picks: { type: Number, default: 0 },

//NOTE: would also need to add pull and pick functions here

mongoose.model('consequence', ConsequenceSchema);
