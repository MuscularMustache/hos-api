const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString
} = graphql;
const listType = require('./list_type');
const userType = require('./user_type');
const List = mongoose.model('list');
const Game = mongoose.model('game');

const GameType = new GraphQLObjectType({
  name:  'GameType',
  fields: () => ({
    id: { type: GraphQLID },
    user: {
      type: userType,
      resolve(parentValue) {
        // find user from models
        console.log('here');
        return List.findUser(parentValue.id);
      }
    },
    lists: {
      type: new GraphQLList(listType),
      resolve(parentValue) {
        return Game.findActiveLists(parentValue.id);
      }
    }
  })
});

module.exports = GameType;
