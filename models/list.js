const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  title: { type: String },
  listType: { type: String, default: 'custom' },
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

ListSchema.statics.findUser = function(id) {
  return this.findById(id)
    .populate('user')
    .then(list => list.user );
}

ListSchema.statics.togglePull = function(id) {
  return this.findById(id).then(list => {
    // toggle boolean
    list.pullForGame = !list.pullForGame;
    return list.save();
  });
}

ListSchema.statics.editList = function(id, title) {
  return this.findById(id).then(list => {
    list.title = title;
    return list.save();
  });
}

ListSchema.statics.removeListAndConsequences = function(id) {
  return this.findById(id).then(list => {
    list.consequences.forEach(con => {
      // grab the consequence model to search for this lists inner consequences
      mongoose.model('consequence').findById(con).then(innerCon => {
        return innerCon.remove();
      }).catch(err => { return err; });
    });
    return list.remove();
  });
}

mongoose.model('list', ListSchema);
