const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  title: { type: String },
  customList: { type: Boolean, default: true },
  pullForGame: { type: Boolean, default: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  consequences: [{
    type: Schema.Types.ObjectId,
    ref: 'consequence'
  }]
});

ListSchema.statics.addConsequence = function(id, content) {
  const Consequence = mongoose.model('consequence');

  return this.findById(id)
    .then(list => {
      const consequence = new Consequence({ content, list })
      list.consequences.push(consequence)
      return Promise.all([consequence.save(), list.save()])
        .then(([consequence, list]) => list);
    });
}

ListSchema.statics.findConsequences = function(id) {
  return this.findById(id)
    .populate('consequences')
    .then(list => list.consequences);
}

mongoose.model('list', ListSchema);
