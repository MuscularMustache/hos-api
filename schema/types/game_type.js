const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString
} = graphql;
const listType = require('./list_type');
const Game = mongoose.model('game');

const GameType = new GraphQLObjectType({
  name:  'GameType',
  fields: () => ({
    id: { type: GraphQLID },
    lists: {
      type: new GraphQLList(listType),
      resolve(parentValue) {
        return Game.findActiveLists(parentValue.id);
      }
    }
  })
});

module.exports = GameType;
