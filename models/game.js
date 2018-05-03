const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  lists: [{
    type: Schema.Types.ObjectId,
    ref: 'list'
  }]
});

GameSchema.statics.findActiveLists = function(id) {
  return this.findById(id)
    .populate('lists')
    .then(game => game.lists);
}

mongoose.model('game', GameSchema);
