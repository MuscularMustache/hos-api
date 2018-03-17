const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString
} = graphql;
const UserType = require('./types/user_type');
const AuthService = require('../services/auth');

// since we can do a password confirmation on the frontend we don't need to send
//- a password and pw confirmation to the backend
// the return in the resolve is necessary because it responds with a promise so gql will wait until its resolved
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, { email, password }, req) {
        return AuthService.signup({ email, password, req });
      }
    },
    logout: {
      type: UserType,
      // NOTE: since theres no args here we dont pass anything into the mutation
      resolve(parentValue, args, req) {
        // when we call req.logout it returns the user property off the request
        //- we need to return something from the resolve so we save the user in a const before
        //- logging out and sending it along
        const { user } = req;
        req.logout();
        return user;
      }
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parentValue, { email, password }, req) {
        return AuthService.login({ email, password, req });
      }
    }
  }
});

module.exports = mutation;
