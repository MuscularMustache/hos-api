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

//  NOTE: THIS IS CURRENTLY NOT GETTING HIT AT ALL
GameSchema.statics.createGame = function(userId, gameId) {
  const List = mongoose.model('list');
  const User = mongoose.model('user');

  return this.findById(gameId).then(game => {

    // this also seems really inefficient
    return List.find({user: userId, pullForGame: true}, (err, allLists) => {
      console.log('all lists', allLists);
      return;
    // let lists = List.find({}, (err, allLists) => {
      if (err) { return err; }

      // NOTE: not rellevant if bottom code is not user list.user.toString() === userId  or  list.user == userId
      // const activeUserLists = allLists.filter(list => {
      //   return list.pullForGame && (list.user.toString() === userId);
      // });

      // return activeUserLists;

      game.lists.push(...activeUserLists);

      // return game.save().then(game => game);

      return game.save();
    });

    // return game.update({ lists }, {}, (err, rawResponse) => {
    //   console.log(err);
    // });

    // console.log(lists);
    // return game.save();

  });
}

mongoose.model('game', GameSchema);
