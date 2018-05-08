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

GameSchema.statics.startGame = function(userId) {
  const List = mongoose.model('list');
  return this.find({user: userId}).then(game => {
    if (game.length === 0) {
      return List.find({user: userId, pullForGame: true}).then(lists => {
        return (new this({ user: userId, lists })).save();
      });
    }
  });
}

mongoose.model('game', GameSchema);
