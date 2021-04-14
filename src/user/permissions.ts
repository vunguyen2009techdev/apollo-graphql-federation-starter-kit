import { ApolloError } from 'apollo-server-express';
import { or, and, rule, shield } from 'graphql-shield';

function getPermissions(user: any) {
  return user?.permissions ?? [];
}

const isAuthenticated = rule()(
  async (_parent, _args, { user }) => {
    return user !== null;
  }
)

const canReadAnyAccount = rule()(
  async (_parent, _args, { user }) => {
    const userPermissions = getPermissions(user);
    return userPermissions.includes('readAny');
  }
);

const canReadOwnAccount = rule()(
  async (_parent, _args, { user }) => {
    const userPermissions = getPermissions(user);
    return userPermissions.includes('readOwn');
  }
);

const isReadingOwnAccount = rule()(
  async (_parent, { id }, { user }) => {
    return id === user?.sub;
  }
);

export default shield(
  {
    Query: {
      me: isAuthenticated,
      user: or(and(canReadOwnAccount, isReadingOwnAccount), canReadAnyAccount),
      users: canReadAnyAccount,
    }
  },
  {
    fallbackError: new ApolloError("Not Authorized!", "ERR0001"),
    allowExternalErrors: true,
  }
);