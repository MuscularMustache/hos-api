const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID } = graphql;
const UserType = require('./types/user_type');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // this user is the currently logged in user
    user: {
      type: UserType,
      resolve(parentValue, args, req) {
        // returns user if authenticated and null if it is not
        return req.user;
      }
    }
  }
});

module.exports = RootQueryType;
