import { ApolloError } from 'apollo-server-express';
import {  shield, allow } from 'graphql-shield';

export default shield(
  {
    Query: {},
    Content: {
      author: allow,
    }
  },
  {
    fallbackError: new ApolloError("Not Authorized!", "ERR0001"),
    allowExternalErrors: true,
  }
);